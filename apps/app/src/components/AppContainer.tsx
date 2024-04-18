import { useSelectedLanguage } from '@shared/generic-react-hooks'
import { Flowbite, Toaster } from '@shared/ui'
import { NextIntlClientProvider } from 'next-intl'
import { AppProps } from 'next/app'
import { ReactNode, useEffect, useState } from 'react'
import { CustomAppProps } from '@pages/_app'
import { AccountFrame } from './Frames/AccountFrame'
import { DefaultFrame } from './Frames/DefaultFrame'

export const AppContainer = (props: AppProps & CustomAppProps) => {
  const { Component, pageProps, serverProps, router } = props
  const { pathname, query, asPath, locale } = router

  const [isReady, setIsReady] = useState<boolean>(false)

  useSelectedLanguage({
    onLanguageChange: (newLanguage) => {
      router.push({ pathname, query }, asPath, { locale: newLanguage })

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

  const pageFrames: { [href: string]: ReactNode } = {
    account: <AccountFrame user={serverProps.params['user']} />
  }

  const pageFrame = pageFrames[pathname.split('/')[1]]

  return (
    <>
      {pageFrame ?? <DefaultFrame />}
      <Flowbite>
        <Toaster expand={false} />
        <NextIntlClientProvider locale={locale} messages={pageProps.messages}>
          <div id='modal-root' />
          {isReady && <Component {...pageProps} />}
        </NextIntlClientProvider>
      </Flowbite>
    </>
  )
}
