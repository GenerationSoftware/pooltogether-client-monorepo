import { Address } from 'viem'

/**
 * Network IDs
 */
export enum NETWORK {
  'mainnet' = 1,
  'goerli' = 5,
  'sepolia' = 11155111,
  'bsc' = 56,
  'bsc-testnet' = 97,
  'xdai' = 100,
  'polygon' = 137,
  'mumbai' = 80001,
  'optimism' = 10,
  'optimism-goerli' = 420,
  'avalanche' = 43114,
  'fuji' = 43113,
  'celo' = 42220,
  'celo-testnet' = 44787,
  'arbitrum' = 42161,
  'arbitrum-goerli' = 421613
}
export type NETWORK_NAME = keyof typeof NETWORK

/**
 * POOL token addresses
 */
export const POOL_TOKEN_ADDRESSES = {
  [NETWORK.mainnet]: '0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e',
  [NETWORK.polygon]: '0x25788a1a171ec66Da6502f9975a15B609fF54CF6',
  [NETWORK.optimism]: '0x395ae52bb17aef68c2888d941736a71dc6d4e125',
  [NETWORK['optimism-goerli']]: '0x0Ec780bE0191f8A364FAccdE91D13BE6F96632bE'
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
  [NETWORK['optimism-goerli']]: '0xb7930c829cc1de1b37a3bb9b477e33251da15a50'
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
  options: { prizeTokenAddress: Address; drawPeriodInSeconds: number; tierShares: number }
}[] = [
  {
    chainId: NETWORK.optimism,
    address: '0xe32e5E1c5f0c80bD26Def2d0EA5008C107000d6A',
    options: {
      prizeTokenAddress: '0x395ae52bb17aef68c2888d941736a71dc6d4e125',
      drawPeriodInSeconds: 86_400,
      tierShares: 100
    }
  },
  {
    chainId: NETWORK['optimism-goerli'],
    address: '0x8FaF98698e4fF29149a8A9D06Db20E3509F3754b',
    options: {
      prizeTokenAddress: '0x0Ec780bE0191f8A364FAccdE91D13BE6F96632bE',
      drawPeriodInSeconds: 21_600,
      tierShares: 100
    }
  }
]

/**
 * Subgraph API URLs
 */
export const SUBGRAPH_API_URLS = Object.freeze({
  [NETWORK.optimism]: 'https://api.studio.thegraph.com/query/50959/pt-v5-op/version/latest',
  [NETWORK['optimism-goerli']]:
    'https://api.studio.thegraph.com/query/50959/pt-v5-op-goerli/v0.0.23'
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
  [NETWORK.goerli]: 'ethereum',
  [NETWORK.sepolia]: 'ethereum',
  [NETWORK.bsc]: 'binancecoin',
  [NETWORK['bsc-testnet']]: 'binancecoin',
  [NETWORK.xdai]: 'xdai',
  [NETWORK.polygon]: 'matic-network',
  [NETWORK.mumbai]: 'matic-network',
  [NETWORK.optimism]: 'ethereum',
  [NETWORK['optimism-goerli']]: 'ethereum',
  [NETWORK.avalanche]: 'avalanche-2',
  [NETWORK.fuji]: 'avalanche-2',
  [NETWORK.celo]: 'celo',
  [NETWORK['celo-testnet']]: 'celo',
  [NETWORK.arbitrum]: 'ethereum',
  [NETWORK['arbitrum-goerli']]: 'ethereum'
})

/**
 * Block explorer mapping
 */
