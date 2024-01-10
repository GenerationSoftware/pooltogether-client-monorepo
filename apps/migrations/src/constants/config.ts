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
import { NETWORK } from '@shared/utilities'
import { Address } from 'viem'
import { arbitrum, avalanche, celo, Chain, mainnet, optimism, polygon } from 'viem/chains'

/**
 * Supported networks
 */
export const SUPPORTED_NETWORKS = [
  NETWORK.mainnet,
  NETWORK.optimism,
  NETWORK.polygon,
  NETWORK.avalanche,
  NETWORK.celo
] as const

/**
 * Wagmi networks
 */
export const WAGMI_CHAINS = {
  [NETWORK.mainnet]: mainnet,
  [NETWORK.optimism]: optimism,
  [NETWORK.arbitrum]: arbitrum,
  [NETWORK.polygon]: polygon,
  [NETWORK.avalanche]: avalanche,
  [NETWORK.celo]: celo
} as const

/**
 * Wallets
 */
export const WALLETS: {
  [wallet: string]: (data: { appName: string; chains: Chain[]; projectId: string }) => Wallet
} = Object.freeze({
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
})

/**
 * RPCs
 */
export const RPC_URLS = {
  [NETWORK.mainnet]: process.env.NEXT_PUBLIC_MAINNET_RPC_URL,
  [NETWORK.optimism]: process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL,
  [NETWORK.arbitrum]: process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL,
  [NETWORK.polygon]: process.env.NEXT_PUBLIC_POLYGON_RPC_URL,
  [NETWORK.avalanche]: process.env.NEXT_PUBLIC_AVALANCHE_RPC_URL,
  [NETWORK.celo]: process.env.NEXT_PUBLIC_CELO_RPC_URL
}

/**
 * V4 Pools
 */
export const V4_POOLS: {
  [network: number]: { address: Lowercase<Address>; ticketAddress: Lowercase<Address> }
} = {
  [NETWORK.mainnet]: {
    address: '0xd89a09084555a7d0abe7b111b1f78dfeddd638be',
    ticketAddress: '0xdd4d117723c257cee402285d3acf218e9a8236e1'
  },
  [NETWORK.optimism]: {
    address: '0x79bc8bd53244bc8a9c8c27509a2d573650a83373',
    ticketAddress: '0x62bb4fc73094c83b5e952c2180b23fa7054954c4'
  },
  [NETWORK.polygon]: {
    address: '0x19de635fb3678d8b8154e37d8c9cdf182fe84e60',
    ticketAddress: '0x6a304dfdb9f808741244b6bfee65ca7b3b3a6076'
  },
  [NETWORK.avalanche]: {
    address: '0xf830f5cb2422d555ec34178e27094a816c8f95ec',
    ticketAddress: '0xb27f379c050f6ed0973a01667458af6ecebc1d90'
  }
} as const

/**
 * V3 Pools
 */
export const V3_POOLS: Record<
  (typeof SUPPORTED_NETWORKS)[number],
  {
    address: Lowercase<Address>
    ticketAddress: Lowercase<Address>
    podAddress?: Lowercase<Address>
  }[]
> = {
  [NETWORK.mainnet]: [
    {
      address: '0xebfb47a7ad0fd6e57323c8a42b2e5a6a4f68fc1a',
      ticketAddress: '0x334cbb5858417aee161b53ee0d5349ccf54514cf',
      podAddress: '0x2f994e2e4f3395649eee8a89092e63ca526da829'
    }, // DAI
    {
      address: '0xde9ec95d7708b8319ccca4b8bc92c0a3b70bf416',
      ticketAddress: '0xd81b1a8b1ad00baa2d6609e0bae28a38713872f7',
      podAddress: '0x386eb78f2ee79adde8bdb0a0e27292755ebfea58'
    }, // USDC
    {
      address: '0x0650d780292142835f6ac58dd8e2a336e87b4393',
      ticketAddress: '0xa92a861fc11b99b24296af880011b47f9cafb5ab'
    }, // UNI
    {
      address: '0xbc82221e131c082336cf698f0ca3ebd18afd4ce7',
      ticketAddress: '0x27b85f596feb14e4b5faa9671720a556a7608c69'
    }, // COMP
    {
      address: '0x65c8827229fbd63f9de9fdfd400c9d264066a336',
      ticketAddress: '0x1dea6d02325de05b1f412c9370653aae7cedf91f'
    }, // GUSD
    {
      address: '0x396b4489da692788e327e2e4b2b0459a5ef26791',
      ticketAddress: '0x27d22a7648e955e510a40bdb058333e9190d12d4'
    } // POOL
  ],
  [NETWORK.optimism]: [],
  [NETWORK.polygon]: [
    {
      address: '0xee06abe9e2af61cabcb13170e01266af2defa946',
      ticketAddress: '0x473e484c722ef9ec6f63b509b07bb9cfb258820b'
    }, // USDC
    {
      address: '0x887e17d791dcb44bfdda3023d26f7a04ca9c7ef4',
      ticketAddress: '0x9ecb26631098973834925eb453de1908ea4bdd4e'
    } // USDT
  ],
  [NETWORK.avalanche]: [],
  [NETWORK.celo]: [
    {
      address: '0x6f634f531ed0043b94527f68ec7861b4b1ab110d',
      ticketAddress: '0xa45ba19df569d536251ce65dd3120bf7873e14ec'
    }, // cUSD
    {
      address: '0xbe55435bda8f0a2a20d2ce98cc21b0af5bfb7c83',
      ticketAddress: '0xddbdbe029f9800f7c49764f15a1a1e55755648e4'
    } // cEUR
  ]
} as const
