import { NETWORK } from '@shared/utilities'
import { Address } from 'viem'
import { mainnet, optimism, optimismGoerli } from 'viem/chains'

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
 * Vaults to display
 */
export const VAULT_ADDRESSES = {
  [NETWORK.optimism]: [
    '0xE3B3a464ee575E8E25D2508918383b89c832f275',
    '0x29Cb69D4780B53c1e5CD4D2B817142D2e9890715'
  ],
  [NETWORK['optimism-goerli']]: [
    '0xc3d6a8d76B304E0716b3227C00a83187340DC846',
    '0xEF9aFd8b3701198cCac6bf55458C38F61C4b55c4'
  ]
} as const

/**
 * Curve pools
 *
 * NOTE: All vault addresses are lowercase
 */
export const CURVE_POOLS: { [chainId: number]: { [vaultAddress: Address]: string } } = {
  [NETWORK.optimism]: { '0x31515cfc4550d9c83e2d86e8a352886d1364e2d9': 'factory-v2-76' }
}
