import { Flowbite } from '@shared/ui'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppProps } from 'next/app'

// React Query Client:
const queryClient = new QueryClient()

export const AppContainer = (props: AppProps) => {
  const { Component, pageProps } = props

  return (
    <Flowbite theme={{ dark: true }}>
      <QueryClientProvider client={queryClient}>
        <div id='modal-root' />
        <Component {...pageProps} />
      </QueryClientProvider>
    </Flowbite>
  )
}
