import { Flowbite } from '@shared/ui'
import { AppProps } from 'next/app'

export const AppContainer = (props: AppProps) => {
  const { Component, pageProps } = props

  return (
    <Flowbite theme={{ dark: true }}>
      <div id='modal-root' />
      <Component {...pageProps} />
    </Flowbite>
  )
}
