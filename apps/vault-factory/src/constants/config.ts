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
import { SupportedNetwork, YieldSourceId } from 'src/types'
import { Address } from 'viem'
import { arbitrum, Chain, mainnet, optimism, polygon, sepolia } from 'wagmi/chains'

/**
 * Supported networks
 */
export const SUPPORTED_NETWORKS = [NETWORK.sepolia] as const

/**
 * Wagmi networks
 */
export const WAGMI_CHAINS = {
  [NETWORK.mainnet]: mainnet,
  [NETWORK.polygon]: polygon,
  [NETWORK.optimism]: optimism,
  [NETWORK.arbitrum]: arbitrum,
  [NETWORK.sepolia]: sepolia
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
  [NETWORK.sepolia]: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL
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
    yieldSources: { [tokenAddress: Address]: { id: YieldSourceId; address: Address }[] }
  }
> = {
  [NETWORK.sepolia]: {
    prizePool: '0xA377A589C1957D7777F6eDF1b7C22C911a56e90F',
    twabController: '0x21A7c83D23d75b5eA80115974e3473fc35B1f263',
    claimer: '0x28781b60C9b3FE86c3018EBb9650766ea08673f5',
    yieldSources: {
      '0xB20Ff9fe4065CC1494dFa3A273A527A05871074F': [
        { id: 'aave', address: '0xDE352b8556c1dbF3F1E3F49fdE5c5961fF17C2a3' },
        { id: 'compound', address: '0x6D8c6c9408C7073b17Acb7bA1eBc541fb57c1aef' }
      ], // DAI
      '0x59D6b2E784f45568a76b9627De97e06Fc237DA83': [
        { id: 'aave', address: '0x47d031Ddb80cC7a0a10d684eFd01b6Be76f0E391' },
        { id: 'compound', address: '0x7C77fE5a4261fe27e9219410c65f9d42747e5F69' }
      ], // USDC
      '0x73b3f9fecf92b4f0Eb6a20c977cBb30964858fD7': [
        { id: 'aave', address: '0xf33E8ECD7518e5E464ecB0FB94aE4Fc2f39adB5B' }
      ], // GUSD
      '0xf78De71CF358a92AeE3370A7a3B743bF63c257d4': [
        { id: 'aave', address: '0xfC29e757A2D1f66649De91e9225F36AB6c1BD44d' }
      ], // WBTC
      '0x62739A657d3bB724694b46B35795532EC9B42b47': [
        { id: 'aave', address: '0x4D07Ba104ff254c19B443aDE6224f744Db84FB8A' }
      ] // WETH
    }
  }
}

/**
 * Yield source descriptions
 */
export const YIELD_SOURCE_DESCRIPTIONS: Record<
  YieldSourceId,
  { name: string; href: string; description: string }
> = {
  aave: {
    name: 'Aave',
    href: 'https://aave.com/',
    description:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Distinctio, perspiciatis qui minima porro possimus ea perferendis, optio quidem praesentium voluptatum dolorem cum asperiores incidunt nesciunt? Ad minus numquam asperiores ratione!'
  },
  yearn: {
    name: 'Yearn',
    href: 'https://yearn.finance/',
    description:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Distinctio, perspiciatis qui minima porro possimus ea perferendis, optio quidem praesentium voluptatum dolorem cum asperiores incidunt nesciunt? Ad minus numquam asperiores ratione!'
  },
  compound: {
    name: 'Compound',
    href: 'https://compound.finance/',
    description:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Distinctio, perspiciatis qui minima porro possimus ea perferendis, optio quidem praesentium voluptatum dolorem cum asperiores incidunt nesciunt? Ad minus numquam asperiores ratione!'
  }
}

export const LOCAL_STORAGE_KEYS = {
  vaultAddresses: 'vaultAddresses'
}
