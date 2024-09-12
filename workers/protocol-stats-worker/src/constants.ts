import type { Chain } from 'viem'
import { arbitrum, base, mainnet, optimism, scroll } from 'viem/chains'

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
  optimism = 10,
  arbitrum = 42161,
  base = 8453,
  scroll = 534352
}

export const VIEM_CHAINS: Record<NETWORK, Chain> = {
  [NETWORK.mainnet]: mainnet,
  [NETWORK.optimism]: optimism,
  [NETWORK.arbitrum]: arbitrum,
  [NETWORK.base]: base,
  [NETWORK.scroll]: scroll
}

export const V5_NETWORKS = [
  NETWORK.mainnet,
  NETWORK.optimism,
  NETWORK.base,
  NETWORK.arbitrum,
  NETWORK.scroll
] as const satisfies NETWORK[]

export const RPC_URLS: Record<(typeof V5_NETWORKS)[number], string> = {
  [NETWORK.mainnet]: MAINNET_RPC_URL,
  [NETWORK.optimism]: OPTIMISM_RPC_URL,
  [NETWORK.base]: BASE_RPC_URL,
  [NETWORK.arbitrum]: ARBITRUM_RPC_URL,
  [NETWORK.scroll]: SCROLL_RPC_URL
}

export const V5_SUBGRAPH_API_URLS: Record<(typeof V5_NETWORKS)[number], `https://${string}`> = {
  [NETWORK.mainnet]: 'https://api.studio.thegraph.com/query/63100/pt-v5-ethereum/version/latest',
  [NETWORK.optimism]: 'https://api.studio.thegraph.com/query/63100/pt-v5-optimism/version/latest',
  [NETWORK.base]: 'https://api.studio.thegraph.com/query/41211/pt-v5-base/version/latest',
  [NETWORK.arbitrum]: 'https://api.studio.thegraph.com/query/63100/pt-v5-arbitrum/version/latest',
  [NETWORK.scroll]: 'https://api.studio.thegraph.com/query/63100/pt-v5-scroll/version/latest'
}

export const V5_PRIZE_TOKEN_PRICE_REF = {
  chainId: NETWORK.mainnet,
  address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  decimals: 18
} as const satisfies { chainId: NETWORK; address: Lowercase<`0x${string}`>; decimals: number }

export const USD_PRICE_REF = {
  chainId: NETWORK.mainnet,
  address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
} as const satisfies { chainId: NETWORK; address: Lowercase<`0x${string}`> }

export const TOKEN_PRICES_API_URL = 'https://token-prices.api.cabana.fi'
export const USE_TOKEN_PRICES_BOUND_WORKER = true

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
