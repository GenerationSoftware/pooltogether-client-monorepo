import { NETWORK } from '@shared/utilities'
import { mainnet, optimism, optimismGoerli } from 'wagmi/chains'

/**
 * Supported networks
 */
export const SUPPORTED_NETWORKS = Object.freeze({
  mainnets: [NETWORK.mainnet, NETWORK.optimism],
  testnets: [NETWORK['optimism-goerli']]
})

/**
 * Wagmi networks
 */
export const WAGMI_CHAINS = Object.freeze({
  [NETWORK.mainnet]: mainnet,
  [NETWORK.optimism]: optimism,
  [NETWORK['optimism-goerli']]: optimismGoerli
})

/**
 * RPCs
 */
export const RPC_URLS = {
  [NETWORK.mainnet]: process.env.NEXT_PUBLIC_MAINNET_RPC_URL,
  [NETWORK.optimism]: process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL,
  [NETWORK['optimism-goerli']]: process.env.NEXT_PUBLIC_OPTIMISM_GOERLI_RPC_URL
}

/**
 * RNG queries' start blocks
 */
export const RNG_QUERY_START_BLOCK: { [chainId: number]: bigint } = {
  [NETWORK.mainnet]: 18052000n,
  [NETWORK.optimism]: 108927000n,
  [NETWORK['optimism-goerli']]: 14002000n
}

/**
 * Draw results URL
 */
export const DRAW_RESULTS_URL =
  'https://raw.githubusercontent.com/GenerationSoftware/pt-v5-draw-results/main/prizes'
