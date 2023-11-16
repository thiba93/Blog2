import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const IndexPage = () => {
  const { isLoading, data: { data: products = [] } = {} } = useQuery({
    queryKey: ["products"],
    queryFn: () => axios("/api/products"),
  })

  return (
    <div>
      <ul>
        {isLoading
          ? "Loading..."
          : products.map(({ id, name, description }) => (
              <li key={id}>
                <article>
                  <h1>{name}</h1>
                  <p>{description}</p>
                </article>
              </li>
            ))}
      </ul>
    </div>
  )
}

export default IndexPage
