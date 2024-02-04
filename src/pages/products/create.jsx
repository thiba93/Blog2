/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable max-lines-per-function */
/* eslint-disable no-console */
import { descriptionValidator, nameValidator } from "@/utils/validators"
import Button from "@/web/components/ui/Button"
import Form from "@/web/components/ui/Form"
import FormField from "@/web/components/ui/FormField"
import { createResource } from "@/web/services/apiClient"
import { useMutation } from "@tanstack/react-query"
import { Formik } from "formik"
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"
import { object } from "yup"
import { useSession } from "@/web/components/SessionContext"

const validationSchema = object({
  name: nameValidator.required().label("Product name"),
  description: descriptionValidator.required().label("Product description"),
})
const initialValues = {
  name: "",
  description: "",
  categoryId: 1,
  userId: "",
}
const CreatePage = () => {
  const { session } = useSession()
  const router = useRouter()
  const [user, setUser] = useState(null)
  useEffect(() => {
    const fetchConnectedUser = async () => {
      try {
        const response = await fetch(`/api/users?id=${session.user.id}`)
        const data = await response.json()

        if (data && data.result && data.result.length > 0) {
          const userWithMatchingId = data.result.find(
            (user) => user.id === session.user.id,
          )

          if (userWithMatchingId) {
            setUser(userWithMatchingId)
          } else {
            console.error("User not found")
          }
        } else {
          console.error("No user in the database")
        }
      } catch (error) {
        console.error("Error fetching user data", error)
      }
    }
    fetchConnectedUser()
  }, [session.user.id])

  const { mutateAsync: saveProduct } = useMutation({
    mutationFn: (product) => createResource("products", product),
  })
  const handleSubmit = useCallback(
    async ({ name, description, categoryId }) => {
      const { data: product } = await saveProduct({
        name,
        description,
        categoryId,
        userId: session.user.id,
      })
      const productId = product.result[0].id

      router.push(`/products/${productId}`)
    },
    [saveProduct, router, session.user.id],
  )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create Product
        </h2>
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <FormField
                  name="name"
                  label="Post name"
                  placeholder="Enter a post name"
                />
                <FormField
                  name="description"
                  label="Post description"
                  placeholder="Enter a post description"
                />
                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                  disabled={isSubmitting}
                >
                  Create Post
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default CreatePage
