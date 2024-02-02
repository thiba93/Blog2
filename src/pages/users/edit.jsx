import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '@/web/components/ui/FormField';
import SubmitButton from '@/web/components/ui/SubmitButton';
import { useRouter } from 'next/router';
import axios from 'axios';

const EditUser = () => {
  const router = useRouter();
  const { userId } = router.query;
  const [initialValues, setInitialValues] = useState({
    email: '',
    password: '',
    // Ajoutez d'autres champs si nécessaire
  });

  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get(`/api/users/${userId}`);
      setInitialValues({
        email: response.data.result[0].email,
        // Assurez-vous que le backend renvoie le mot de passe ou retirez cette ligne
        password: '',
        // Mettez à jour avec d'autres données utilisateur si nécessaire
      });
    };

    if (userId) fetchUser();
  }, [userId]);

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().required('Required'),
    // Validez d'autres champs si nécessaire
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      console.log("grnggergrwn")
      await axios.put(`/api/users/${userId}`, values);
      console.log("ouiouaai")
      // Gérez la redirection ou l'affichage de succès ici
      router.push('/users/list'); // Exemple de redirection
    } catch (error) {
      // Gérez les erreurs ici
      console.error(error);
    }
    setSubmitting(false);
  };

  return (
    <div>
      <h1>Edit User</h1>
      <Formik
        enableReinitialize // Important pour réinitialiser les valeurs initiales lorsque les données utilisateur sont chargées
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <FormField name="email" type="email" label="Email" />
            <FormField name="password" type="password" label="Password" />
            {/* Ajoutez d'autres champs de formulaire ici si nécessaire */}
            <SubmitButton disabled={isSubmitting}>Update User</SubmitButton>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditUser;
