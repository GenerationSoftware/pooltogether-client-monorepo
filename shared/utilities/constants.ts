import { Address } from 'viem'

/**
 * Network IDs
 */
export enum NETWORK {
  mainnet = 1,
  sepolia = 11155111,
  bsc = 56,
  bsc_testnet = 97,
  xdai = 100,
  polygon = 137,
  mumbai = 80001,
  optimism = 10,
  optimism_sepolia = 11155420,
  avalanche = 43114,
  fuji = 43113,
  celo = 42220,
  celo_testnet = 44787,
  arbitrum = 42161,
  arbitrum_sepolia = 421614,
  base = 8453,
  base_sepolia = 84532
}
export type NETWORK_NAME = keyof typeof NETWORK

/**
 * POOL token addresses
 */
export const POOL_TOKEN_ADDRESSES = {
  [NETWORK.mainnet]: '0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e',
  [NETWORK.polygon]: '0x25788a1a171ec66Da6502f9975a15B609fF54CF6',
  [NETWORK.optimism]: '0x395ae52bb17aef68c2888d941736a71dc6d4e125',
  [NETWORK.sepolia]: '0x196EEF5231Bc8806ddFdBAaF7b5aC206Bd316f45'
} as const

/**
 * USDC token addresses
 *
 * NOTE: All addresses are lowercase
 */
export const USDC_TOKEN_ADDRESSES: { [chainId: number]: Lowercase<Address> } = {
  [NETWORK.mainnet]: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  [NETWORK.polygon]: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
  [NETWORK.optimism]: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
  [NETWORK.arbitrum]: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
  [NETWORK.sepolia]: '0xd09eb8de85d547cfbf09f972edcc6f871b192b70'
}

/**
 * Second constants
 */
export const SECONDS_PER_MINUTE = 60
export const SECONDS_PER_HOUR = 3_600
export const SECONDS_PER_DAY = 86_400
export const SECONDS_PER_WEEK = 604_800
export const SECONDS_PER_MONTH = 2_628_000
export const SECONDS_PER_YEAR = 31_536_000

/**
 * Minute constants
 */
export const MINUTES_PER_HOUR = 60
export const MINUTES_PER_DAY = 1_440

/**
 * CoinGecko API URL
 */
export const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3'

/**
 * Token Prices API URL
 */
export const TOKEN_PRICES_API_URL = 'https://token-prices.api.cabana.fi'

/**
 * Prize Pools
 */
export const PRIZE_POOLS: {
  chainId: NETWORK
  address: Address
  options: {
    prizeTokenAddress: Address
    drawManagerAddress: Address
    twabControllerAddress: Address
    drawPeriodInSeconds: number
    drawAuctionDurationInSeconds: number
    tierShares: number
    reserveShares: number
  }
}[] = [
  {
    chainId: NETWORK.sepolia,
    address: '0x934F03f3132d3B818d7c07F25818ea3961eF18aD',
    options: {
      prizeTokenAddress: '0x00a66C161e4C7A9dAEFd3dF8Cbbb08a3DE5b5F73',
      drawManagerAddress: '0xF21086aef81Eb3F5535B4bC8BA172bcFB5f1f3b4',
      twabControllerAddress: '0x1F834baC8e84A4a4367025CE9e9BdCE85302dFdE',
      drawPeriodInSeconds: 7_200,
      drawAuctionDurationInSeconds: 2_400,
      tierShares: 100,
      reserveShares: 20
    }
  }
]

/**
 * Subgraph API URLs
 */
export const SUBGRAPH_API_URLS = {
  // TODO: add subgraph apis when available
} as const

/**
 * CoinGecko platform IDs
 */
export const COINGECKO_PLATFORMS = {
  [NETWORK.mainnet]: 'ethereum',
  [NETWORK.bsc]: 'binance-smart-chain',
  [NETWORK.xdai]: 'xdai',
  [NETWORK.polygon]: 'polygon-pos',
  [NETWORK.optimism]: 'optimistic-ethereum',
  [NETWORK.avalanche]: 'avalanche',
  [NETWORK.celo]: 'celo',
  [NETWORK.arbitrum]: 'arbitrum-one'
} as const
export type COINGECKO_PLATFORM = keyof typeof COINGECKO_PLATFORMS

