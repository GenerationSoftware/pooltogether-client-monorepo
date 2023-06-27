import '@rainbow-me/rainbowkit/styles.css'
import type { AppProps } from 'next/app'
import { WagmiConfig } from 'wagmi'
import { AppContainer } from '@components/AppContainer'
import '../styles/globals.css'
import { createCustomWagmiConfig } from '../utils'

const wagmiConfig = createCustomWagmiConfig()

export default function MyApp(props: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <AppContainer {...props} />
    </WagmiConfig>
  )
}
