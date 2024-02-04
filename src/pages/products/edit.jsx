/* eslint-disable no-console */
/* eslint-disable max-lines-per-function */
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Formik } from "formik"
import { object } from "yup"
import { descriptionValidator, nameValidator } from "@/utils/validators"
import Button from "@/web/components/ui/Button"
import Form from "@/web/components/ui/Form"
import FormField from "@/web/components/ui/FormField"
import { updateResource, readResource } from "@/web/services/apiClient"
import { useSession } from "@/web/components/SessionContext"
import axios from "axios"

const EditPage = () => {
  const { session } = useSession()
  const router = useRouter()
  const { productId } = router.query
  const [initialValues, setInitialValues] = useState({
    name: "",
    description: "",
    // Ajoutez d'autres champs si nécessaire
  })
  const { data: productData, isLoading: isLoadingProduct } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => readResource(`products/${productId}`),
    enabled: Boolean(productId),
  })

  useEffect(() => {
    if (!session) {
      router.push("/")
    }

    const fetchConnectedUser = async () => {
      const response = await axios.get(`/api/users/${session?.user.id}`)

      if (
        response.data.result[0].role === "user" ||
        response.data.result[0].isEnabled === "disabled"
      ) {
        router.push("/")
      }
    }

    fetchConnectedUser()
  }, [router, session])

  useEffect(() => {
    if (productData) {
      setInitialValues({
        name: productData.data.result[0].name,
        description: productData.data.result[0].description,
        // Mettez à jour avec d'autres champs si nécessaire
      })
    }
  }, [productData])

  const validationSchema = object({
    name: nameValidator.required().label("Product name"),
    description: descriptionValidator.required().label("Product description"),
    // Ajoutez des validations pour d'autres champs si nécessaire
  })
  const { mutateAsync: updateProduct } = useMutation({
    mutationFn: (product) => updateResource(`products/${productId}`, product),
    onSuccess: () => {
      router.back()
    },
  })
  const handleSubmit = async (values) => {
    await updateProduct(values)
  }

  if (isLoadingProduct) {
    return <div>Loading...</div>
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      <Form className="bg-white p-4 rounded shadow-md space-y-4">
        <FormField
          name="name"
          label="Product name"
          placeholder="Enter a product name"
        />
        <FormField
          name="description"
          label="Product description"
          placeholder="Enter a product description"
        />
        <Button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update
        </Button>
      </Form>
    </Formik>
  )
}

export default EditPage
