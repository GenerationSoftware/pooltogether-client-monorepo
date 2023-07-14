import { useFathom } from '@shared/generic-react-hooks'
import { useSelectedLanguage } from '@shared/generic-react-hooks'
import { Flowbite } from '@shared/ui'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useSentryUser } from '../hooks/useSentryUser'
import { VaultListHandler } from './VaultListHandler'

// React Query Client:
const queryClient = new QueryClient()

export const AppContainer = (props: AppProps) => {
  const { Component, pageProps } = props

  const router = useRouter()

  useSelectedLanguage({
    onLanguageChange: (locale) => {
      const { pathname, query, asPath } = router
      router.push({ pathname, query }, asPath, { locale })
    }
  })

  // Fathom Analytics
  useFathom(
    process.env.NEXT_PUBLIC_FATHOM_SITE_ID as string,
    ['mvp-pt-app.netlify.app/'],
    router.events?.on,
    router.events?.off
  )

  // Sentry User Setup
  useSentryUser()

  return (
    <Flowbite theme={{ dark: true }}>
      <QueryClientProvider client={queryClient}>
        <div id='modal-root' />
        <VaultListHandler />
        <Component {...pageProps} />
      </QueryClientProvider>
    </Flowbite>
  )
}
