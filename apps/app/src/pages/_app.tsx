import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { Toaster } from '@shared/ui'
import type { AppProps } from 'next/app'
import { WagmiConfig } from 'wagmi'
import { AppContainer } from '@components/AppContainer'
import { SUPPORTED_NETWORKS } from '@constants/config'
import { ptRainbowTheme } from '@constants/theme'
import { useFathom } from '@hooks/useFathom'
import '../styles/globals.css'
import { createCustomWagmiConfig } from '../utils'

const networks = [...SUPPORTED_NETWORKS.mainnets, ...SUPPORTED_NETWORKS.testnets]
const wagmiConfig = createCustomWagmiConfig(networks)

export default function MyApp(props: AppProps) {
  useFathom()

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={networks.map((id) => ({ id }))}
        theme={ptRainbowTheme()}
        showRecentTransactions={true}
        coolMode={true}
        appInfo={{ appName: 'Cabana' }}
      >
        <Toaster />
        <AppContainer {...props} />
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
