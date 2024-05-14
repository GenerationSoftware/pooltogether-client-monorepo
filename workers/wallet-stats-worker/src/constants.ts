import { Chain, optimism } from 'viem/chains'
import { Network } from './types'

export const NETWORKS = [optimism.id]

export const VIEM_CHAINS: Record<Network, Chain> = {
  [optimism.id]: optimism
}

export const RPC_URLS: Record<Network, string> = {
  [optimism.id]: OPTIMISM_RPC_URL
}

export const TOKEN_PRICES_API_URL = 'https://token-prices.api.cabana.fi'
export const USE_TOKEN_PRICES_BOUND_WORKER = true

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
  walletIds: 'walletIds'
}
