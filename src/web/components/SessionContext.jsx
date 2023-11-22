import config from "@/web/config"
import jsonwebtoken from "jsonwebtoken"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"

export const useSession = () => useContext(SessionContext)
export const SessionContextProvider = (props) => {
  const [session, setSession] = useState(null)
  const signIn = useCallback((jwt) => {
    localStorage.setItem(config.security.session.cookie.key, jwt)

    const { payload } = jsonwebtoken.decode(jwt)

    setSession(payload)
  }, [])

  useEffect(() => {
    const jwt = localStorage.getItem(config.security.session.cookie.key)

    if (!jwt) {
      return
    }

    const { payload } = jsonwebtoken.decode(jwt)

    setSession(payload)
  }, [])

  return <SessionContext.Provider {...props} value={{ session, signIn }} />
}
const SessionContext = createContext()

export default SessionContext
