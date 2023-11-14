import "@/styles/globals.css"

export default function App({ Component: Page, pageProps }) {
  return (
    <div>
      <header className="p-4 border-b-2 text-4xl">
        <h1>BEST WEBSITE E.V.E.R</h1>
      </header>
      <Page {...pageProps} />
    </div>
  )
}
