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
  [NETWORK.optimism_sepolia]: '0xD675B9c8eea7f6Bd506d5FF66A10cF7B887CD293',
  [NETWORK.arbitrum_sepolia]: '0xF401D1482DFAa89A050F111992A222e9ad123E14'
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
  [NETWORK.optimism_sepolia]: '0x8067f3cb6eef936256108ff19a05574b8ad99cf3',
  [NETWORK.arbitrum]: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
  [NETWORK.arbitrum_sepolia]: '0x7a6dbc7ff4f1a2d864291db3aec105a8eee4a3d2'
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
    drawPeriodInSeconds: number
    tierShares: number
    reserveShares: number
  }
}[] = [
  {
    chainId: NETWORK.optimism,
    address: '0xe32e5E1c5f0c80bD26Def2d0EA5008C107000d6A',
    options: {
      prizeTokenAddress: '0x395ae52bb17aef68c2888d941736a71dc6d4e125',
      drawPeriodInSeconds: 86_400,
      tierShares: 100,
      reserveShares: 80
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0x46547a849f68178208490Cdd491Df15a5bEeA4B2',
    options: {
      prizeTokenAddress: '0xD675B9c8eea7f6Bd506d5FF66A10cF7B887CD293',
      drawPeriodInSeconds: 21_600,
      tierShares: 100,
      reserveShares: 80
    }
  },
  {
    chainId: NETWORK.arbitrum_sepolia,
    address: '0x6Fd1dF849DFC4F76F0B15ba0c8D3e99FF84817f1',
    options: {
      prizeTokenAddress: '0xF401D1482DFAa89A050F111992A222e9ad123E14',
      drawPeriodInSeconds: 21_600,
      tierShares: 100,
      reserveShares: 80
    }
  }
]

/**
 * Subgraph API URLs
 */
export const SUBGRAPH_API_URLS = Object.freeze({
  [NETWORK.optimism]: 'https://api.studio.thegraph.com/query/50959/pt-v5-op/version/latest',
  [NETWORK.arbitrum_sepolia]:
    'https://api.thegraph.com/subgraphs/name/chuckbergeron/pt-v5-arb-sepolia' // TODO: switch to proper version once available
})

/**
 * CoinGecko platform IDs
 */
export const COINGECKO_PLATFORMS = Object.freeze({
  [NETWORK.mainnet]: 'ethereum',
  [NETWORK.bsc]: 'binance-smart-chain',
  [NETWORK.xdai]: 'xdai',
  [NETWORK.polygon]: 'polygon-pos',
  [NETWORK.optimism]: 'optimistic-ethereum',
  [NETWORK.avalanche]: 'avalanche',
  [NETWORK.celo]: 'celo',
  [NETWORK.arbitrum]: 'arbitrum-one'
})
export type COINGECKO_PLATFORM = keyof typeof COINGECKO_PLATFORMS

/**
 * CoinGecko native token IDs
 */
export const COINGECKO_NATIVE_TOKEN_IDS: Record<NETWORK, string> = Object.freeze({
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
})

/**
 * Block explorer mapping
 */
export const BLOCK_EXPLORERS: Record<NETWORK, { name: string; url: string }> = Object.freeze({
  [NETWORK.mainnet]: { name: 'Etherscan', url: 'https://etherscan.io/' },
  [NETWORK.sepolia]: { name: 'Etherscan', url: 'https://sepolia.etherscan.io/' },
  [NETWORK.bsc]: { name: 'Bscscan', url: 'https://bscscan.com/' },
  [NETWORK.bsc_testnet]: { name: 'Bscscan', url: 'https://testnet.bscscan.com/' },
  [NETWORK.xdai]: { name: 'Gnosisscan', url: 'https://gnosisscan.io/' },
  [NETWORK.polygon]: { name: 'Polygonscan', url: 'https://polygonscan.com/' },
  [NETWORK.mumbai]: { name: 'Polygonscan', url: 'https://mumbai.polygonscan.com/' },
  [NETWORK.optimism]: { name: 'Etherscan', url: 'https://optimistic.etherscan.io/' },
  [NETWORK.optimism_sepolia]: {
    name: 'Etherscan',
    url: 'https://sepolia-optimism.etherscan.io/'
  },
  [NETWORK.avalanche]: { name: 'Snowtrace', url: 'https://snowtrace.io/' },
  [NETWORK.fuji]: { name: 'Snowtrace', url: 'https://testnet.snowtrace.io/' },
  [NETWORK.celo]: { name: 'Celoscan', url: 'https://celoscan.io/' },
  [NETWORK.celo_testnet]: { name: 'Celoscan', url: 'https://alfajores.celoscan.io/' },
  [NETWORK.arbitrum]: { name: 'Arbiscan', url: 'https://arbiscan.io/' },
  [NETWORK.arbitrum_sepolia]: { name: 'Arbiscan', url: 'https://sepolia.arbiscan.io/' },
  [NETWORK.base]: { name: 'Basescan', url: 'https://basescan.org/' },
  [NETWORK.base_sepolia]: { name: 'Blockscout', url: 'https://base-sepolia.blockscout.com/' } // TODO: update to basescan when available
})

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
  [NETWORK.sepolia]: {},
  [NETWORK.bsc]: {},
  [NETWORK.bsc_testnet]: {},
  [NETWORK.xdai]: {},
  [NETWORK.polygon]: {},
  [NETWORK.mumbai]: {},
  [NETWORK.optimism]: {
    '0x0b2c639c533813f4aa9d7837caf62653d097ff85': 'usd', // USDC
    '0x7f5c764cbc14f9669b88837ca1490cca17c31607': 'usd', // USDC.e
    '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1': 'usd', // DAI
    '0xc40f949f8a4e094d1b49a23ea9241d289b7b2819': 'usd' // LUSD
  },
  [NETWORK.optimism_sepolia]: {
    '0x8067f3cb6eef936256108ff19a05574b8ad99cf3': 'usd', // USDC
    '0xd590ec14364731b62265a5cc807164a17c6797d4': 'usd', // DAI
    '0x1a188719711d62423abf1a4de7d8aa9014a39d73': 'usd' // GUSD
  },
  [NETWORK.avalanche]: {},
  [NETWORK.fuji]: {},
  [NETWORK.celo]: {},
  [NETWORK.celo_testnet]: {},
  [NETWORK.arbitrum]: {},
  [NETWORK.arbitrum_sepolia]: {
    '0x7a6dbc7ff4f1a2d864291db3aec105a8eee4a3d2': 'usd', // USDC
    '0x08c19fe57af150a1af975cb9a38769848c7df98e': 'usd', // DAI
    '0xb84460d777133a4b86540d557db35952e4adfee7': 'usd' // GUSD
  },
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
 * RNG auction addresses
 */
export const RNG_AUCTION: {
  [chainId: number]: { address: Address; sequenceOffset: number; sequencePeriod: number }
} = {
  [NETWORK.mainnet]: {
    address: '0x539A76507F18505cA696d618F8A684814c867F41',
    sequenceOffset: 1_697_508_000,
    sequencePeriod: 86_400
  },
  [NETWORK.sepolia]: {
    address: '0x1A188719711d62423abF1A4de7D8aA9014A39D73',
    sequenceOffset: 1_699_185_600,
    sequencePeriod: 21_600
  }
}

/**
 * RNG relay addresses
 */
export const RNG_RELAY_ADDRESSES: {
  [chainId: number]: { address: Address; from: { chainId: number; address: Address } }
} = {
  [NETWORK.optimism]: {
    address: '0x87d3D9afeD1702728B7F280ba5c4b4c55DEfa557',
    from: { chainId: NETWORK.mainnet, address: '0xEC9460c59cCA1299b0242D6AF426c21223ccCD24' }
  },
  [NETWORK.optimism_sepolia]: {
    address: '0x80788dD1bCc906b25C879F6f04A108C4DCFDB78F',
    from: { chainId: NETWORK.sepolia, address: '0x48cdb9fe4F71D9b6f17D8e4d72E4036931601BdE' }
  },
  [NETWORK.arbitrum_sepolia]: {
    address: '0x4A101c4703e8fa447859EF380048052b0cDB9893',
    from: { chainId: NETWORK.sepolia, address: '0xAFD0a893845cb2c278D6629c78fFA7ad403077Bf' }
  }
}

/**
 * Message executor addresses
 */
export const MSG_EXECUTOR_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.optimism]: '0x139f6dD114a9C45Ba43eE22C5e03c53de0c13225',
  [NETWORK.optimism_sepolia]: '0x6A501383A61ebFBc143Fc4BD41A2356bA71A6964',
  [NETWORK.arbitrum_sepolia]: '0x2B3E6b5c9a6Bdb0e595896C9093fce013490abbD'
}

