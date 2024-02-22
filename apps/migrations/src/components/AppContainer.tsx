import { Flowbite } from '@shared/ui'
import { AppProps } from 'next/app'

export const AppContainer = (props: AppProps) => {
  const { Component, pageProps } = props

  return (
    <Flowbite>
      <div id='modal-root' />
      <Component {...pageProps} />
    </Flowbite>
  )
}
