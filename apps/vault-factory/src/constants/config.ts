import { NETWORK } from '@pooltogether/hyperstructure-client-js'
import { Wallet } from '@rainbow-me/rainbowkit'
import {
  argentWallet,
  braveWallet,
  coinbaseWallet,
  injectedWallet,
  ledgerWallet,
  metaMaskWallet,
  rainbowWallet,
  safeWallet,
  tahoWallet,
  trustWallet,
  walletConnectWallet,
  xdefiWallet,
  zerionWallet
} from '@rainbow-me/rainbowkit/wallets'
import { SupportedNetwork } from 'src/types'
import { Address, parseUnits } from 'viem'
import { arbitrum, Chain, mainnet, optimism, optimismGoerli, polygon } from 'wagmi/chains'

/**
 * Supported networks
 */
export const SUPPORTED_NETWORKS = [NETWORK['optimism-goerli']] as const

/**
 * Wagmi networks
 */
export const WAGMI_CHAINS = {
  [NETWORK.mainnet]: mainnet,
  [NETWORK.polygon]: polygon,
  [NETWORK.optimism]: optimism,
  [NETWORK.arbitrum]: arbitrum,
  [NETWORK['optimism-goerli']]: optimismGoerli
} as const

/**
 * Wallets
 */
export const WALLETS: {
  [wallet: string]: (data: { appName: string; chains: Chain[]; projectId: string }) => Wallet
} = {
  metamask: metaMaskWallet,
  walletconnect: walletConnectWallet,
  rainbow: rainbowWallet,
  injected: injectedWallet,
  argent: argentWallet,
  coinbase: coinbaseWallet,
  ledger: ledgerWallet,
  taho: tahoWallet,
  trust: trustWallet,
  zerion: zerionWallet,
  brave: braveWallet,
  safe: safeWallet,
  xdefi: xdefiWallet
} as const

/**
 * RPCs
 */
export const RPC_URLS = {
  [NETWORK.mainnet]: process.env.NEXT_PUBLIC_MAINNET_RPC_URL,
  [NETWORK.polygon]: process.env.NEXT_PUBLIC_POLYGON_RPC_URL,
  [NETWORK.optimism]: process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL,
  [NETWORK.arbitrum]: process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL,
  [NETWORK['optimism-goerli']]: process.env.NEXT_PUBLIC_OPTIMISM_GOERLI_RPC_URL
} as const

/**
 * Contract addresses
 */
export const CONTRACTS: Record<
  SupportedNetwork,
  {
    prizePool: Address
    twabController: Address
    claimer: Address
  }
> = {
  [NETWORK['optimism-goerli']]: {
    prizePool: '0x6A62cd64Acb8bAb35C21e9114A7F9d97e7FaB987',
    twabController: '0x1F4823b8254bB008C36961f64D50e5a0e824949C',
    claimer: '0xbDe2D03FB278C8f9D492358E0eB1f863035892EF'
  }
} as const

/**
 * Local storage keys
 */
export const LOCAL_STORAGE_KEYS = {
  vaultIds: 'vaultIds'
}

/**
 * Default liquidation pair config
 */
export const LP_CONFIG = {
  targetFirstSaleTimeFraction: 0.5,
  decayConstant: parseUnits('0.0001115', 18),
  liquidationGasAmount: 100_000n
}
