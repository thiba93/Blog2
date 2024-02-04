/* eslint-disable max-lines-per-function */
import { descriptionValidator, nameValidator } from "@/utils/validators"
import Button from "@/web/components/ui/Button"
import Form from "@/web/components/ui/Form"
import FormField from "@/web/components/ui/FormField"
import { createResource } from "@/web/services/apiClient"
import { useMutation } from "@tanstack/react-query"
import { Formik } from "formik"
import { useRouter } from "next/router"
import { useCallback, useEffect } from "react"
import { object } from "yup"
import { useSession } from "@/web/components/SessionContext"
import axios from "axios"

const validationSchema = object({
  name: nameValidator.required().label("Product name"),
  description: descriptionValidator.required().label("Product description"),
})
const initialValues = {
  name: "",
  description: "",
  categoryId: 1,
}
const CreatePage = () => {
  const { session } = useSession()
  const router = useRouter()
  const { mutateAsync: saveProduct } = useMutation({
    mutationFn: (product) => createResource("products", product),
  })
  useEffect(() => {
    if (!session) {
      router.push("/")
    }

    const fetchConnectedUser = async () => {
      const response = await axios.get(`/api/users/${session?.user.id}`)

      if (
        response.data.result[0].isEnabled === "disabled"
      ) {
        router.push("/")
      }
    }

    fetchConnectedUser()
  }, [router, session])
  const handleSubmit = useCallback(
    async ({ name, description, categoryId }) => {
      // eslint-disable-next-line no-unused-vars
      const { data: product } = await saveProduct({
        name,
        description,
        categoryId,
      })

      // eslint-disable-next-line capitalized-comments
      // router.push(`/products/${product.id}`)
    },
    [saveProduct, router],
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
