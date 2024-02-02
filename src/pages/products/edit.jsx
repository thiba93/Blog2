import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Formik } from 'formik';
import { object } from 'yup';
import { descriptionValidator, nameValidator } from '@/utils/validators';
import Button from '@/web/components/ui/Button';
import Form from '@/web/components/ui/Form';
import FormField from '@/web/components/ui/FormField';
import { updateResource, readResource } from '@/web/services/apiClient';

const EditPage = () => {
  const router = useRouter();
  const { productId } = router.query;
  const [initialValues, setInitialValues] = useState({
    name: '',
    description: '',
    // Ajoutez d'autres champs si nécessaire
  });

  const { data: productData, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => readResource(`products/${productId}`),
    enabled: !!productId,
  });

  useEffect(() => {
    if (productData) {
      setInitialValues({
        name: productData.data.result[0].name,
        description: productData.data.result[0].description,
        // Mettez à jour avec d'autres champs si nécessaire
      });
    }
  }, [productData]);

  const validationSchema = object({
    name: nameValidator.required().label('Product name'),
    description: descriptionValidator.required().label('Product description'),
    // Ajoutez des validations pour d'autres champs si nécessaire
  });

  const { mutateAsync: updateProduct } = useMutation({
    mutationFn: (product) => updateResource(`products/${productId}`, product),
    onSuccess: () => {
      router.back();
    },
  });

  const handleSubmit = async (values) => {
    await updateProduct(values);
  };

  if (isLoadingProduct) {
    return <div>Loading...</div>;
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      <Form>
        <FormField
          name='name'
          label='Product name'
          placeholder='Enter a product name'
        />
        <FormField
          name='description'
          label='Product description'
          placeholder='Enter a product description'
        />
        <Button type='submit'>Update</Button>
      </Form>
    </Formik>
  );
};

export default EditPage;
