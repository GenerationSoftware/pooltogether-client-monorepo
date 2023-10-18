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
  // [NETWORK.optimism]: '',
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
    address: '0xAFCeDe71e62684De45D423712FeEeBB83863DfDE',
    sequenceOffset: 1_697_371_200,
    sequencePeriod: 21_600
  }
}

/**
 * RNG relay addresses
 */
export const RNG_RELAY_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.mainnet]: '0xF4c47dacFda99bE38793181af9Fd1A2Ec7576bBF',
  [NETWORK.optimism]: '0xF4c47dacFda99bE38793181af9Fd1A2Ec7576bBF',
  [NETWORK.goerli]: '0xe34deF1114d7Bb0298636A2026D9Cf3D67F19FBd',
  [NETWORK['optimism-goerli']]: '0x5C9c04FC5D6431A2101b8395E13B565762980F97'
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
  [NETWORK['optimism-goerli']]: '0x0B09590E2dE22A629B45258812C0B25904689B5a'
}

/**
 * Vault factory addresses
 */
export const VAULT_FACTORY_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.optimism]: '0xA469deff6D52C9571d13513e3cd7d94496082d81',
  [NETWORK['optimism-goerli']]: '0x53B7922eeCe8afE5bdaA170E20dc32c6deDA5277'
}

/**
 * Liquidation pair factory addresses
 */
export const LIQUIDATION_PAIR_FACTORY_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.optimism]: '0xa1697E8F6b11D0E2F00d9dC8a5AEae2b2665650a',
  [NETWORK['optimism-goerli']]: '0x21b8f4c7E92a37B893BE39b4Ec447459fa5031C6'
}

/**
 * Default claimer addresses
 */
export const DEFAULT_CLAIMER_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.optimism]: '0x2589ff8614f74704741EE3B51851b4Ae812F1A21',
  [NETWORK['optimism-goerli']]: '0x0294997B1100d6e35fd3868c6544c881096a23E1'
}

/**
 * Liquidation router addresses
 */
export const LIQUIDATION_ROUTER_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.optimism]: '0xf4cFa53dF258d78AAd153AC11C644703651983f5',
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
