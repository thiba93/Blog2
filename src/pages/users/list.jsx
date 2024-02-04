/* eslint-disable max-lines-per-function */
import UserComponent from "@/web/components/UserComponent"
import Button from "@/web/components/ui/Button"
import Pagination from "@/web/components/ui/Pagination"
import config from "@/web/config"
import { readResource, deleteResource } from "@/web/services/apiClient"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useSession } from "@/web/components/SessionContext"
import axios from "axios"

export const getServerSideProps = ({ query: { page } }) => ({
  props: {
    page: parseInt(page, 10) || 1,
  },
})
const UsersPage = ({ page }) => {
  const router = useRouter()
  const { session } = useSession()

  useEffect(() => {
    if (!session) {
      router.push("/")
    }

    const fetchConnectedUser = async () => {
      const response = await axios.get(`/api/users/${session?.user.id}`)
      
      if (
        response.data.result[0].role === "user" ||
        response.data.result[0].isEnabled === "disabled"
      ) {
        router.push("/")
      }
    }

    fetchConnectedUser()
  }, [router, session])
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
    if (window.confirm.bind("Are you sure you want to delete this user?")) {
      await deleteResource(["users", userId])
      window.location.reload()
    }
  }
  const handleEdit = (userId) => {
    router.push(`/users/edit?userId=${userId}`)
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
            <Button onClick={() => handleEdit(user.id)}>Edit</Button>
              <Button variant="delete" onClick={() => handleDelete(user.id)}>Delete</Button>
            </div>
          </li>
        ))}
      </ul>
      <Pagination pathname="/users/list" page={page} countPages={countPages} />
    </div>
  )
}

export default UsersPage
