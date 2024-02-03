import { pageValidator } from "@/utils/validators"
import UserComponent from "@/web/components/UserComponent"
import Pagination from "@/web/components/ui/Pagination"
import config from "@/web/config"
import { readResource, deleteResource } from "@/web/services/apiClient"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"

export const getServerSideProps = ({ query: { page } }) => ({
  props: {
    page: pageValidator.validateSync(page),
  },
})
const UsersPage = (props) => {
  const { page } = props
  const {
    isLoading,
    data: { data: { result: users, meta: { count } = {} } = {} } = {},
  } = useQuery({
    queryKey: ["users", page],
    queryFn: () => readResource("users", { params: { page } }),
  })
  const countPages = Math.ceil(count / config.pagination.limit)

  if (isLoading || !users) {
    return <div className="text-center p-32 animate-bounce">Loading...</div>
  }

  const handleDelete = async (userId) => {
    if (window.confirm.bind(window)("Are you sure you want to delete this user?")) {
      await deleteResource(["users", userId])
      // Refresh the list or handle the UI update accordingly
      window.location.reload()
    }
  }
  

  return (
    <div className="py-4 flex flex-col gap-16">
      <ul className="flex flex-col gap-8">
      {users.map((user) => (
  <li key={user.id} className="flex justify-between items-center">
    <Link href={`/users/${user.id}`}>
      <UserComponent {...user} />
    </Link>
    <div>
      <Link href={`/users/edit?userId=${user.id}`} passHref>
        <button>Edit</button>
      </Link>
      <button onClick={() => handleDelete(user.id)}>Delete</button>
    </div>
  </li>
))}
      </ul>
      <Pagination pathname="/users/list" page={page} countPages={countPages} />
    </div>
  )
}

export default UsersPage
