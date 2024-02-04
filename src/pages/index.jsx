import { pageValidator } from "@/utils/validators"
import ProductHeadline from "@/web/components/ProductHeadline"
import Pagination from "@/web/components/ui/Pagination"
import config from "@/web/config"
import { readResource } from "@/web/services/apiClient"
import { useQuery } from "@tanstack/react-query"

export const getServerSideProps = ({ query: { page } }) => ({
  props: {
    page: pageValidator.validateSync(page),
  },
})
const IndexPage = (props) => {
  const { page } = props
  const {
    isLoading,
    data: { data: { result: products, meta: { count } = {} } = {} } = {},
  } = useQuery({
    queryKey: ["products", page],
    queryFn: () => readResource("products", { params: { page } }),
  })
  const countPages = Math.ceil(count / config.pagination.limit)

  if (isLoading || !products) {
    return <div className="text-center p-32 animate-bounce">Loading...</div>
  }

  return (
    <div className="py-4 flex flex-col gap-16">
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(({ id, name, description }) => (
          <li key={id} className="bg-white p-4 rounded shadow-md">
            <ProductHeadline
              id={id}
              name={name}
              description={description}
              className="text-2xl font-bold"
            />
          </li>
        ))}
      </ul>
      <Pagination
        pathname="/"
        page={page}
        countPages={countPages}
        className="mt-4"
      />
    </div>
  )
}

export default IndexPage
