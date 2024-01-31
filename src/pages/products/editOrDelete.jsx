import ProductHeadline from "@/web/components/ProductHeadline";
import Pagination from "@/web/components/ui/Pagination";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { readResource, deleteResource } from "@/web/services/apiClient";
import { useRouter } from "next/router";

export const getServerSideProps = ({ query: { page } }) => ({
  props: {
    page: parseInt(page, 10) || 1,
  },
});

const DeletePage = ({ page }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["products", page],
    queryFn: () => readResource("products", { params: { page } }),
  });

  const deleteMutation = useMutation({
    mutationFn: (productId) => deleteResource(`products/${productId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["products", page]);
    },
  });

  const handleDelete = async (productId) => {
    await deleteMutation.mutateAsync(productId);
  };

  const handleEdit = (productId) => {
    router.push(`/products/edit?productId=${productId}`);
  };


  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {data.data.result.map((product) => (
        <div key={product.id}>
          <ProductHeadline {...product} />
          <button onClick={() => handleDelete(product.id)}>Delete</button>
          <button onClick={() => handleEdit(product.id)}>Edit</button>

        </div>
      ))}
      <Pagination pathname="/products/editOrDelete" page={page} countPages={data.data.meta.count} />
    </div>
  );
};

export default DeletePage;