export const BLOCK_EXPLORERS: Record<NETWORK, { name: string; url: string }> = Object.freeze({
  [NETWORK.mainnet]: { name: 'Etherscan', url: 'https://etherscan.io/' },
  [NETWORK.goerli]: { name: 'Etherscan', url: 'https://goerli.etherscan.io/' },
  [NETWORK.sepolia]: { name: 'Etherscan', url: 'https://sepolia.etherscan.io/' },
  [NETWORK.bsc]: { name: 'BscScan', url: 'https://bscscan.com/' },
  [NETWORK['bsc-testnet']]: { name: 'BscScan', url: 'https://testnet.bscscan.com/' },
  [NETWORK.xdai]: { name: 'GnosisScan', url: 'https://gnosisscan.io/' },
  [NETWORK.polygon]: { name: 'PolygonScan', url: 'https://polygonscan.com/' },
  [NETWORK.mumbai]: { name: 'PolygonScan', url: 'https://mumbai.polygonscan.com/' },
  [NETWORK.optimism]: { name: 'Etherscan', url: 'https://optimistic.etherscan.io/' },
  [NETWORK['optimism-goerli']]: { name: 'Etherscan', url: 'https://goerli-optimism.etherscan.io/' },
  [NETWORK.avalanche]: { name: 'Snowtrace', url: 'https://snowtrace.io/' },
  [NETWORK.fuji]: { name: 'Snowtrace', url: 'https://testnet.snowtrace.io/' },
  [NETWORK.celo]: { name: 'CeloScan', url: 'https://celoscan.io/' },
  [NETWORK['celo-testnet']]: { name: 'CeloScan', url: 'https://alfajores.celoscan.io/' },
  [NETWORK.arbitrum]: { name: 'ArbiScan', url: 'https://arbiscan.io/' },
  [NETWORK['arbitrum-goerli']]: { name: 'ArbiScan', url: 'https://goerli.arbiscan.io/' }
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
  [NETWORK.goerli]: {},
  [NETWORK.sepolia]: {},
  [NETWORK.bsc]: {},
  [NETWORK['bsc-testnet']]: {},
  [NETWORK.xdai]: {},
  [NETWORK.polygon]: {},
  [NETWORK.mumbai]: {},
  [NETWORK.optimism]: {
    '0x7f5c764cbc14f9669b88837ca1490cca17c31607': 'usd', // USDC
    '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1': 'usd', // DAI
    '0xc40f949f8a4e094d1b49a23ea9241d289b7b2819': 'usd' // LUSD
  },
  [NETWORK['optimism-goerli']]: {
    '0xb7930c829cc1de1b37a3bb9b477e33251da15a50': 'usd', // USDC
    '0x4d07ba104ff254c19b443ade6224f744db84fb8a': 'usd', // DAI
    '0x041a898bc37129d2d2232163c3374f4077255f74': 'usd' // GUSD
  },
  [NETWORK.avalanche]: {},
  [NETWORK.fuji]: {},
  [NETWORK.celo]: {},
  [NETWORK['celo-testnet']]: {},
  [NETWORK.arbitrum]: {},
  [NETWORK['arbitrum-goerli']]: {}
}

/**
 * Wrapped native asset addresses (example: WETH, WMATIC, etc.)
 *
 * NOTE: All addresses are lowercase
 */
export const WRAPPED_NATIVE_ASSETS: Record<NETWORK, Address | null> = {
  [NETWORK.mainnet]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  [NETWORK.goerli]: null,
  [NETWORK.sepolia]: null,
  [NETWORK.bsc]: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
  [NETWORK['bsc-testnet']]: null,
  [NETWORK.xdai]: null,
  [NETWORK.polygon]: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
  [NETWORK.mumbai]: null,
  [NETWORK.optimism]: '0x4200000000000000000000000000000000000006',
  [NETWORK['optimism-goerli']]: null,
  [NETWORK.avalanche]: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
  [NETWORK.fuji]: null,
  [NETWORK.celo]: null,
  [NETWORK['celo-testnet']]: null,
  [NETWORK.arbitrum]: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
  [NETWORK['arbitrum-goerli']]: null
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
  [NETWORK.goerli]: {
    address: '0xAFCeDe71e62684De45D423712FeEeBB83863DfDE',
    sequenceOffset: 1_697_371_200,
    sequencePeriod: 21_600
  }
}

/**
 * RNG relay addresses
 */
export const RNG_RELAY_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.mainnet]: '0xEC9460c59cCA1299b0242D6AF426c21223ccCD24',
  [NETWORK.optimism]: '0x87d3D9afeD1702728B7F280ba5c4b4c55DEfa557',
  [NETWORK.goerli]: '0xe34deF1114d7Bb0298636A2026D9Cf3D67F19FBd',
  [NETWORK['optimism-goerli']]: '0x5C9c04FC5D6431A2101b8395E13B565762980F97'
}

