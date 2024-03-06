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
import { TokenWithLogo } from '@shared/types'
import { NETWORK } from '@shared/utilities'
import { Address } from 'viem'
import { arbitrum, avalanche, celo, mainnet, optimism, polygon } from 'viem/chains'

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
export type SupportedNetwork = (typeof SUPPORTED_NETWORKS)[number]

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
  [NETWORK.polygon]: process.env.NEXT_PUBLIC_POLYGON_RPC_URL,
  [NETWORK.avalanche]: process.env.NEXT_PUBLIC_AVALANCHE_RPC_URL,
  [NETWORK.celo]: process.env.NEXT_PUBLIC_CELO_RPC_URL
} as const

// TODO: update addresses to toucan deployment
/**
 * Migration Destinations
 */
export const MIGRATION_DESTINATIONS = {
  wethVault: { chainId: NETWORK.optimism, address: '0xf0b19f02c63d51b69563a2b675e0160e1c34397c' },
  usdcVault: { chainId: NETWORK.optimism, address: '0xe3b3a464ee575e8e25d2508918383b89c832f275' }
} as const satisfies Record<string, { chainId: SupportedNetwork; address: Lowercase<Address> }>

/**
 * V5 Vault Tags
 */
export type V5_TAG = 'beta' | 'canary' | 'replaced'

/**
 * Deprecated V5 Vaults
 */
export const OLD_V5_VAULTS: {
  [network: number]: {
    vault: {
      chainId: number
      address: Lowercase<Address>
      name: string
      decimals: number
      symbol: string
      tags: V5_TAG[]
      logoURI: string
    }
    migrateTo: { chainId: SupportedNetwork; address: Lowercase<Address> }
  }[]
} = {
  [NETWORK.optimism]: [
    {
      vault: {
        chainId: NETWORK.optimism,
        address: '0x31515cfc4550d9c83e2d86e8a352886d1364e2d9',
        name: 'Prize USDC (Beta)',
        decimals: 6,
        symbol: 'PTUSDC',
        tags: ['beta'],
        logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png'
      },
      migrateTo: MIGRATION_DESTINATIONS.usdcVault
    },
    {
      vault: {
        chainId: NETWORK.optimism,
        address: '0x1732ce5486ea47f607550ccbe499cd0f894e0494',
        name: 'Prize WETH (Beta)',
        decimals: 18,
        symbol: 'PTWETH',
        tags: ['beta'],
        logoURI: 'https://etherscan.io/token/images/weth_28.png'
      },
      migrateTo: MIGRATION_DESTINATIONS.wethVault
    },
    {
      vault: {
        chainId: NETWORK.optimism,
        address: '0x29cb69d4780b53c1e5cd4d2b817142d2e9890715',
        name: 'Prize WETH (Canary)',
        decimals: 18,
        symbol: 'pWETH',
        tags: ['canary'],
        logoURI: 'https://etherscan.io/token/images/weth_28.png'
      },
      migrateTo: MIGRATION_DESTINATIONS.wethVault
    },
    {
      vault: {
        chainId: NETWORK.optimism,
        address: '0xf0b19f02c63d51b69563a2b675e0160e1c34397c',
        name: 'Prize WETH V2 (Canary)',
        decimals: 18,
        symbol: 'pWETH',
        tags: ['canary'],
        logoURI: 'https://etherscan.io/token/images/weth_28.png'
      },
      migrateTo: MIGRATION_DESTINATIONS.wethVault
    },
    {
      vault: {
        chainId: NETWORK.optimism,
        address: '0x77935f2c72b5eb814753a05921ae495aa283906b',
        name: 'Prize USDC (Canary)',
        decimals: 6,
        symbol: 'pUSDC',
        tags: ['canary'],
        logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png'
      },
      migrateTo: MIGRATION_DESTINATIONS.usdcVault
    },
    {
      vault: {
        chainId: NETWORK.optimism,
        address: '0xe3b3a464ee575e8e25d2508918383b89c832f275',
        name: 'Prize USDC.e (Canary)',
        decimals: 6,
        symbol: 'pUSDC.e',
        tags: ['canary'],
        logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png'
      },
      migrateTo: MIGRATION_DESTINATIONS.usdcVault
    },
    {
      vault: {
        chainId: NETWORK.optimism,
        address: '0xce8293f586091d48a0ce761bbf85d5bcaa1b8d2b',
        name: 'Prize DAI (Canary)',
        decimals: 18,
        symbol: 'pDAI',
        tags: ['canary'],
        logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734'
      },
      migrateTo: MIGRATION_DESTINATIONS.usdcVault
    },
    {
      vault: {
        chainId: NETWORK.optimism,
        address: '0xbd8fd33e53ab4120638c34cbd454112b39f6b382',
        name: 'Prize POOL (Canary)',
        decimals: 18,
        symbol: 'pPOOL',
        tags: ['canary'],
        logoURI: 'https://etherscan.io/token/images/pooltogether_32.png'
      },
      migrateTo: MIGRATION_DESTINATIONS.wethVault
    },
    {
      vault: {
        chainId: NETWORK.optimism,
        address: '0x2ac482d67f009acfc242283b6d86bc6dd4e2ee4f',
        name: 'Prize LUSD (Canary)',
        decimals: 18,
        symbol: 'pLUSD',
        tags: ['canary'],
        logoURI: 'https://etherscan.io/token/images/liquitylusd_32.png'
      },
      migrateTo: MIGRATION_DESTINATIONS.usdcVault
    }
  ]
}

