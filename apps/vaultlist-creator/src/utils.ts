import { FallbackTransport, PublicClient } from 'viem'
import { Chain, Config, configureChains, createConfig, WebSocketPublicClient } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'
import { RPC_URLS, SUPPORTED_NETWORKS, WAGMI_CHAINS } from '@constants/config'

/**
 * Returns a Wagmi config with the given networks and RPCs
 * @param networks the networks to support throughout the app
 * @returns
 */
export const createCustomWagmiConfig = (): Config<
  PublicClient<FallbackTransport, Chain>,
  WebSocketPublicClient
> => {
  const networks = [...SUPPORTED_NETWORKS.mainnets, ...SUPPORTED_NETWORKS.testnets]

  const supportedNetworks = Object.values(WAGMI_CHAINS).filter(
    (chain) => networks.includes(chain.id) && !!RPC_URLS[chain.id]
  )

  const { publicClient } = configureChains(supportedNetworks, [
    jsonRpcProvider({
      rpc: (chain) => ({ http: RPC_URLS[chain.id as keyof typeof WAGMI_CHAINS] as string })
    }),
    publicProvider()
  ])

  return createConfig({ publicClient })
}