/**
 * Message executor addresses
 */
export const MSG_EXECUTOR_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.optimism]: '0x139f6dD114a9C45Ba43eE22C5e03c53de0c13225',
  [NETWORK['optimism-goerli']]: '0x59Ba766ff229c21b97184647292706039aF63dA1'
}

/**
 * TWAB controller addresses
 */
export const TWAB_CONTROLLER_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.optimism]: '0x499a9F249ec4c8Ea190bebbFD96f9A83bf4F6E52',
  [NETWORK['optimism-goerli']]: '0x0B09590E2dE22A629B45258812C0B25904689B5a'
}

/**
 * Vault factory addresses
 */
export const VAULT_FACTORY_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.optimism]: '0xF65FA202907D6046D1eF33C521889B54BdE08081',
  [NETWORK['optimism-goerli']]: '0x53B7922eeCe8afE5bdaA170E20dc32c6deDA5277'
}

/**
 * Liquidation pair factory addresses
 */
export const LIQUIDATION_PAIR_FACTORY_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.optimism]: '0x555BD8Fc65E57139C9F405980C7A9526A7De8093',
  [NETWORK['optimism-goerli']]: '0x21b8f4c7E92a37B893BE39b4Ec447459fa5031C6'
}

/**
 * Default claimer addresses
 */
export const DEFAULT_CLAIMER_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.optimism]: '0xdc6aB38f9590cB8e4357e0a391689a7C5Ef7681E',
  [NETWORK['optimism-goerli']]: '0x0294997B1100d6e35fd3868c6544c881096a23E1'
}

/**
 * Liquidation router addresses
 */
export const LIQUIDATION_ROUTER_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.optimism]: '0xB9Fba7B2216167DCdd1A7AE0a564dD43E1b68b95',
  [NETWORK['optimism-goerli']]: '0x6de2B30BE94F9Da2516CD30093fB11e0c4bFf422'
}

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
  [NETWORK['optimism-goerli']]: {
    /* DAI */
    '0x4d07ba104ff254c19b443ade6224f744db84fb8a': {
      chainId: NETWORK.optimism,
      address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1'
    },
    /* USDC */
    '0xb7930c829cc1de1b37a3bb9b477e33251da15a50': {
      chainId: NETWORK.optimism,
      address: USDC_TOKEN_ADDRESSES[NETWORK.optimism]
    },
    /* GUSD */
    '0x041a898bc37129d2d2232163c3374f4077255f74': {
      chainId: NETWORK.mainnet,
      address: '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd'
    },
    /* WBTC */
    '0x331cdb619147a20c32e7b9391a4797ed9656b104': {
      chainId: NETWORK.optimism,
      address: '0x68f180fcce6836688e9084f035309e29bf0a2095'
    },
    /* WETH */
    '0xb8e70b16b8d99753ce55f0e4c2a7eceeece30b64': {
      chainId: NETWORK.optimism,
      address: '0x4200000000000000000000000000000000000006'
    },
    /* POOL */
    '0x0ec780be0191f8a364faccde91d13be6f96632be': {
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
  }
}

/**
 * Max uint256 value
 */
export const MAX_UINT_256 = 2n ** 256n - 1n

/**
 * Dolphin Address Address
 */
export const DOLPHIN_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

/**
 * Dead Address
 */
export const DEAD_ADDRESS = '0x000000000000000000000000000000000000dead'

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
