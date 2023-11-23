import { NETWORK } from '@shared/utilities'
import {
  arbitrum,
  arbitrumSepolia,
  mainnet,
  optimism,
  optimismGoerli,
  optimismSepolia
} from 'viem/chains'

/**
 * Supported networks
 */
export const SUPPORTED_NETWORKS = Object.freeze({
  mainnets: [NETWORK.mainnet, NETWORK.optimism, NETWORK.arbitrum],
  testnets: [NETWORK['optimism-goerli'], NETWORK['optimism-sepolia'], NETWORK['arbitrum-sepolia']]
})

/**
 * Wagmi networks
 */
export const WAGMI_CHAINS = Object.freeze({
  [NETWORK.mainnet]: mainnet,
  [NETWORK.optimism]: optimism,
  [NETWORK['optimism-goerli']]: optimismGoerli,
  [NETWORK['optimism-sepolia']]: optimismSepolia,
  [NETWORK.arbitrum]: arbitrum,
  [NETWORK['arbitrum-sepolia']]: arbitrumSepolia
})

/**
 * RPCs
 */
export const RPC_URLS = {
  [NETWORK.mainnet]: process.env.NEXT_PUBLIC_MAINNET_RPC_URL,
  [NETWORK.optimism]: process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL,
  [NETWORK['optimism-goerli']]: process.env.NEXT_PUBLIC_OPTIMISM_GOERLI_RPC_URL,
  [NETWORK['optimism-sepolia']]: process.env.NEXT_PUBLIC_OPTIMISM_SEPOLIA_RPC_URL,
  [NETWORK.arbitrum]: process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL,
  [NETWORK['arbitrum-sepolia']]: process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC_URL
}
