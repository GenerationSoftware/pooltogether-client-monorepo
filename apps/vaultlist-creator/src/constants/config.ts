import { NETWORK } from '@pooltogether/hyperstructure-client-js'
import { arbitrum, mainnet, optimism, polygon, polygonMumbai, sepolia } from 'wagmi/chains'

/**
 * Supported networks
 */
export const SUPPORTED_NETWORKS = Object.freeze({
  mainnets: [NETWORK.mainnet, NETWORK.polygon, NETWORK.optimism, NETWORK.arbitrum],
  testnets: [NETWORK.sepolia]
})

/**
 * Wagmi networks
 */
export const WAGMI_CHAINS = Object.freeze({
  [NETWORK.mainnet]: mainnet,
  [NETWORK.polygon]: polygon,
  [NETWORK.optimism]: optimism,
  [NETWORK.arbitrum]: arbitrum,
  [NETWORK.sepolia]: sepolia,
  [NETWORK.mumbai]: polygonMumbai
})

/**
 * RPCs
 */
export const RPC_URLS = {
  [NETWORK.mainnet]: process.env.NEXT_PUBLIC_MAINNET_RPC_URL,
  [NETWORK.polygon]: process.env.NEXT_PUBLIC_POLYGON_RPC_URL,
  [NETWORK.optimism]: process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL,
  [NETWORK.arbitrum]: process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL,
  [NETWORK.sepolia]: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL,
  [NETWORK.mumbai]: process.env.NEXT_PUBLIC_MUMBAI_RPC_URL
}