/**
 * CoinGecko native token IDs
 */
export const COINGECKO_NATIVE_TOKEN_IDS: Record<NETWORK, string> = {
  [NETWORK.mainnet]: 'ethereum',
  [NETWORK.sepolia]: 'ethereum',
  [NETWORK.bsc]: 'binancecoin',
  [NETWORK.bsc_testnet]: 'binancecoin',
  [NETWORK.xdai]: 'xdai',
  [NETWORK.polygon]: 'matic-network',
  [NETWORK.mumbai]: 'matic-network',
  [NETWORK.optimism]: 'ethereum',
  [NETWORK.optimism_sepolia]: 'ethereum',
  [NETWORK.avalanche]: 'avalanche-2',
  [NETWORK.fuji]: 'avalanche-2',
  [NETWORK.celo]: 'celo',
  [NETWORK.celo_testnet]: 'celo',
  [NETWORK.arbitrum]: 'ethereum',
  [NETWORK.arbitrum_sepolia]: 'ethereum',
  [NETWORK.base]: 'ethereum',
  [NETWORK.base_sepolia]: 'ethereum'
}

/**
 * Block explorer mapping
 */
export const BLOCK_EXPLORERS: Record<NETWORK, { name: string; url: string }> = {
  [NETWORK.mainnet]: { name: 'Etherscan', url: 'https://etherscan.io/' },
  [NETWORK.sepolia]: { name: 'Etherscan', url: 'https://sepolia.etherscan.io/' },
  [NETWORK.bsc]: { name: 'Bscscan', url: 'https://bscscan.com/' },
  [NETWORK.bsc_testnet]: { name: 'Bscscan', url: 'https://testnet.bscscan.com/' },
  [NETWORK.xdai]: { name: 'Gnosisscan', url: 'https://gnosisscan.io/' },
  [NETWORK.polygon]: { name: 'Polygonscan', url: 'https://polygonscan.com/' },
  [NETWORK.mumbai]: { name: 'Polygonscan', url: 'https://mumbai.polygonscan.com/' },
  [NETWORK.optimism]: { name: 'Etherscan', url: 'https://optimistic.etherscan.io/' },
  [NETWORK.optimism_sepolia]: { name: 'Etherscan', url: 'https://sepolia-optimism.etherscan.io/' },
  [NETWORK.avalanche]: { name: 'Snowtrace', url: 'https://snowtrace.io/' },
  [NETWORK.fuji]: { name: 'Snowtrace', url: 'https://testnet.snowtrace.io/' },
  [NETWORK.celo]: { name: 'Celoscan', url: 'https://celoscan.io/' },
  [NETWORK.celo_testnet]: { name: 'Celoscan', url: 'https://alfajores.celoscan.io/' },
  [NETWORK.arbitrum]: { name: 'Arbiscan', url: 'https://arbiscan.io/' },
  [NETWORK.arbitrum_sepolia]: { name: 'Arbiscan', url: 'https://sepolia.arbiscan.io/' },
  [NETWORK.base]: { name: 'Basescan', url: 'https://basescan.org/' },
  [NETWORK.base_sepolia]: { name: 'Blockscout', url: 'https://sepolia.basescan.org/' }
}

/**
 * Stablecoin addresses and their corresponding fiat currency
 *
 * NOTE: All addresses are lowercase
 */
