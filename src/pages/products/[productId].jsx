/* eslint-disable max-lines-per-function */
import { useQuery, useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useRouter } from "next/router"
import { useState } from "react"
import { useSession } from "@/web/components/SessionContext"
import Alert from "@/web/components/ui/Alert"
import Button from "@/web/components/ui/Button"

const ProductPage = () => {
  const router = useRouter()
  const { productId } = router.query
  const { session } = useSession()
  const [comment, setComment] = useState("")
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () =>
      axios.get(`/api/products/${productId}`).then((res) => res.data),
    enabled: Boolean(productId),
  })
  const mutation = useMutation((newComment) =>
    axios.post("/api/comments", newComment),
  )
  const handleCommentSubmit = async (event) => {
    event.preventDefault()
    await mutation.mutate(
      {
        comment,
        productId,
        userId: session.user.id,
      },
      {
        onSuccess: () => {
          setComment("")
        },
      },
    )
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <Alert>{error.message}</Alert>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{product?.name}</h1>
      <p className="mb-4">{product?.description}</p>
      {session && (
        <form onSubmit={handleCommentSubmit} className="mt-4">
          <textarea
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Leave a comment"
            required
          />
          <Button
            type="submit"
            className="mt-2 inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={mutation.isLoading}
          >
            Post Comment
          </Button>
        </form>
      )}
      {mutation.isError && (
        <Alert className="bg-red-100 text-red-700 p-4 rounded-lg mt-4">
          Error posting comment
        </Alert>
      )}
      {mutation.isSuccess && (
        <Alert className="bg-green-100 text-green-700 p-4 rounded-lg mt-4">
          Comment posted successfully!
        </Alert>
      )}
    </div>
  )
}

export default ProductPage
