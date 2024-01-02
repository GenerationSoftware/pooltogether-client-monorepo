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
import { NETWORK, POOL_TOKEN_ADDRESSES } from '@shared/utilities'
import { LiquidationPair, SupportedNetwork } from 'src/types'
import { Address } from 'viem'
import { arbitrum, arbitrumSepolia, Chain, mainnet, optimism, optimismSepolia } from 'viem/chains'

/**
 * Supported networks
 */
export const SUPPORTED_NETWORKS = [NETWORK.optimism] as const

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
 * Flash liquidator contract addresses
 */
export const FLASH_LIQUIDATORS: Record<SupportedNetwork, Address> = {
  [NETWORK.optimism]: '0x5927b63E88764D6250b7801eBfDEb7B6c1ac35d0'
}

/**
 * Common token addresses
 */
export const TOKENS = {
  [NETWORK.optimism]: {
    'pUSDC.e': '0xE3B3a464ee575E8E25D2508918383b89c832f275',
    'pWETH': '0x29Cb69D4780B53c1e5CD4D2B817142D2e9890715',
    'pDAI': '0xCe8293f586091d48A0cE761bBf85D5bCAa1B8d2b',
    'USDC.e': '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
    'USDC': '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
    'DAI': '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    'WETH': '0x4200000000000000000000000000000000000006',
    'POOL': POOL_TOKEN_ADDRESSES[NETWORK.optimism]
  }
} as const

/**
 * Default liquidation pairs
 */
export const LIQUIDATION_PAIRS: LiquidationPair[] = [
  {
    chainId: NETWORK.optimism,
    address: '0xe7680701a2794E6E0a38aC72630c535B9720dA5b',
    swapPath: [
      TOKENS[NETWORK.optimism]['pUSDC.e'],
      100,
      TOKENS[NETWORK.optimism]['USDC.e'],
      500,
      TOKENS[NETWORK.optimism].WETH,
      3000,
      TOKENS[NETWORK.optimism].POOL
    ]
  },
  {
    chainId: NETWORK.optimism,
    address: '0xde5deFa124faAA6d85E98E56b36616d249e543Ca',
    swapPath: [
      TOKENS[NETWORK.optimism]['pWETH'],
      100,
      TOKENS[NETWORK.optimism].WETH,
      3000,
      TOKENS[NETWORK.optimism].POOL
    ]
  }
]
