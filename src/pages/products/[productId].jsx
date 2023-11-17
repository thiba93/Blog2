import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useParams } from "next/navigation"

const ProductPage = () => {
  const { productId } = useParams() || {}
  const {
    isLoading,
    data: { data: product },
  } = useQuery({
    queryKey: ["product"],
    queryFn: () => axios(`/api/products/${productId}`),
    enabled: Boolean(productId),
    initialData: { data: {} },
  })

  if (isLoading) {
    return "Loading..."
  }

  return (
    <article>
      <h1 className="text-2xl">
        {product.name} (#{product.id})
      </h1>
      <p>{product.description}</p>
    </article>
  )
}

export default ProductPage
