import { Navigation } from '../components/UI'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <div className="mx-auto w-full lg:w-[800px]">
      <Navigation />
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
