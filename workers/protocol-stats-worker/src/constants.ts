import type { Chain } from 'viem'
import { arbitrum, base, gnosis, mainnet, optimism, scroll } from 'viem/chains'

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
  scroll = 534352,
  gnosis = 100
}

export const VIEM_CHAINS: Record<NETWORK, Chain> = {
  [NETWORK.mainnet]: mainnet,
  [NETWORK.optimism]: optimism,
  [NETWORK.arbitrum]: arbitrum,
  [NETWORK.base]: base,
  [NETWORK.scroll]: scroll,
  [NETWORK.gnosis]: gnosis
}

export const V5_NETWORKS = [
  NETWORK.mainnet,
  NETWORK.optimism,
  NETWORK.base,
  NETWORK.arbitrum,
  NETWORK.scroll,
  NETWORK.gnosis
] as const satisfies NETWORK[]

export const RPC_URLS: Record<(typeof V5_NETWORKS)[number], string> = {
  [NETWORK.mainnet]: MAINNET_RPC_URL,
  [NETWORK.optimism]: OPTIMISM_RPC_URL,
  [NETWORK.base]: BASE_RPC_URL,
  [NETWORK.arbitrum]: ARBITRUM_RPC_URL,
  [NETWORK.scroll]: SCROLL_RPC_URL,
  [NETWORK.gnosis]: GNOSIS_RPC_URL
}

export const V5_SUBGRAPH_API_URLS: Record<(typeof V5_NETWORKS)[number], `https://${string}`> = {
  [NETWORK.mainnet]:
    'https://api.goldsky.com/api/public/project_cm3xb1e8iup5601yx9mt5caat/subgraphs/pt-v5-ethereum/v0.0.2/gn',
  [NETWORK.optimism]:
    'https://api.goldsky.com/api/public/project_cm3xb1e8iup5601yx9mt5caat/subgraphs/pt-v5-optimism/v0.0.4/gn',
  [NETWORK.base]:
    'https://api.goldsky.com/api/public/project_cm3xb1e8iup5601yx9mt5caat/subgraphs/pt-v5-base/v0.0.1/gn',
  [NETWORK.arbitrum]:
    'https://api.goldsky.com/api/public/project_cm3xb1e8iup5601yx9mt5caat/subgraphs/pt-v5-arbitrum-one/v0.0.1/gn',
  [NETWORK.scroll]:
    'https://api.goldsky.com/api/public/project_cm3xb1e8iup5601yx9mt5caat/subgraphs/pt-v5-scroll/v0.0.1/gn',
  [NETWORK.gnosis]:
    'https://api.goldsky.com/api/public/project_cm3xb1e8iup5601yx9mt5caat/subgraphs/pt-v5-gnosis/v0.0.1/gn'
}

export const V5_PRIZE_TOKEN_PRICE_REF: Record<
  (typeof V5_NETWORKS)[number],
  { chainId: NETWORK; address: Lowercase<`0x${string}`>; decimals: number }
> = {
  [NETWORK.mainnet]: {
    chainId: NETWORK.mainnet,
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: 18
  },
  [NETWORK.optimism]: {
    chainId: NETWORK.mainnet,
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: 18
  },
  [NETWORK.base]: {
    chainId: NETWORK.mainnet,
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: 18
  },
  [NETWORK.arbitrum]: {
    chainId: NETWORK.mainnet,
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: 18
  },
  [NETWORK.scroll]: {
    chainId: NETWORK.mainnet,
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: 18
  },
  [NETWORK.gnosis]: {
    chainId: NETWORK.gnosis,
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    decimals: 18
  }
}

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
