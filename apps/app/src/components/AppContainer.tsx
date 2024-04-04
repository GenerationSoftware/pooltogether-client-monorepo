import { useSelectedLanguage } from '@shared/generic-react-hooks'
import { Flowbite, Toaster } from '@shared/ui'
import { NextIntlClientProvider } from 'next-intl'
import { AppProps } from 'next/app'
import { ReactNode, useEffect, useState } from 'react'
import { DefaultFrame } from './Frames/DefaultFrame'

export const AppContainer = (props: AppProps) => {
  const { Component, pageProps, router } = props

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

  const pageFrames: { [href: string]: ReactNode } = {
    // TODO: add custom frames for individual pages
  }

  const pageFrame = pageFrames[router.pathname.split('/')[1]]

  return (
    <>
      {pageFrame ?? <DefaultFrame />}
      <Flowbite>
        <Toaster expand={false} />
        <NextIntlClientProvider locale={router.locale} messages={pageProps.messages}>
          <div id='modal-root' />
          {isReady && <Component {...pageProps} />}
        </NextIntlClientProvider>
      </Flowbite>
    </>
  )
}
