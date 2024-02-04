/* eslint-disable max-lines-per-function */
import { useSession } from "@/web/components/SessionContext"
import Link from "@/web/components/ui/Link"
import { useRouter } from "next/router"
import { useEffect } from "react"

const MainMenu = ({ children: _, ...otherProps }) => {
  const router = useRouter()
  const { session, signOut } = useSession()
  useEffect(() => {
    if (!session) {
      router.push("/")
    }

    const fetchConnectedUser = async () => {
      const response = await fetch(`/api/users?id=${session?.user.id}`)
      const data = await response.json()

      if (
        data.result[0].role === "user" ||
        data.result[0].isEnabled === "disabled"
      ) {
        router.push("/")
      }
    }

    fetchConnectedUser()
  }, [router, session])

  return (
    <nav {...otherProps}>
      <ul className="flex gap-4">
        <li>
          <Link href="/" styless>
            Home
          </Link>
        </li>
        {session ? (
          <>
            <li>
              <Link href="/products/list" styless>
                Products
              </Link>
            </li>
            <li>
              <Link href="/users/list" styless>
                Users
              </Link>
            </li>
            <li>
              <Link href="/products/create" styless>
                Create product
              </Link>
            </li>
            <li>
              <Link href="/users/create" styless>
                Create users
              </Link>
            </li>

            <li>
              <Link href="/profile" styless>
                My profile
              </Link>
            </li>

            <li>
              <button onClick={signOut}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/sign-in" styless>
                Sign in
              </Link>
            </li>
            <li>
              <Link href="/sign-up" styless>
                Sign up
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default MainMenu
