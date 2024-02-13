import { useSelectedLanguage } from '@shared/generic-react-hooks'
import { Flowbite } from '@shared/ui'
import { Toaster } from '@shared/ui'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NextIntlProvider } from 'next-intl'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

// React Query Client:
const queryClient = new QueryClient()

export const AppContainer = (props: AppProps) => {
  const { Component, pageProps } = props

  const router = useRouter()

  const [isReady, setIsReady] = useState<boolean>(false)

  useSelectedLanguage({
    onLanguageChange: (locale) => {
      const { pathname, query, asPath } = router

      router.push({ pathname, query }, asPath, { locale })

      // Tiny delay to avoid flickering on differing language selection to locale default
      setTimeout(() => {
        setIsReady(true)
      }, 100)
    }
  })

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
    }
  }, [])

  return (
    <Flowbite>
      <QueryClientProvider client={queryClient}>
        <Toaster expand={false} />

        <NextIntlProvider messages={pageProps.messages}>
          <div id='modal-root' />
          {isReady && <Component {...pageProps} />}
        </NextIntlProvider>
      </QueryClientProvider>
    </Flowbite>
  )
}