// TODO: need to setup promotion settings for old and current deployments (pair of network and twabRewardsAddress)
/**
 * V5 TWAB Promotion Settings
 */
export const V5_PROMOTION_SETTINGS: {
  [network: number]: {
    tokenAddresses?: `0x${string}`[]
    fromBlock?: bigint
    toBlock?: bigint
    twabRewardsAddress?: Lowercase<Address>
  }
} = {
  [NETWORK.optimism]: {
    tokenAddresses: [
      '0x4200000000000000000000000000000000000042', // OP
      '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', // USDC
      '0x7F5c764cBc14f9669B88837ca1490cCa17c31607', // USDC.e
      '0x4200000000000000000000000000000000000006', // WETH
      '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', // DAI
      '0x395Ae52bB17aef68C2888d941736A71dC6d4e125' // POOL
    ],
    fromBlock: 112_933_000n
  }
}

/**
 * V4 Pools
 */
export const V4_POOLS: {
  [network: number]: {
    address: Lowercase<Address>
    ticket: TokenWithLogo & { address: Lowercase<Address> }
    underlyingTokenAddress: Lowercase<Address>
    migrateTo: { chainId: SupportedNetwork; address: Lowercase<Address> }
  }
} = {
  [NETWORK.mainnet]: {
    address: '0xd89a09084555a7d0abe7b111b1f78dfeddd638be',
    ticket: {
      chainId: NETWORK.mainnet,
      address: '0xdd4d117723c257cee402285d3acf218e9a8236e1',
      symbol: 'PTaUSDC',
      name: 'PoolTogether V4 USDC',
      decimals: 6,
      logoURI: 'https://raw.githubusercontent.com/pooltogether/v4-ui/production/public/ptausdc.png'
    },
    underlyingTokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    migrateTo: MIGRATION_DESTINATIONS.usdcVault
  },
  [NETWORK.optimism]: {
    address: '0x79bc8bd53244bc8a9c8c27509a2d573650a83373',
    ticket: {
      chainId: NETWORK.optimism,
      address: '0x62bb4fc73094c83b5e952c2180b23fa7054954c4',
      symbol: 'PTaOptUSDC',
      name: 'PoolTogether V4 USDC',
      decimals: 6,
      logoURI: 'https://raw.githubusercontent.com/pooltogether/v4-ui/production/public/ptausdc.png'
    },
    underlyingTokenAddress: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
    migrateTo: MIGRATION_DESTINATIONS.usdcVault
  },
  [NETWORK.polygon]: {
    address: '0x19de635fb3678d8b8154e37d8c9cdf182fe84e60',
    ticket: {
      chainId: NETWORK.polygon,
      address: '0x6a304dfdb9f808741244b6bfee65ca7b3b3a6076',
      symbol: 'PTaUSDC',
      name: 'PoolTogether V4 USDC',
      decimals: 6,
      logoURI: 'https://raw.githubusercontent.com/pooltogether/v4-ui/production/public/ptausdc.png'
    },
    underlyingTokenAddress: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    migrateTo: MIGRATION_DESTINATIONS.usdcVault
  },
  [NETWORK.avalanche]: {
    address: '0xf830f5cb2422d555ec34178e27094a816c8f95ec',
    ticket: {
      chainId: NETWORK.avalanche,
      address: '0xb27f379c050f6ed0973a01667458af6ecebc1d90',
      symbol: 'PTavUSDCe',
      name: 'PoolTogether V4 USDC',
      decimals: 6,
      logoURI: 'https://raw.githubusercontent.com/pooltogether/v4-ui/production/public/ptausdc.png'
    },
    underlyingTokenAddress: '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664',
    migrateTo: MIGRATION_DESTINATIONS.usdcVault
  }
}

/**
 * V4 TWAB Promotions
 */
