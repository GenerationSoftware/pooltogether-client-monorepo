import { Chain } from 'viem'
import { arbitrum, base, mainnet, optimism, polygon } from 'viem/chains'
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

export enum NETWORK {
  mainnet = 1,
  optimism = 10,
  polygon = 137,
  arbitrum = 42161,
  base = 8453
}

export const SUPPORTED_NETWORKS = [
  NETWORK.mainnet,
  NETWORK.optimism,
  NETWORK.polygon,
  NETWORK.arbitrum,
  NETWORK.base
] as const

export const NETWORK_KEYS = {
  1: 'mainnet',
  10: 'optimism',
  137: 'polygon',
  42161: 'arbitrum',
  8453: 'base'
} as const satisfies Record<NETWORK, string>

export const VIEM_CHAINS: Record<NETWORK, Chain> = {
  [NETWORK.mainnet]: mainnet,
  [NETWORK.optimism]: optimism,
  [NETWORK.polygon]: polygon,
  [NETWORK.arbitrum]: arbitrum,
  [NETWORK.base]: base
}

export const RPC_URLS: Record<SUPPORTED_NETWORK, string> = {
  [NETWORK.mainnet]: MAINNET_RPC_URL,
  [NETWORK.optimism]: OPTIMISM_RPC_URL,
  [NETWORK.polygon]: POLYGON_RPC_URL,
  [NETWORK.arbitrum]: ARBITRUM_RPC_URL,
  [NETWORK.base]: BASE_RPC_URL
}

export const COVALENT_API_URL = 'https://api.covalenthq.com/v1'

export const START_DATE = '2023-08-31'