/**
 * TWAB controller addresses
 */
export const TWAB_CONTROLLER_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.optimism]: '0x499a9F249ec4c8Ea190bebbFD96f9A83bf4F6E52',
  [NETWORK.optimism_sepolia]: '0x8027117dAf575dc0668EB0876dC89e622F4d2733',
  [NETWORK.arbitrum_sepolia]: '0xd57822B8846F36f0E1FC775C8214523db199a4C5'
}

/**
 * TWAB rewards addresses
 */
export const TWAB_REWARDS_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.optimism]: '0x27Ed5760Edc0128E3043F6cC0C3428E337396A66',
  [NETWORK.optimism_sepolia]: '0x18354F158CdcB87e81299c15110A5D59293B57F8',
  [NETWORK.arbitrum_sepolia]: '0x8cfFF0B59491835a2aCee98d9F9D9D2Ebe71a943'
}

/**
 * Vault factory addresses
 */
export const VAULT_FACTORY_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.optimism]: '0x6B17EE3a95BcCd605340454c5919e693Ef8EfF0E',
  [NETWORK.optimism_sepolia]: '0x47266c3447459793903Fe79589f43230fEAF3666',
  [NETWORK.arbitrum_sepolia]: '0x443E475baABAEA1Ec6Bb503acAaa7Fd39945f38F'
}

