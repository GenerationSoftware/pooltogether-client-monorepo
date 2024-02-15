import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import { WagmiProvider } from 'wagmi'
import { AppContainer } from '@components/AppContainer'
import { SUPPORTED_NETWORKS } from '@constants/config'
import { ptRainbowTheme } from '@constants/theme'
import { useFathom } from '@hooks/useFathom'
import '../styles/globals.css'
import { createCustomWagmiConfig } from '../utils'

// React Query Client:
const queryClient = new QueryClient()

const networks = [...SUPPORTED_NETWORKS.mainnets, ...SUPPORTED_NETWORKS.testnets]
const wagmiConfig = createCustomWagmiConfig(networks, { useCustomRPCs: true })

export default function MyApp(props: AppProps) {
  useFathom()

  return (
    <WagmiProvider config={wagmiConfig} reconnectOnMount={true}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={ptRainbowTheme()}
          showRecentTransactions={true}
          coolMode={true}
          appInfo={{ appName: 'Cabana' }}
        >
          <AppContainer {...props} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
