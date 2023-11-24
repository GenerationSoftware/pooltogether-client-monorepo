import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import type { AppProps } from 'next/app'
import { WagmiConfig } from 'wagmi'
import { AppContainer } from '@components/AppContainer'
import { SUPPORTED_NETWORKS } from '@constants/config'
import { ptRainbowTheme } from '@constants/theme'
import '../styles/globals.css'
import { createCustomWagmiConfig } from '../utils'

const wagmiConfig = createCustomWagmiConfig()

export default function MyApp(props: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={SUPPORTED_NETWORKS.map((id) => ({ id }))}
        theme={ptRainbowTheme()}
        showRecentTransactions={true}
        coolMode={true}
        appInfo={{ appName: 'Cabana Vault Factory' }}
      >
        <AppContainer {...props} />
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
