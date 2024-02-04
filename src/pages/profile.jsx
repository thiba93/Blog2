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
      const response = await fetch(`/api/users?id=${session?.user.id}`)
      const data = await response.json()

      if (data && data.result && data.result.length > 0) {
        const userWithMatchingId = data.result.find(
          (userItem) => userItem.id === session.user.id,
        )

        if (userWithMatchingId) {
          setUser(userWithMatchingId)
        } else {
          console.error("User not found")
        }

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
    <div className="min-h-screen bg-gray-100 py-10 flex flex-col items-center">
    <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Your Profile</h1>
      <div className="space-y-4">
        <p className="text-gray-600"><span className="font-medium">Id:</span> {user.id}</p>
        <p className="text-gray-600"><span className="font-medium">Email:</span> {user.email}</p>
        <p className="text-gray-600"><span className="font-medium">Number of comments:</span> {user.commentCount}</p>
        <p className="text-gray-600"><span className="font-medium">Number of posts:</span> {user.postCount}</p>
        <p className="text-gray-600"><span className="font-medium">Profile views:</span> {user.profileView}</p>
      </div>
    </div>
  </div>
  
  )
}

export default YourProfilePage
