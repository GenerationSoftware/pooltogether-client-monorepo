import { NETWORK } from '@shared/utilities'

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

export const SUPPORTED_NETWORKS = [NETWORK.mainnet, NETWORK.optimism, NETWORK.sepolia] as const

export const KV_PRICE_KEYS = {
  simple: 'simple',
  exchangeRates: 'exchangeRates',
  [NETWORK.mainnet]: 'mainnet',
  [NETWORK.optimism]: 'optimism',
  [NETWORK.sepolia]: 'sepolia'
} as const

export const KV_ADDRESS_KEYS = {
  [NETWORK.mainnet]: 'mainnet',
  [NETWORK.optimism]: 'optimism'
} as const
