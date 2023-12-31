import { NETWORK } from '@shared/utilities'
import { Address, parseEther } from 'viem'
import { mainnet, optimism } from 'viem/chains'

/**
 * Supported networks
 */
export const SUPPORTED_NETWORKS = Object.freeze({
  mainnets: [NETWORK.mainnet, NETWORK.optimism],
  testnets: []
})

/**
 * Wagmi networks
 */
export const WAGMI_CHAINS = Object.freeze({
  [NETWORK.mainnet]: mainnet,
  [NETWORK.optimism]: optimism
})

/**
 * RPCs
 */
export const RPC_URLS = {
  [NETWORK.mainnet]: process.env.NEXT_PUBLIC_MAINNET_RPC_URL,
  [NETWORK.optimism]: process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL
}

/**
 * Vaults to display
 */
export const VAULT_ADDRESSES = {
  [NETWORK.optimism]: ['0x29Cb69D4780B53c1e5CD4D2B817142D2e9890715']
} as const

/**
 * Curve pools
 *
 * NOTE: All vault addresses are lowercase
 */
export const CURVE_POOLS: { [chainId: number]: { [vaultAddress: Address]: string } } = {
  [NETWORK.optimism]: { '0x31515cfc4550d9c83e2d86e8a352886d1364e2d9': 'factory-v2-76' }
}

/**
 * Minimum "big win" POOL amount
 */
export const MIN_BIG_WIN = parseEther('100')