export const STABLECOINS: Record<NETWORK, { [address: Address]: string }> = {
  [NETWORK.mainnet]: {
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': 'usd', // USDC
    '0x6b175474e89094c44da98b954eedeac495271d0f': 'usd', // DAI
    '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd': 'usd' // GUSD
  },
  [NETWORK.sepolia]: {
    '0xd09eb8de85d547cfbf09f972edcc6f871b192b70': 'usd', // USDC
    '0x50088bf4dba58145c0b873643d285626f87837c3': 'usd', // DAI
    '0x2b8919310d8e2576e19e22794a6d3ec961cd812a': 'usd' // GUSD
  },
  [NETWORK.bsc]: {},
  [NETWORK.bsc_testnet]: {},
  [NETWORK.xdai]: {},
  [NETWORK.polygon]: {
    '0x2791bca1f2de4661ed88a30c99a7a9449aa84174': 'usd' // USDC.e
  },
  [NETWORK.mumbai]: {},
  [NETWORK.optimism]: {
    '0x0b2c639c533813f4aa9d7837caf62653d097ff85': 'usd', // USDC
    '0x7f5c764cbc14f9669b88837ca1490cca17c31607': 'usd', // USDC.e
    '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1': 'usd', // DAI
    '0xc40f949f8a4e094d1b49a23ea9241d289b7b2819': 'usd' // LUSD
  },
  [NETWORK.optimism_sepolia]: {},
  [NETWORK.avalanche]: {
    '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664': 'usd' // USDC.e
  },
  [NETWORK.fuji]: {},
  [NETWORK.celo]: {},
  [NETWORK.celo_testnet]: {},
  [NETWORK.arbitrum]: {},
  [NETWORK.arbitrum_sepolia]: {},
  [NETWORK.base]: {},
  [NETWORK.base_sepolia]: {}
}

/**
 * Wrapped native asset addresses (example: WETH, WMATIC, etc.)
 *
 * NOTE: All addresses are lowercase
 */
export const WRAPPED_NATIVE_ASSETS: Record<NETWORK, Address | null> = {
  [NETWORK.mainnet]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  [NETWORK.sepolia]: null,
  [NETWORK.bsc]: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
  [NETWORK.bsc_testnet]: null,
  [NETWORK.xdai]: null,
  [NETWORK.polygon]: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
  [NETWORK.mumbai]: null,
  [NETWORK.optimism]: '0x4200000000000000000000000000000000000006',
  [NETWORK.optimism_sepolia]: null,
  [NETWORK.avalanche]: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
  [NETWORK.fuji]: null,
  [NETWORK.celo]: null,
  [NETWORK.celo_testnet]: null,
  [NETWORK.arbitrum]: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
  [NETWORK.arbitrum_sepolia]: null,
  [NETWORK.base]: '0x4200000000000000000000000000000000000006',
  [NETWORK.base_sepolia]: null
}

/**
 * TWAB rewards addresses
 */
export const TWAB_REWARDS_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.sepolia]: '0x3668d73fe09244b6F66B601285076715A09eD07F'
}

/**
 * Vault factory addresses
 */
export const VAULT_FACTORY_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.sepolia]: '0x3874f4fD4b089e1a013b18870b2B1b83eCe57349'
}

/**
 * Liquidation pair factory addresses
 */
export const LIQUIDATION_PAIR_FACTORY_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.sepolia]: '0x4FeaaefBb5767d577547d8B1eB61Bfec172A7525'
}

/**
 * Default claimer addresses
 */
export const DEFAULT_CLAIMER_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.sepolia]: '0xd6d4668AE64FF24fFF82b0DF7d12e7A5Ec936555'
}

/**
 * Liquidation router addresses
 */
export const LIQUIDATION_ROUTER_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.sepolia]: '0xB0A9467863837D09e2C7A7a78F6A68F8857999Af'
}

/**
 * Dolphin address
 */
export const DOLPHIN_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

/**
 * Dead address
 */
export const DEAD_ADDRESS = '0x000000000000000000000000000000000000dead'

/**
 * Optimism gas oracle address
 */
export const OP_GAS_ORACLE_ADDRESS = '0x420000000000000000000000000000000000000f'

/**
 * Networks supported by the price caching API
 */
export const TOKEN_PRICE_API_SUPPORTED_NETWORKS: NETWORK[] = [
  NETWORK.mainnet,
  NETWORK.optimism,
  NETWORK.arbitrum,
  NETWORK.polygon
]

