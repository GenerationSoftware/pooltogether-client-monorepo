import { Flowbite } from '@shared/ui'
import { AppProps } from 'next/app'
import { useEffect } from 'react'

export const AppContainer = (props: AppProps) => {
  const { Component, pageProps } = props

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
    }
  }, [])

  return (
    <Flowbite>
      <div id='modal-root' />
      <Component {...pageProps} />
    </Flowbite>
  )
}
