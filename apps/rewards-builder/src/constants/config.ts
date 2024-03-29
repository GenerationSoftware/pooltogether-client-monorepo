import { CreateWalletFn } from '@rainbow-me/rainbowkit/dist/wallets/Wallet'
import {
  argentWallet,
  braveWallet,
  coin98Wallet,
  coinbaseWallet,
  imTokenWallet,
  injectedWallet,
  ledgerWallet,
  metaMaskWallet,
  rainbowWallet,
  safeWallet,
  tahoWallet,
  trustWallet,
  uniswapWallet,
  walletConnectWallet,
  xdefiWallet,
  zerionWallet
} from '@rainbow-me/rainbowkit/wallets'
import { NETWORK } from '@shared/utilities'
import { Address } from 'viem'
import { arbitrum, arbitrumSepolia, mainnet, optimism, optimismSepolia } from 'viem/chains'

/**
 * Supported networks
 */
export const SUPPORTED_NETWORKS = [
  NETWORK.optimism,
  NETWORK.optimism_sepolia,
  NETWORK.arbitrum_sepolia
] as const

/**
 * Wagmi networks
 */
export const WAGMI_CHAINS = {
  [NETWORK.mainnet]: mainnet,
  [NETWORK.optimism]: optimism,
  [NETWORK.optimism_sepolia]: optimismSepolia,
  [NETWORK.arbitrum]: arbitrum,
  [NETWORK.arbitrum_sepolia]: arbitrumSepolia
} as const

/**
 * Wallets
 */
export const WALLETS: { [wallet: string]: CreateWalletFn } = {
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
  xdefi: xdefiWallet,
  uniswap: uniswapWallet,
  coin98: coin98Wallet,
  imtoken: imTokenWallet
}

/**
 * RPCs
 */
export const RPC_URLS = {
  [NETWORK.mainnet]: process.env.NEXT_PUBLIC_MAINNET_RPC_URL,
  [NETWORK.optimism]: process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL,
  [NETWORK.optimism_sepolia]: process.env.NEXT_PUBLIC_OPTIMISM_SEPOLIA_RPC_URL,
  [NETWORK.arbitrum]: process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL,
  [NETWORK.arbitrum_sepolia]: process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC_URL
} as const

/**
 * Promotion query filters
 */
export const PROMOTION_FILTERS: {
  [chainId: number]: { tokenAddresses?: Address[]; fromBlock?: bigint }
} = {
  [NETWORK.mainnet]: {},
  [NETWORK.optimism]: { fromBlock: 112_933_000n },
  [NETWORK.optimism_sepolia]: { fromBlock: 4_400_000n },
  [NETWORK.arbitrum]: {},
  [NETWORK.arbitrum_sepolia]: { fromBlock: 1_490_000n }
}
