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
  1: 'mainnet',
  10: 'optimism',
  11155111: 'sepolia'
} as const

export const KV_ADDRESS_KEYS = {
  1: 'mainnet',
  10: 'optimism'
} as const

export const COVALENT_API_URL = 'https://api.covalenthq.com/v1'
