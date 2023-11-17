import "@/styles/globals.css"
import Link from "@/web/components/ui/Link"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

export default function App({ Component: Page, pageProps }) {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <header className="border-b-2">
          <div className="max-w-3xl mx-auto flex items-center p-4">
            <h1 className="text-2xl">
              <Link href="/" styless>
                BEST WEBSITE E.V.E.R
              </Link>
            </h1>
            <nav className="ms-auto">
              <ul className="flex gap-4">
                <li>
                  <Link href="/" styless>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/products/create" styless>
                    Create product
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <div className="max-w-3xl mx-auto">
          <Page {...pageProps} />
        </div>
      </QueryClientProvider>
    </div>
  )
}
