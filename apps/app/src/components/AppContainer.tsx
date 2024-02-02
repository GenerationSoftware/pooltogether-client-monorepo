import { useSelectedLanguage } from '@shared/generic-react-hooks'
import { Flowbite } from '@shared/ui'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NextIntlProvider } from 'next-intl'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

// React Query Client:
const queryClient = new QueryClient()

export const AppContainer = (props: AppProps) => {
  const { Component, pageProps } = props

  const [ready, setReady] = useState<boolean>(false)

  const router = useRouter()

  useSelectedLanguage({
    onLanguageChange: (locale) => {
      const { pathname, query, asPath } = router

      router.push({ pathname, query }, asPath, { locale })
      setTimeout(() => {
        setReady(true)
      }, 100)
    }
  })

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
    }
  }, [])

  return (
    <Flowbite theme={{ dark: true }}>
      <QueryClientProvider client={queryClient}>
        <NextIntlProvider messages={pageProps.messages}>
          <div id='modal-root' />
          {ready ? <Component {...pageProps} /> : null}
        </NextIntlProvider>
      </QueryClientProvider>
    </Flowbite>
  )
}
