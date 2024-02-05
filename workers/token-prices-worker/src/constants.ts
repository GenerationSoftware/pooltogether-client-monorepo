import { SUPPORTED_NETWORK } from './types'

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

export const SUPPORTED_NETWORKS = [1, 10, 137, 42161] as const

export const NETWORK_KEYS = {
  1: 'mainnet',
  10: 'optimism',
  137: 'polygon',
  42161: 'arbitrum'
} as const satisfies Record<SUPPORTED_NETWORK, string>

export const COVALENT_API_URL = 'https://api.covalenthq.com/v1'

export const START_DATE = '2023-08-31'
