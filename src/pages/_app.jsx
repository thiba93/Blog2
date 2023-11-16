import "@/styles/globals.css"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

export default function App({ Component: Page, pageProps }) {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <header className="p-4 border-b-2 text-4xl">
          <h1>BEST WEBSITE E.V.E.R</h1>
        </header>
        <Page {...pageProps} />
      </QueryClientProvider>
    </div>
  )
}
