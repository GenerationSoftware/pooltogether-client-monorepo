import { Flowbite } from '@shared/ui'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppProps } from 'next/app'
import { useEffect } from 'react'

// React Query Client:
const queryClient = new QueryClient()

export const AppContainer = (props: AppProps) => {
  const { Component, pageProps } = props

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
    }
  }, [])

  return (
    <Flowbite>
      <QueryClientProvider client={queryClient}>
        <div id='modal-root' />
        <Component {...pageProps} />
      </QueryClientProvider>
    </Flowbite>
  )
}
