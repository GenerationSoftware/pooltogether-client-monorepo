import { NETWORK } from '@shared/utilities'
import { Address, parseEther } from 'viem'
import { mainnet, optimism } from 'viem/chains'

/**
 * Supported networks
 */
export const SUPPORTED_NETWORKS = [NETWORK.mainnet, NETWORK.optimism] as const

/**
 * Wagmi networks
 */
export const WAGMI_CHAINS = {
  [NETWORK.mainnet]: mainnet,
  [NETWORK.optimism]: optimism
} as const

/**
 * RPCs
 */
export const RPC_URLS = {
  [NETWORK.mainnet]: process.env.NEXT_PUBLIC_MAINNET_RPC_URL,
  [NETWORK.optimism]: process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL
} as const

/**
 * Vaults to display
 */
export const VAULT_ADDRESSES: { [chainId: number]: Address[] } = {
  [NETWORK.optimism]: [
    // TODO: add vaults with swap liquidity here
  ]
}

/**
 * Curve pools
 *
 * NOTE: All vault addresses are lowercase
 */
export const CURVE_POOLS: { [chainId: number]: { [vaultAddress: Address]: string } } = {}

/**
 * Minimum "big win" WETH amount
 */
export const MIN_BIG_WIN = parseEther('0.01')
