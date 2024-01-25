import type { Chain } from 'viem'
import { arbitrum, avalanche, base, celo, mainnet, optimism, polygon } from 'viem/chains'

export const DEFAULT_HEADERS = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    'Access-Control-Request-Method': '*',
    'Vary': 'Accept-Encoding, Origin',
    'Access-Control-Allow-Headers': '*',
    'Content-Type': 'application/json;charset=UTF-8'
  }
}

export const KV_KEYS = {
  v3_stats: 'v3_stats',
  v4_stats: 'v4_stats',
  v5_stats: 'v5_stats'
}

export enum NETWORK {
  mainnet = 1,
  polygon = 137,
  optimism = 10,
  avalanche = 43114,
  celo = 42220,
  arbitrum = 42161,
  base = 8453
}

export const VIEM_CHAINS: Record<NETWORK, Chain> = {
  [NETWORK.mainnet]: mainnet,
  [NETWORK.polygon]: polygon,
  [NETWORK.optimism]: optimism,
  [NETWORK.avalanche]: avalanche,
  [NETWORK.celo]: celo,
  [NETWORK.arbitrum]: arbitrum,
  [NETWORK.base]: base
}

export const RPC_URLS: { [chainId in NETWORK]?: string } = {
  [NETWORK.optimism]: OPTIMISM_RPC_URL
}

export const V5_SUBGRAPH_API_URLS = {
  [NETWORK.optimism]: 'https://api.studio.thegraph.com/query/50959/pt-v5-op/version/latest'
} as const satisfies { [chainId: number]: string }

export const V5_PRIZE_TOKEN_PRICE_REF = {
  chainId: NETWORK.mainnet,
  address: '0x0cec1a9154ff802e7934fc916ed7ca50bde6844e',
  decimals: 18
} as const satisfies { chainId: NETWORK; address: Lowercase<`0x${string}`>; decimals: number }

export const USD_PRICE_REF = {
  chainId: NETWORK.mainnet,
  address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
} as const satisfies { chainId: NETWORK; address: Lowercase<`0x${string}`> }

export const TOKEN_PRICES_API_URL = 'https://token-prices.api.cabana.fi'

export const V5_VAULT_ABI = [
  {
    inputs: [],
    name: 'asset',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'totalAssets',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const
