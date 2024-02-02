import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";

const ProductPage = () => {
  const {
    query: { productId },
  } = useRouter();

  const fetchProduct = async (productId) => {
    try {
      const response = await axios.get(`/api/products/${productId}`);
      
      return response.data;

    } catch (error) {
      console.error("Failed to fetch product data:", error);
      
      throw new Error("Failed to fetch product data");
    }
  };

  const {
    isLoading,
    isError,
    error,
    data: product,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId),
    enabled: !!productId 
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return (
      <div>Error loading product: {error.message}</div>
    );
  }
  if (!product || Object.keys(product).length === 0) {
    return <div>No product data available.</div>;
  }


  return (
    <article>
      <h1 className="text-2xl">
        {product.result[0].name} (#{productId})
      </h1>
      <p>{product.result[0].description}</p>
    </article>
  );
};

export default ProductPage;
