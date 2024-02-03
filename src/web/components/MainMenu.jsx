/* eslint-disable max-lines-per-function */
import { useSession } from "@/web/components/SessionContext"
import Link from "@/web/components/ui/Link"

const MainMenu = ({ children: _, ...otherProps }) => {
  const { session, signOut } = useSession()

  return (
    <nav {...otherProps}>
      <ul className="flex gap-4">
        <li>
          <Link href="/" styless>
            Home
          </Link>
        </li>
        <li>
          <Link href="/products/editOrDelete" styless>
            product delete
          </Link>
        </li>
        <li>
          <Link href="/users/list" styless>
            Users
          </Link>
        </li>
        <li>
          <Link href="/users/create" styless>
            create users
          </Link>
        </li>
        <li>
          <Link href="/profile" styless>
            profile
          </Link>
        </li>
        {session ? (
          <>
            <li>
              <Link href="/products/create" styless>
                Create product
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
