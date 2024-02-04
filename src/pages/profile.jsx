/* eslint-disable no-console */
import { useEffect, useState } from "react"
import { useSession } from "@/web/components/SessionContext"
import { useRouter } from "next/router"

const YourProfilePage = () => {
  const { session } = useSession()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session) {
      router.push("/")
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users?id=${session.user.id}`)
        const data = await response.json()


        if (data.result) {
          setUser(data.result[0])
        } else {
          console.error("No user in the database")
        }
      } catch (error) {
        console.error("Error fetching user data", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router, session])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <div>
      <h1>Your Profile</h1>
      <p>Id: {user.id}</p>
      <p>Email: {user.email}</p>
    </div>
  )
}

export default YourProfilePage
