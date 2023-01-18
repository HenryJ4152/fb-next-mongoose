import '../styles/globals.css'
import store from '../redux/store'
import { Provider } from 'react-redux'
import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'


export default function App({ Component, pageProps: { session, ...pageProps } }) {

  const queryClient = new QueryClient()

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </QueryClientProvider>
    </SessionProvider>


  )

}
