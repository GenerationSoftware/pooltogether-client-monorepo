import { NETWORK } from '@shared/utilities'
import { Address } from 'viem'
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
 * Queries' start blocks
 */
export const QUERY_START_BLOCK: { [chainId: number]: bigint } = {
  [NETWORK.mainnet]: 18052000n,
  [NETWORK.optimism]: 108927000n,
  [NETWORK['optimism-goerli']]: 14002000n
}

/**
 * Draw results URL
 */
export const DRAW_RESULTS_URL =
  'https://raw.githubusercontent.com/GenerationSoftware/pt-v5-draw-results/main/prizes'

/**
 * Vault LPs
 */
export const VAULT_LPS: { [chainId: number]: Lowercase<Address>[] } = {
  [NETWORK.optimism]: ['0xb1b9dcb9f3a25e390fb37f597c2bf90b16889e41']
}

/**
 * Misc. POOL burn addresses
 */
export const BURN_ADDRESSES: { [chainId: number]: Lowercase<Address>[] } = {
  [NETWORK.optimism]: ['0xf93329e78feff1145fce03a79d5b356588dea215']
}
