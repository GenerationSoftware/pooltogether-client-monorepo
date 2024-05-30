import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import { WagmiProvider } from 'wagmi'
import { AppContainer } from '@components/AppContainer'
import { ptRainbowTheme } from '@constants/theme'
import '../styles/globals.css'
import { createCustomWagmiConfig } from '../utils'

// React Query Client:
const queryClient = new QueryClient()

const wagmiConfig = createCustomWagmiConfig()

export default function MyApp(props: AppProps) {
  return (
    <WagmiProvider config={wagmiConfig} reconnectOnMount={true}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={ptRainbowTheme()}
          showRecentTransactions={true}
          appInfo={{ appName: 'Cabana Vault Factory' }}
        >
          <AppContainer {...props} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
