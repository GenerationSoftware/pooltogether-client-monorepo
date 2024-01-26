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

export const V5_NETWORKS = [NETWORK.optimism] as const satisfies NETWORK[]

export const V4_NETWORKS = [
  NETWORK.mainnet,
  NETWORK.polygon,
  NETWORK.optimism,
  NETWORK.avalanche
] as const satisfies NETWORK[]

export const RPC_URLS: Record<(typeof V5_NETWORKS)[number] | (typeof V4_NETWORKS)[number], string> =
  {
    [NETWORK.mainnet]: MAINNET_RPC_URL,
    [NETWORK.polygon]: POLYGON_RPC_URL,
    [NETWORK.optimism]: OPTIMISM_RPC_URL,
    [NETWORK.avalanche]: AVALANCHE_RPC_URL
  }

export const V4_TICKETS: Record<
  (typeof V4_NETWORKS)[number],
  { address: Lowercase<`0x${string}`>; decimals: number }
> = {
  [NETWORK.mainnet]: { address: '0xdd4d117723c257cee402285d3acf218e9a8236e1', decimals: 6 },
  [NETWORK.polygon]: { address: '0x6a304dfdb9f808741244b6bfee65ca7b3b3a6076', decimals: 6 },
  [NETWORK.optimism]: { address: '0x62bb4fc73094c83b5e952c2180b23fa7054954c4', decimals: 6 },
  [NETWORK.avalanche]: { address: '0xb27f379c050f6ed0973a01667458af6ecebc1d90', decimals: 6 }
}

export const V5_SUBGRAPH_API_URLS: Record<(typeof V5_NETWORKS)[number], string> = {
  [NETWORK.optimism]: 'https://api.studio.thegraph.com/query/50959/pt-v5-op/version/latest'
}

export const V4_TWAB_SUBGRAPH_API_URLS: Record<(typeof V4_NETWORKS)[number], string> = {
  [NETWORK.mainnet]: 'https://api.thegraph.com/subgraphs/name/pooltogether/mainnet-twab',
  [NETWORK.polygon]: 'https://api.thegraph.com/subgraphs/name/pooltogether/polygon-twab',
  [NETWORK.optimism]: 'https://api.thegraph.com/subgraphs/name/pooltogether/optimism-twab',
  [NETWORK.avalanche]: 'https://api.thegraph.com/subgraphs/name/pooltogether/avalanche-twab'
}

export const V4_PRIZE_SUBGRAPH_API_URLS: Record<(typeof V4_NETWORKS)[number], string> = {
  [NETWORK.mainnet]:
    'https://api.thegraph.com/subgraphs/name/pooltogether/mainnet-v4-prizes-claimed',
  [NETWORK.polygon]:
    'https://api.thegraph.com/subgraphs/name/pooltogether/polygon-v4-prizes-claimed',
  [NETWORK.optimism]:
    'https://api.thegraph.com/subgraphs/name/pooltogether/optimism-v4-prizes-claimed',
  [NETWORK.avalanche]:
    'https://api.thegraph.com/subgraphs/name/pooltogether/avalanche-v4-prizes-claimed'
}

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

export const V4_TICKET_ABI = [
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const
