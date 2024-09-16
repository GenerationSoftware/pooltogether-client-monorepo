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
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  gnosis,
  gnosisChiado,
  mainnet,
  optimism,
  optimismSepolia,
  scroll,
  scrollSepolia
} from 'viem/chains'

/**
 * Supported networks
 */
export const SUPPORTED_NETWORKS = [
  NETWORK.mainnet,
  NETWORK.optimism,
  NETWORK.arbitrum,
  NETWORK.base,
  NETWORK.scroll,
  NETWORK.gnosis,
  NETWORK.optimism_sepolia,
  NETWORK.arbitrum_sepolia,
  NETWORK.base_sepolia,
  NETWORK.scroll_sepolia,
  NETWORK.gnosis_chiado
] as const

/**
 * Wagmi networks
 */
export const WAGMI_CHAINS = {
  [NETWORK.mainnet]: mainnet,
  [NETWORK.optimism]: optimism,
  [NETWORK.arbitrum]: arbitrum,
  [NETWORK.base]: base,
  [NETWORK.scroll]: scroll,
  [NETWORK.gnosis]: gnosis,
  [NETWORK.optimism_sepolia]: optimismSepolia,
  [NETWORK.arbitrum_sepolia]: arbitrumSepolia,
  [NETWORK.base_sepolia]: baseSepolia,
  [NETWORK.scroll_sepolia]: scrollSepolia,
  [NETWORK.gnosis_chiado]: gnosisChiado
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
  [NETWORK.arbitrum]: process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL,
  [NETWORK.base]: process.env.NEXT_PUBLIC_BASE_RPC_URL,
  [NETWORK.scroll]: process.env.NEXT_PUBLIC_SCROLL_RPC_URL,
  [NETWORK.gnosis]: process.env.NEXT_PUBLIC_GNOSIS_RPC_URL,
  [NETWORK.optimism_sepolia]: process.env.NEXT_PUBLIC_OPTIMISM_SEPOLIA_RPC_URL,
  [NETWORK.arbitrum_sepolia]: process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC_URL,
  [NETWORK.base_sepolia]: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL,
  [NETWORK.scroll_sepolia]: process.env.NEXT_PUBLIC_SCROLL_SEPOLIA_RPC_URL,
  [NETWORK.gnosis_chiado]: process.env.NEXT_PUBLIC_GNOSIS_CHIADO_RPC_URL
} as const

/**
 * Promotion query filters
 */
export const PROMOTION_FILTERS: {
  [chainId: number]: { tokenAddresses?: Address[]; fromBlock?: bigint }
} = {
  [NETWORK.mainnet]: { fromBlock: 20_565_000n },
  [NETWORK.optimism]: { fromBlock: 118_900_000n },
  [NETWORK.arbitrum]: { fromBlock: 216_345_400n },
  [NETWORK.base]: { fromBlock: 14_506_800n },
  [NETWORK.scroll]: { fromBlock: 9_181_500n },
  [NETWORK.gnosis]: { fromBlock: 35_938_500n },
  [NETWORK.optimism_sepolia]: { fromBlock: 10_793_300n },
  [NETWORK.arbitrum_sepolia]: { fromBlock: 48_888_900n },
  [NETWORK.base_sepolia]: { fromBlock: 10_578_500n },
  [NETWORK.scroll_sepolia]: { fromBlock: 6_589_700n },
  [NETWORK.gnosis_chiado]: { fromBlock: 11_735_000n }
}
