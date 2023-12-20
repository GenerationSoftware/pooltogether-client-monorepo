import { Wallet } from '@rainbow-me/rainbowkit'
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
import { arbitrum, arbitrumSepolia, Chain, mainnet, optimism, optimismSepolia } from 'viem/chains'

/**
 * Supported networks
 */
export const SUPPORTED_NETWORKS = [
  NETWORK.optimism,
  NETWORK['optimism-sepolia'],
  NETWORK['arbitrum-sepolia']
] as const

/**
 * Wagmi networks
 */
export const WAGMI_CHAINS = {
  [NETWORK.mainnet]: mainnet,
  [NETWORK.optimism]: optimism,
  [NETWORK['optimism-sepolia']]: optimismSepolia,
  [NETWORK.arbitrum]: arbitrum,
  [NETWORK['arbitrum-sepolia']]: arbitrumSepolia
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
  xdefi: xdefiWallet,
  uniswap: uniswapWallet,
  coin98: coin98Wallet,
  imtoken: imTokenWallet
} as const

/**
 * RPCs
 */
export const RPC_URLS = {
  [NETWORK.mainnet]: process.env.NEXT_PUBLIC_MAINNET_RPC_URL,
  [NETWORK.optimism]: process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL,
  [NETWORK['optimism-sepolia']]: process.env.NEXT_PUBLIC_OPTIMISM_SEPOLIA_RPC_URL,
  [NETWORK.arbitrum]: process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL,
  [NETWORK['arbitrum-sepolia']]: process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC_URL
} as const

/**
 * Contract addresses
 */
export const CONTRACTS: Record<SupportedNetwork, { prizePool: Address; claimer: Address }> = {
  [NETWORK.optimism]: {
    prizePool: '0xe32e5E1c5f0c80bD26Def2d0EA5008C107000d6A',
    claimer: DEFAULT_CLAIMER_ADDRESSES[NETWORK.optimism]
  },
  [NETWORK['optimism-sepolia']]: {
    prizePool: '0x46547a849f68178208490Cdd491Df15a5bEeA4B2',
    claimer: DEFAULT_CLAIMER_ADDRESSES[NETWORK['optimism-sepolia']]
  },
  [NETWORK['arbitrum-sepolia']]: {
    prizePool: '0x6Fd1dF849DFC4F76F0B15ba0c8D3e99FF84817f1',
    claimer: DEFAULT_CLAIMER_ADDRESSES[NETWORK['arbitrum-sepolia']]
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
export const LP_CONFIG: Record<
  SupportedNetwork,
  { targetFirstSaleTimeFraction: number; liquidationGasAmount: bigint }
> = {
  [NETWORK.optimism]: {
    targetFirstSaleTimeFraction: 0.5,
    liquidationGasAmount: 300_000n
  },
  [NETWORK['optimism-sepolia']]: {
    targetFirstSaleTimeFraction: 0.5,
    liquidationGasAmount: 300_000n
  },
  [NETWORK['arbitrum-sepolia']]: {
    targetFirstSaleTimeFraction: 0.5,
    liquidationGasAmount: 300_000n
  }
}

/**
 * Network descriptions
 */
export const NETWORK_DESCRIPTIONS: Record<SupportedNetwork, string> = {
  [NETWORK.optimism]: 'The OG optimistic rollup on Ethereum.',
  [NETWORK['optimism-sepolia']]: 'Sepolia testnet for the Optimism network.',
  [NETWORK['arbitrum-sepolia']]: 'Sepolia testnet for the Arbitrum network.'
}