/**
 * Redirects for tokens without pricing data on the caching API
 *
 * NOTE: All addresses are lowercase
 */
export const TOKEN_PRICE_REDIRECTS: {
  [chainId: number]: { [address: string]: { chainId: number; address: Address } }
} = {
  [NETWORK.optimism]: {
    /* POOL */
    '0x395ae52bb17aef68c2888d941736a71dc6d4e125': {
      chainId: NETWORK.mainnet,
      address: POOL_TOKEN_ADDRESSES[NETWORK.mainnet].toLowerCase() as Address
    },
    /* agEUR */
    '0x9485aca5bbbe1667ad97c7fe7c4531a624c8b1ed': {
      chainId: NETWORK.mainnet,
      address: '0x1a7e4e63778b4f12a199c062f3efdd288afcbce8'
    }
  },
  [NETWORK.polygon]: {
    /* MATIC */
    [DOLPHIN_ADDRESS]: {
      chainId: NETWORK.polygon,
      address: '0x0000000000000000000000000000000000001010'
    }
  },
  [NETWORK.sepolia]: {
    /* ETH */
    [DOLPHIN_ADDRESS]: {
      chainId: NETWORK.mainnet,
      address: DOLPHIN_ADDRESS
    },
    /* DAI */
    '0x50088bf4dba58145c0b873643d285626f87837c3': {
      chainId: NETWORK.mainnet,
      address: '0x6b175474e89094c44da98b954eedeac495271d0f'
    },
    /* USDC */
    [USDC_TOKEN_ADDRESSES[NETWORK.sepolia]]: {
      chainId: NETWORK.mainnet,
      address: USDC_TOKEN_ADDRESSES[NETWORK.mainnet]
    },
    /* GUSD */
    '0x2b8919310d8e2576e19e22794a6d3ec961cd812a': {
      chainId: NETWORK.mainnet,
      address: '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd'
    },
    /* WBTC */
    '0x0364994c88f97a18740ec791a336b2d63407f8d5': {
      chainId: NETWORK.mainnet,
      address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'
    },
    /* WETH */
    '0x00a66c161e4c7a9daefd3df8cbbb08a3de5b5f73': {
      chainId: NETWORK.mainnet,
      address: WRAPPED_NATIVE_ASSETS[NETWORK.mainnet] as Address
    },
    /* POOL */
    [POOL_TOKEN_ADDRESSES[NETWORK.sepolia]]: {
      chainId: NETWORK.mainnet,
      address: POOL_TOKEN_ADDRESSES[NETWORK.mainnet]
    }
  }
}

/**
 * Redirects for offchain token rebrandings
 *
 * NOTE: All addresses are lowercase
 */
export const TOKEN_DATA_REDIRECTS: {
  [chainId: number]: { [address: string]: { name?: string; symbol?: string } }
} = {
  [NETWORK.optimism]: {
    '0x7f5c764cbc14f9669b88837ca1490cca17c31607': {
      name: 'USDC (Bridged from Ethereum)',
      symbol: 'USDC.e'
    }
  },
  [NETWORK.arbitrum]: {
    '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8': {
      name: 'USDC (Bridged from Ethereum)',
      symbol: 'USDC.e'
    }
  }
}

/**
 * Max uint256 value
 */
export const MAX_UINT_256 = 2n ** 256n - 1n

/**
 * EIP2612 Permit Types
 */
export const EIP2612_PERMIT_TYPES = {
  Permit: [
    { name: 'owner', type: 'address' },
    { name: 'spender', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' }
  ]
} as const

/**
 * Old DAI Permit Types
 */
export const OLD_DAI_PERMIT_TYPES = {
  Permit: [
    { name: 'holder', type: 'address' },
    { name: 'spender', type: 'address' },
    { name: 'nonce', type: 'uint256' },
    { name: 'expiry', type: 'uint256' },
    { name: 'allowed', type: 'bool' }
  ]
} as const
