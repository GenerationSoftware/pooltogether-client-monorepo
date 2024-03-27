import { NETWORK } from '@shared/utilities'
import { Address } from 'viem'
import { arbitrum, arbitrumSepolia, mainnet, optimism, optimismSepolia, sepolia } from 'viem/chains'

/**
 * Supported networks
 */
export const SUPPORTED_NETWORKS = {
  mainnets: [NETWORK.mainnet, NETWORK.optimism],
  testnets: []
} as const

/**
 * Wagmi networks
 */
export const WAGMI_CHAINS = {
  [NETWORK.mainnet]: mainnet,
  [NETWORK.optimism]: optimism,
  [NETWORK.arbitrum]: arbitrum,
  [NETWORK.sepolia]: sepolia,
  [NETWORK.optimism_sepolia]: optimismSepolia,
  [NETWORK.arbitrum_sepolia]: arbitrumSepolia
} as const

/**
 * RPCs
 */
export const RPC_URLS = {
  [NETWORK.mainnet]: process.env.NEXT_PUBLIC_MAINNET_RPC_URL,
  [NETWORK.optimism]: process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL,
  [NETWORK.arbitrum]: process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL,
  [NETWORK['sepolia']]: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL,
  [NETWORK.optimism_sepolia]: process.env.NEXT_PUBLIC_OPTIMISM_SEPOLIA_RPC_URL,
  [NETWORK.arbitrum_sepolia]: process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC_URL
} as const

/**
 * Queries' start blocks
 */
export const QUERY_START_BLOCK: { [chainId: number]: bigint } = {
  [NETWORK.mainnet]: 18_052_000n,
  [NETWORK.optimism]: 108_927_000n,
  [NETWORK.arbitrum]: 1n,
  [NETWORK.sepolia]: 4_647_000n,
  [NETWORK.optimism_sepolia]: 3_783_000n,
  [NETWORK.arbitrum_sepolia]: 1_310_000n
}

/**
 * Old draw results URL
 */
export const OLD_DRAW_RESULTS_URL: { [chainId: number]: { url: string; lastDrawId: number } } = {
  [NETWORK.optimism]: {
    url: `https://raw.githubusercontent.com/GenerationSoftware/pt-v5-draw-results-mainnet/main/prizes/${NETWORK.optimism}`,
    lastDrawId: 157
  }
}

/**
 * Draw results URL
 */
export const DRAW_RESULTS_URL: { [chainId: number]: string } = {
  [NETWORK.optimism]: `https://raw.githubusercontent.com/GenerationSoftware/pt-v5-winners-mainnet/main/winners/vaultAccounts/${NETWORK.optimism}`
}

/**
 * Vault LPs
 */
export const VAULT_LPS: { [chainId: number]: Lowercase<Address>[] } = {
  [NETWORK.optimism]: [
    '0xb1b9dcb9f3a25e390fb37f597c2bf90b16889e41',
    '0xfbf4f89c7a9ecee48f65033097fecea257eb4049',
    '0xf9baa3cd7b8c1f205fd3a6861dca693fed683684',
    '0x71409285d5b324a082e761e54ea0aa413da51db9'
  ]
}

/**
 * Misc. POOL burn addresses
 */
export const BURN_ADDRESSES: { [chainId: number]: Lowercase<Address>[] } = {
  [NETWORK.optimism]: [
    '0xf93329e78feff1145fce03a79d5b356588dea215',
    '0x3989cbc1fb0eb278601c018ed7627b07be9de4cb'
  ]
}
