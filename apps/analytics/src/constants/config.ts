import { NETWORK } from '@shared/utilities'
import { Address } from 'viem'
import { mainnet, optimism, sepolia } from 'viem/chains'

/**
 * Supported networks
 */
export const SUPPORTED_NETWORKS = {
  mainnets: [NETWORK.mainnet, NETWORK.optimism],
  testnets: [NETWORK.sepolia]
} as const

/**
 * Wagmi networks
 */
export const WAGMI_CHAINS = {
  [NETWORK.mainnet]: mainnet,
  [NETWORK.optimism]: optimism,
  [NETWORK.sepolia]: sepolia
} as const

/**
 * RPCs
 */
export const RPC_URLS = {
  [NETWORK.mainnet]: process.env.NEXT_PUBLIC_MAINNET_RPC_URL,
  [NETWORK.optimism]: process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL,
  [NETWORK.sepolia]: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL
} as const

/**
 * Queries' start blocks
 */
export const QUERY_START_BLOCK: { [chainId: number]: bigint } = {
  [NETWORK.sepolia]: 5_397_600n
}

/**
 * Draw results URL
 */
export const DRAW_RESULTS_URL: { [chainId: number]: string } = {
  // [NETWORK.sepolia]: `https://raw.githubusercontent.com/GenerationSoftware/pt-v5-draw-results-testnet/main/prizes/${NETWORK.sepolia}` // TODO: uncomment once actions are setup
}

/**
 * Extra POOL burn addresses
 */
export const BURN_ADDRESSES: { [chainId: number]: Lowercase<Address>[] } = {
  [NETWORK.optimism]: [
    '0xb1b9dcb9f3a25e390fb37f597c2bf90b16889e41',
    '0xfbf4f89c7a9ecee48f65033097fecea257eb4049',
    '0xf9baa3cd7b8c1f205fd3a6861dca693fed683684',
    '0x71409285d5b324a082e761e54ea0aa413da51db9',
    '0xf93329e78feff1145fce03a79d5b356588dea215',
    '0x3989cbc1fb0eb278601c018ed7627b07be9de4cb'
  ]
}
