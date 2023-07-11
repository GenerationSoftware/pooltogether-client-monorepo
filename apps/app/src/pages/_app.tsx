import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { getInitialIsTestnets } from '@shared/generic-react-hooks'
import type { AppProps } from 'next/app'
import { WagmiConfig } from 'wagmi'
import { AppContainer } from '@components/AppContainer'
import { SUPPORTED_NETWORKS } from '@constants/config'
import { ptRainbowTheme } from '@constants/theme'
import '../styles/globals.css'
import { createCustomWagmiConfig } from '../utils'

const networks = getInitialIsTestnets() ? SUPPORTED_NETWORKS.testnets : SUPPORTED_NETWORKS.mainnets

const wagmiConfig = createCustomWagmiConfig(networks)

export default function MyApp(props: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={networks.map((id) => ({ id }))}
        theme={ptRainbowTheme()}
        showRecentTransactions={true}
        coolMode={true}
        appInfo={{ appName: 'PoolTogether' }}
      >
        <AppContainer {...props} />
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
