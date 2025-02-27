import type { Address, Chain } from 'viem'
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

export const V5_PRIZE_POOLS: Record<
  (typeof V5_NETWORKS)[number],
  {
    address: Lowercase<Address>
    prizeToken: {
      address: Lowercase<Address>
      decimals: number
      priceRef?: { chainId: NETWORK; address: Lowercase<Address>; decimals: number }
    }
  }
> = {
  [NETWORK.mainnet]: {
    address: '0x7865d01da4c9ba2f69b7879e6d2483ab6b354d95',
    prizeToken: { address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', decimals: 18 }
  },
  [NETWORK.optimism]: {
    address: '0xf35fe10ffd0a9672d0095c435fd8767a7fe29b55',
    prizeToken: { address: '0x4200000000000000000000000000000000000006', decimals: 18 }
  },
  [NETWORK.base]: {
    address: '0x45b2010d8a4f08b53c9fa7544c51dfd9733732cb',
    prizeToken: { address: '0x4200000000000000000000000000000000000006', decimals: 18 }
  },
  [NETWORK.arbitrum]: {
    address: '0x52e7910c4c287848c8828e8b17b8371f4ebc5d42',
    prizeToken: { address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1', decimals: 18 }
  },
  [NETWORK.scroll]: {
    address: '0xa6ecd65c3eecdb59c2f74956ddf251ab5d899845',
    prizeToken: { address: '0x5300000000000000000000000000000000000004', decimals: 18 }
  },
  [NETWORK.gnosis]: {
    address: '0x0c08c2999e1a14569554eddbcda9da5e1918120f',
    prizeToken: { address: '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d', decimals: 18 }
  }
}

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

export const USD_PRICE_REF = {
  chainId: NETWORK.mainnet,
  address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
} as const satisfies { chainId: NETWORK; address: Lowercase<Address> }

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