/**
 * Liquidation pair factory addresses
 */
export const LIQUIDATION_PAIR_FACTORY_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.optimism]: '0x555BD8Fc65E57139C9F405980C7A9526A7De8093',
  [NETWORK.optimism_sepolia]: '0xD72e8522824FCE34CCdC6E8872008465287304C1',
  [NETWORK.arbitrum_sepolia]: '0xb87E4dC3eDC62977bD8d93554a4cbF6c52c9282a'
}

/**
 * Default claimer addresses
 */
export const DEFAULT_CLAIMER_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.optimism]: '0xdc6aB38f9590cB8e4357e0a391689a7C5Ef7681E',
  [NETWORK.optimism_sepolia]: '0xB4B4bF1C75234f307BC1A2c7eFba9329e532caB9',
  [NETWORK.arbitrum_sepolia]: '0xcCf2b2da02C6F19b85265190F274BeE997808243'
}

/**
 * Liquidation router addresses
 */
export const LIQUIDATION_ROUTER_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.optimism]: '0xB9Fba7B2216167DCdd1A7AE0a564dD43E1b68b95',
  [NETWORK.optimism_sepolia]: '0x4f03fF51019f56495422E73287B0e4A9C454d371',
  [NETWORK.arbitrum_sepolia]: '0xeE79841CBCB6BF29989B8977952A58C4417D64A9'
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
  NETWORK.arbitrum
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

  [NETWORK.optimism_sepolia]: {
    /* ETH */
    [DOLPHIN_ADDRESS]: {
      chainId: NETWORK.mainnet,
      address: DOLPHIN_ADDRESS
    },
    /* DAI */
    '0xd590ec14364731b62265a5cc807164a17c6797d4': {
      chainId: NETWORK.optimism,
      address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1'
    },
    /* USDC */
    '0x8067f3cb6eef936256108ff19a05574b8ad99cf3': {
      chainId: NETWORK.optimism,
      address: USDC_TOKEN_ADDRESSES[NETWORK.optimism]
    },
    /* GUSD */
    '0x1a188719711d62423abf1a4de7d8aa9014a39d73': {
      chainId: NETWORK.mainnet,
      address: '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd'
    },
    /* WBTC */
    '0x149e3b3bd69f1cfc1b42b6a6a152a42e38ceebf1': {
      chainId: NETWORK.optimism,
      address: '0x68f180fcce6836688e9084f035309e29bf0a2095'
    },
    /* WETH */
    '0xa416ed51158c5616b997b785fa6d18f02d0458a8': {
      chainId: NETWORK.optimism,
      address: WRAPPED_NATIVE_ASSETS[NETWORK.optimism] as Address
    },
    /* POOL */
    '0xd675b9c8eea7f6bd506d5ff66a10cf7b887cd293': {
      chainId: NETWORK.mainnet,
      address: POOL_TOKEN_ADDRESSES[NETWORK.mainnet].toLowerCase() as Address
    }
  },
  [NETWORK.arbitrum_sepolia]: {
    /* ETH */
    [DOLPHIN_ADDRESS]: {
      chainId: NETWORK.mainnet,
      address: DOLPHIN_ADDRESS
    },
    /* DAI */
    '0x08c19fe57af150a1af975cb9a38769848c7df98e': {
      chainId: NETWORK.arbitrum,
      address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1'
    },
    /* USDC */
    '0x7a6dbc7ff4f1a2d864291db3aec105a8eee4a3d2': {
      chainId: NETWORK.arbitrum,
      address: USDC_TOKEN_ADDRESSES[NETWORK.arbitrum]
    },
    /* GUSD */
    '0xb84460d777133a4b86540d557db35952e4adfee7': {
      chainId: NETWORK.mainnet,
      address: '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd'
    },
    /* WBTC */
    '0x1bc266e1f397517ece9e384c55c7a5414b683639': {
      chainId: NETWORK.arbitrum,
      address: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f'
    },
    /* WETH */
    '0x779275fc1b987db24463801f3708f42f3c6f6ceb': {
      chainId: NETWORK.arbitrum,
      address: WRAPPED_NATIVE_ASSETS[NETWORK.arbitrum] as Address
    },
    /* POOL */
    '0xf401d1482dfaa89a050f111992a222e9ad123e14': {
      chainId: NETWORK.mainnet,
      address: POOL_TOKEN_ADDRESSES[NETWORK.mainnet].toLowerCase() as Address
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