export const V4_PROMOTIONS: {
  [network: number]: {
    twabRewardsAddress: Lowercase<Address>
    token: { address: Lowercase<Address>; decimals: number; symbol: string }
    promotions: {
      [id: string]: {
        startTimestamp: bigint
        numberOfEpochs: number
        epochDuration: number
      }
    }
  }
} = {
  [NETWORK.optimism]: {
    twabRewardsAddress: '0x1470c87e2db5247a36c60de3d65d7c972c62ea0f',
    token: { address: '0x4200000000000000000000000000000000000042', decimals: 18, symbol: 'OP' },
    promotions: {
      '5': {
        startTimestamp: 1_658_862_000n,
        numberOfEpochs: 4,
        epochDuration: 604_800
      },
      '6': {
        startTimestamp: 1_661_281_200n,
        numberOfEpochs: 4,
        epochDuration: 604_800
      },
      '7': {
        startTimestamp: 1_663_700_400n,
        numberOfEpochs: 8,
        epochDuration: 604_800
      },
      '8': {
        startTimestamp: 1_668_546_000n,
        numberOfEpochs: 19,
        epochDuration: 604_800
      }
    }
  }
}

/**
 * V3 Pools
 */
export const V3_POOLS: Record<
  SupportedNetwork,
  {
    address: Lowercase<Address>
    ticketAddress: Lowercase<Address>
    tokenAddress: Lowercase<Address>
    migrateTo: { chainId: SupportedNetwork; address: Lowercase<Address> }
    podAddress?: Lowercase<Address>
  }[]
> = {
  [NETWORK.mainnet]: [
    {
      address: '0xebfb47a7ad0fd6e57323c8a42b2e5a6a4f68fc1a',
      ticketAddress: '0x334cbb5858417aee161b53ee0d5349ccf54514cf',
      tokenAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
      migrateTo: MIGRATION_DESTINATIONS.usdcVault,
      podAddress: '0x2f994e2e4f3395649eee8a89092e63ca526da829'
    },
    {
      address: '0xde9ec95d7708b8319ccca4b8bc92c0a3b70bf416',
      ticketAddress: '0xd81b1a8b1ad00baa2d6609e0bae28a38713872f7',
      tokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      migrateTo: MIGRATION_DESTINATIONS.usdcVault,
      podAddress: '0x386eb78f2ee79adde8bdb0a0e27292755ebfea58'
    },
    {
      address: '0x0650d780292142835f6ac58dd8e2a336e87b4393',
      ticketAddress: '0xa92a861fc11b99b24296af880011b47f9cafb5ab',
      tokenAddress: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
      migrateTo: MIGRATION_DESTINATIONS.wethVault
    },
    {
      address: '0xbc82221e131c082336cf698f0ca3ebd18afd4ce7',
      ticketAddress: '0x27b85f596feb14e4b5faa9671720a556a7608c69',
      tokenAddress: '0xc00e94cb662c3520282e6f5717214004a7f26888',
      migrateTo: MIGRATION_DESTINATIONS.wethVault
    },
    {
      address: '0x65c8827229fbd63f9de9fdfd400c9d264066a336',
      ticketAddress: '0x1dea6d02325de05b1f412c9370653aae7cedf91f',
      tokenAddress: '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd',
      migrateTo: MIGRATION_DESTINATIONS.usdcVault
    },
    {
      address: '0x396b4489da692788e327e2e4b2b0459a5ef26791',
      ticketAddress: '0x27d22a7648e955e510a40bdb058333e9190d12d4',
      tokenAddress: '0x0cec1a9154ff802e7934fc916ed7ca50bde6844e',
      migrateTo: MIGRATION_DESTINATIONS.wethVault
    }
  ],
  [NETWORK.optimism]: [],
  [NETWORK.polygon]: [
    {
      address: '0xee06abe9e2af61cabcb13170e01266af2defa946',
      ticketAddress: '0x473e484c722ef9ec6f63b509b07bb9cfb258820b',
      tokenAddress: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
      migrateTo: MIGRATION_DESTINATIONS.usdcVault
    },
    {
      address: '0x887e17d791dcb44bfdda3023d26f7a04ca9c7ef4',
      ticketAddress: '0x9ecb26631098973834925eb453de1908ea4bdd4e',
      tokenAddress: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
      migrateTo: MIGRATION_DESTINATIONS.usdcVault
    }
  ],
  [NETWORK.avalanche]: [],
  [NETWORK.celo]: [
    {
      address: '0x6f634f531ed0043b94527f68ec7861b4b1ab110d',
      ticketAddress: '0xa45ba19df569d536251ce65dd3120bf7873e14ec',
      tokenAddress: '0x765de816845861e75a25fca122bb6898b8b1282a',
      migrateTo: MIGRATION_DESTINATIONS.usdcVault
    },
    {
      address: '0xbe55435bda8f0a2a20d2ce98cc21b0af5bfb7c83',
      ticketAddress: '0xddbdbe029f9800f7c49764f15a1a1e55755648e4',
      tokenAddress: '0xd8763cba276a3738e6de85b4b3bf5fded6d6ca73',
      migrateTo: MIGRATION_DESTINATIONS.usdcVault
    }
  ]
}
