import { NETWORK } from '@shared/utilities'
import { Address, parseEther } from 'viem'
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
 * Vaults to display
 */
export const VAULT_ADDRESSES = {
  [NETWORK.optimism]: [
    '0x31515cfC4550d9C83E2d86E8a352886d1364E2D9',
    '0x1732Ce5486ea47f607550Ccbe499cd0f894E0494'
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

/**
 * Minimum prize amount to highlight
 */
export const MIN_PRIZE_AMOUNT = parseEther('50')
