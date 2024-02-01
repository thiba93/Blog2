import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '@/web/components/ui/FormField';
import SubmitButton from '@/web/components/ui/SubmitButton';
import { createResource } from '@/web/services/apiClient';

const CreateUser = () => {
  const initialValues = {
    email: '',
    password: '',
    // Ajoutez d'autres champs si nécessaire
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().required('Required'),
    // Validez d'autres champs si nécessaire
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await createResource('users', values);
      // Gérez la redirection ou l'affichage de succès ici
    } catch (error) {
      // Gérez les erreurs ici
    }
    setSubmitting(false);
  };

  return (
    <div>
      <h1>Create User</h1>
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
  );
};

export default CreateUser;
