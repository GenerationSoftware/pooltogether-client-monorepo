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

export const SUPPORTED_NETWORKS = [1, 10, 11155111] as const

export const KV_PRICE_KEYS = {
  simple: 'simple',
  exchangeRates: 'exchangeRates',
  1: 'mainnet',
  10: 'optimism',
  11155111: 'sepolia'
} as const

export const KV_ADDRESS_KEYS = {
  1: 'mainnet',
  10: 'optimism'
} as const

export const COINGECKO_PLATFORMS = {
  1: 'ethereum',
  56: 'binance-smart-chain',
  100: 'xdai',
  137: 'polygon-pos',
  10: 'optimistic-ethereum',
  43114: 'avalanche',
  42220: 'celo',
  42161: 'arbitrum-one'
} as const

export const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3'

export const COINGECKO_NATIVE_TOKEN_IDS = {
  1: 'ethereum',
  5: 'ethereum',
  11155111: 'ethereum',
  56: 'binancecoin',
  97: 'binancecoin',
  100: 'xdai',
  137: 'matic-network',
  80001: 'matic-network',
  10: 'ethereum',
  420: 'ethereum',
  43114: 'avalanche-2',
  43113: 'avalanche-2',
  42220: 'celo',
  44787: 'celo',
  42161: 'ethereum',
  421613: 'ethereum'
} as const
