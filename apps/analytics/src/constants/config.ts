import { DEAD_ADDRESS, NETWORK, POOL_TOKEN_ADDRESSES } from '@shared/utilities'
import { Address } from 'viem'
import { mainnet, optimism, optimismSepolia } from 'viem/chains'

/**
 * Supported networks
 */
export const SUPPORTED_NETWORKS = {
  mainnets: [NETWORK.mainnet, NETWORK.optimism],
  testnets: [NETWORK.optimism_sepolia]
} as const

/**
 * Wagmi networks
 */
export const WAGMI_CHAINS = {
  [NETWORK.mainnet]: mainnet,
  [NETWORK.optimism]: optimism,
  [NETWORK.optimism_sepolia]: optimismSepolia
} as const

/**
 * RPCs
 */
export const RPC_URLS = {
  [NETWORK.mainnet]: process.env.NEXT_PUBLIC_MAINNET_RPC_URL,
  [NETWORK.optimism]: process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL,
  [NETWORK.optimism_sepolia]: process.env.NEXT_PUBLIC_OPTIMISM_SEPOLIA_RPC_URL
} as const

/**
 * Queries' start blocks
 */
export const QUERY_START_BLOCK: { [chainId: number]: bigint } = {
  [NETWORK.optimism_sepolia]: 9_270_700n
}

/**
 * Draw results URL
 */
export const DRAW_RESULTS_URL: { [chainId: number]: string } = {
  [NETWORK.optimism_sepolia]: `https://raw.githubusercontent.com/GenerationSoftware/pt-v5-draw-results-testnet/main/prizes/${NETWORK.sepolia}`
}

/**
 * Burn settings
 */
export const BURN_SETTINGS: {
  [chainId: number]: {
    burnTokenAddress: Address
    liquidationPairAddress?: Lowercase<Address>
    burnAddresses: Address[]
  }
} = {
  [NETWORK.optimism]: {
    burnTokenAddress: POOL_TOKEN_ADDRESSES[NETWORK.optimism],
    burnAddresses: [
      DEAD_ADDRESS,
      '0xb1b9dcb9f3a25e390fb37f597c2bf90b16889e41',
      '0xfbf4f89c7a9ecee48f65033097fecea257eb4049',
      '0xf9baa3cd7b8c1f205fd3a6861dca693fed683684',
      '0x71409285d5b324a082e761e54ea0aa413da51db9',
      '0xf93329e78feff1145fce03a79d5b356588dea215',
      '0x3989cbc1fb0eb278601c018ed7627b07be9de4cb'
    ]
  },
  [NETWORK.optimism_sepolia]: {
    burnTokenAddress: POOL_TOKEN_ADDRESSES[NETWORK.optimism_sepolia],
    liquidationPairAddress: '0xd20777642ba9441d0b7a3f9f53b2ef0255ec7c31',
    burnAddresses: [DEAD_ADDRESS]
  }
}
