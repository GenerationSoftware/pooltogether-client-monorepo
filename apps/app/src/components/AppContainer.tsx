import { useSelectedLanguage } from '@shared/generic-react-hooks'
import { Flowbite, Toaster } from '@shared/ui'
import { NextIntlClientProvider } from 'next-intl'
import { AppProps } from 'next/app'
import { ReactNode, useEffect, useState } from 'react'
import { connectFarcasterWallet } from 'src/utils'
import { useConnect } from 'wagmi'
import { CustomAppProps } from '@pages/_app'
import { AccountFrame } from './Frames/AccountFrame'
import { VaultFrame } from './Frames/VaultFrame'

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

  const { connect } = useConnect()

  useEffect(() => {
    if (isReady && !!connect) {
      connectFarcasterWallet(connect)
    }
  }, [isReady])

  const pageFrames: { [href: string]: ReactNode } = {
    account: <AccountFrame user={serverProps.params['user']} />,
    vault: (
      <VaultFrame
        chainId={serverProps.params['chainId']}
        vaultAddress={serverProps.params['vaultAddress']}
      />
    )
  }

  const pageFrame = pageFrames[pathname.split('/')[1]] ?? <></>

  return (
    <>
      {pageFrame}
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
