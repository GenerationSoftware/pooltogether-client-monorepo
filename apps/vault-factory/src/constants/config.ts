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
import { DEFAULT_CLAIMER_ADDRESSES, NETWORK } from '@shared/utilities'
import { SupportedNetwork } from 'src/types'
import { Address } from 'viem'
import { mainnet, optimism, sepolia } from 'viem/chains'

/**
 * Supported networks
 */
export const SUPPORTED_NETWORKS = [NETWORK.sepolia] as const

/**
 * Wagmi networks
 */
export const WAGMI_CHAINS = {
  [NETWORK.mainnet]: mainnet,
  [NETWORK.optimism]: optimism,
  [NETWORK.sepolia]: sepolia
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
  [NETWORK.sepolia]: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL
} as const

/**
 * Contract addresses
 */
export const CONTRACTS: Record<SupportedNetwork, { prizePool: Address; claimer: Address }> = {
  [NETWORK.sepolia]: {
    prizePool: '0x934F03f3132d3B818d7c07F25818ea3961eF18aD',
    claimer: DEFAULT_CLAIMER_ADDRESSES[NETWORK.sepolia]
  }
}

/**
 * Local storage keys
 */
export const LOCAL_STORAGE_KEYS = {
  vaultIds: 'vaultIds'
} as const

/**
 * Default liquidation pair config
 */
export const LP_CONFIG: Record<
  SupportedNetwork,
  { targetFirstSaleTimeFraction: number; liquidationGasAmount: bigint; minAuctionAmountEth: number }
> = {
  [NETWORK.sepolia]: {
    targetFirstSaleTimeFraction: 0.5,
    liquidationGasAmount: 300_000n,
    minAuctionAmountEth: 0.001
  }
}

/**
 * Network descriptions
 */
export const NETWORK_DESCRIPTIONS: Record<SupportedNetwork, string> = {
  // [NETWORK.optimism]: 'The OG optimistic rollup on Ethereum.',
  [NETWORK.sepolia]: 'Sepolia testnet for the Ethereum network.'
}
