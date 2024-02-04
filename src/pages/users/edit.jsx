/* eslint-disable no-console */
/* eslint-disable max-lines-per-function */
import React, { useEffect, useState } from "react"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import FormField from "@/web/components/ui/FormField"
import SubmitButton from "@/web/components/ui/SubmitButton"
import { useRouter } from "next/router"
import axios from "axios"
import { useSession } from "@/web/components/SessionContext"

const EditUser = () => {
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
  const { userId } = router.query
  const [initialValues, setInitialValues] = useState({
    email: "",
    password: "",
    // Ajoutez d'autres champs si nécessaire
  })

  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get(`/api/users/${userId}`)
      setInitialValues({
        email: response.data.result[0].email,
        // Assurez-vous que le backend renvoie le mot de passe ou retirez cette ligne
        password: "",
        // Mettez à jour avec d'autres données utilisateur si nécessaire
      })
    }

    if (userId) {
      fetchUser()
    }
  }, [userId])

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string().required("Required"),
    // Validez d'autres champs si nécessaire
  })
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await axios.put(`/api/users/${userId}`, values)

      router.push("/users/list")
    } catch (error) {
      console.error("Failed to update user", error.message)
    }

    setSubmitting(false)
  }

  return (
    <div>
      <h1>Edit User</h1>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <FormField name="email" type="email" label="Email" />
            <FormField name="password" type="password" label="Password" />
            <SubmitButton disabled={isSubmitting}>Update User</SubmitButton>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default EditUser
