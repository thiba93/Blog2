/* eslint-disable max-lines-per-function */
import React, { useEffect } from "react"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import FormField from "@/web/components/ui/FormField"
import SubmitButton from "@/web/components/ui/SubmitButton"
import { createResource } from "@/web/services/apiClient"
import { useSession } from "@/web/components/SessionContext"
import { useRouter } from "next/router"
import axios from "axios"

const CreateUser = () => {
  const { session } = useSession()
  const router = useRouter()

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
  const initialValues = {
    email: "",
    password: "",
  }
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string().required("Required"),

  })
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await createResource("users", values)
    } catch (error) {
      // Gérez les erreurs ici
    }

    setSubmitting(false)
  }

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <FormField name="email" type="email" label="Email" />
            <FormField name="password" type="password" label="Password" />
            {/* Ajoutez d'autres champs de formulaire ici si nécessaire */}
            <SubmitButton disabled={isSubmitting}>Create User</SubmitButton>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default CreateUser
