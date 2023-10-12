import { VaultList } from '@shared/types'
import { JSONSchemaType } from 'ajv'
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
  [NETWORK['optimism-goerli']]: '0x722701e470b556571A7a3586ADaFa2E866CFD1A1'
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
  [NETWORK['optimism-goerli']]: '0x880027cc134a07ddc9e5c7e7659a11ecfd828705'
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
  // {
  //   chainId: NETWORK.optimism,
  //   address: '0x8CFFFfFa42407DB9DCB974C2C744425c3e58d832',
  //   options: {
  //     prizeTokenAddress: '0x395ae52bb17aef68c2888d941736a71dc6d4e125',
  //     drawPeriodInSeconds: 86_400,
  //     tierShares: 100
  //   }
  // },
  {
    chainId: NETWORK['optimism-goerli'],
    address: '0xb91194FB89561c2Bd7fC26bE68e5EAe5b00f5320',
    options: {
      prizeTokenAddress: '0x722701e470b556571A7a3586ADaFa2E866CFD1A1',
      drawPeriodInSeconds: 21_600,
      tierShares: 100
    }
  }
]

/**
 * Subgraph API URLs
 */
export const SUBGRAPH_API_URLS = Object.freeze({
  // [NETWORK.optimism]: '',
  [NETWORK['optimism-goerli']]:
    'https://api.studio.thegraph.com/query/50959/pt-v5-op-goerli/version/latest'
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
    '0x880027cc134a07ddc9e5c7e7659a11ecfd828705': 'usd', // USDC
    '0x2b311e07bce542a73bb4887d0f503f0b6ea70711': 'usd', // DAI
    '0x206acf3bbec50972880e665ee7d03342a2ff9f5d': 'usd' // GUSD
  },
  [NETWORK.avalanche]: {},
  [NETWORK.fuji]: {},
  [NETWORK.celo]: {},
  [NETWORK['celo-testnet']]: {},
  [NETWORK.arbitrum]: {},
  [NETWORK['arbitrum-goerli']]: {}
}

/**
 * RNG auction addresses
 */
export const RNG_AUCTION: {
  [chainId: number]: { address: Address; sequenceOffset: number; sequencePeriod: number }
} = {
  [NETWORK.mainnet]: {
    address: '0x8CFFFfFa42407DB9DCB974C2C744425c3e58d832',
    sequenceOffset: 1_693_335_600,
    sequencePeriod: 86_400
  },
  [NETWORK.goerli]: {
    address: '0x076Ecca6FD357cB83b038D70DB61805b611ba6C7',
    sequenceOffset: 1_696_420_800,
    sequencePeriod: 21_600
  }
}

/**
 * RNG relay addresses
 */
export const RNG_RELAY_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.mainnet]: '0xF4c47dacFda99bE38793181af9Fd1A2Ec7576bBF',
  [NETWORK.optimism]: '0xF4c47dacFda99bE38793181af9Fd1A2Ec7576bBF',
  [NETWORK.goerli]: '0x1977822061d8a394726803e2c2F6524a4E3e7Aff',
  [NETWORK['optimism-goerli']]: '0x7C77fE5a4261fe27e9219410c65f9d42747e5F69'
}

/**
 * Message executor addresses
 */
export const MSG_EXECUTOR_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.optimism]: '0x890a87E71E731342a6d10e7628bd1F0733ce3296',
  [NETWORK['optimism-goerli']]: '0x59Ba766ff229c21b97184647292706039aF63dA1'
}

/**
 * TWAB controller addresses
 */
export const TWAB_CONTROLLER_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.optimism]: '0x0D51a33975024E8aFc55fde9F6b070c10AA71Dd9',
  [NETWORK['optimism-goerli']]: '0xE7dc3F91D2682a99e40c98aC5a8791461418234F'
}

/**
 * Vault factory addresses
 */
export const VAULT_FACTORY_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.optimism]: '0xA469deff6D52C9571d13513e3cd7d94496082d81',
  [NETWORK['optimism-goerli']]: '0x7A8f1413B44F7346EAb36c4793Bd54148Ca916A5'
}

/**
 * Liquidation pair factory addresses
 */
export const LIQUIDATION_PAIR_FACTORY_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.optimism]: '0xa1697E8F6b11D0E2F00d9dC8a5AEae2b2665650a',
  [NETWORK['optimism-goerli']]: '0x4a798649F6AA23D6a3a1cab65fc0a8fa772E0a40'
}

/**
 * Default claimer addresses
 */
export const DEFAULT_CLAIMER_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.optimism]: '0x2589ff8614f74704741EE3B51851b4Ae812F1A21',
  [NETWORK['optimism-goerli']]: '0x1a339190FCf8E7715d80FfDb32c97B9d065032b6'
}

/**
 * Liquidation router addresses
 */
export const LIQUIDATION_ROUTER_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.optimism]: '0xf4cFa53dF258d78AAd153AC11C644703651983f5',
  [NETWORK['optimism-goerli']]: '0x31dCb9Ff8AfA40e1F8683eDBD31184aaAA97a835'
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
    '0x2b311e07bce542a73bb4887d0f503f0b6ea70711': {
      chainId: NETWORK.optimism,
      address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1'
    },
    /* USDC */
    '0x880027cc134a07ddc9e5c7e7659a11ecfd828705': {
      chainId: NETWORK.optimism,
      address: USDC_TOKEN_ADDRESSES[NETWORK.optimism]
    },
    /* GUSD */
    '0x206acf3bbec50972880e665ee7d03342a2ff9f5d': {
      chainId: NETWORK.mainnet,
      address: '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd'
    },
    /* WBTC */
    '0x8778da5ed4b586960094d43c5a3a52da3a4ae613': {
      chainId: NETWORK.optimism,
      address: '0x68f180fcce6836688e9084f035309e29bf0a2095'
    },
    /* WETH */
    '0xe62ac4184f04f0ba3c99dd2fe931cdc4d0489ac9': {
      chainId: NETWORK.optimism,
      address: '0x4200000000000000000000000000000000000006'
    },
    /* POOL */
    '0x722701e470b556571a7a3586adafa2e866cfd1a1': {
      chainId: NETWORK.mainnet,
      address: POOL_TOKEN_ADDRESSES[NETWORK.mainnet].toLowerCase() as Address
    }
  }
}

/**
 * Vault list schema
 */
export const VAULT_LIST_SCHEMA: JSONSchemaType<VaultList> = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    version: {
      type: 'object',
      properties: {
        major: { type: 'integer' },
        minor: { type: 'integer' },
        patch: { type: 'integer' }
      },
      required: ['major', 'minor', 'patch']
    },
    timestamp: { type: 'string' },
    tokens: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          chainId: { type: 'integer' },
          address: { type: 'string' },
          name: { type: 'string', nullable: true },
          decimals: { type: 'integer', nullable: true },
          symbol: { type: 'string', nullable: true },
          extensions: {
            type: 'object',
            properties: {
              underlyingAsset: {
                type: 'object',
                properties: {
                  address: { type: 'string', nullable: true },
                  symbol: { type: 'string', nullable: true },
                  name: { type: 'string', nullable: true },
                  logoURI: { type: 'string', nullable: true }
                },
                nullable: true
              }
            },
            nullable: true
          },
          tags: { type: 'array', items: { type: 'string' }, nullable: true },
          logoURI: { type: 'string', nullable: true },
          yieldSourceURI: { type: 'string', nullable: true }
        },
        required: ['chainId', 'address']
      }
    },
    keywords: { type: 'array', items: { type: 'string' }, nullable: true },
    tags: { type: 'object', properties: {}, required: [], nullable: true },
    logoURI: { type: 'string', nullable: true }
  },
  required: ['name', 'version', 'timestamp', 'tokens']
}

/**
 * Max uint256 value
 */
export const MAX_UINT_256 = 2n ** 256n - 1n

/**
 * Null Address
 */
export const NULL_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

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
