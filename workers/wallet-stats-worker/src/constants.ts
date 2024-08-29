import { arbitrum, base, Chain, mainnet, optimism } from 'viem/chains'
import { Network } from './types'

export const NETWORKS = [mainnet.id, optimism.id, base.id, arbitrum.id]

export const VIEM_CHAINS: Record<Network, Chain> = {
  [mainnet.id]: mainnet,
  [optimism.id]: optimism,
  [base.id]: base,
  [arbitrum.id]: arbitrum
}

export const RPC_URLS: Record<Network, string> = {
  [mainnet.id]: MAINNET_RPC_URL,
  [optimism.id]: OPTIMISM_RPC_URL,
  [base.id]: BASE_RPC_URL,
  [arbitrum.id]: ARBITRUM_RPC_URL
}

export const TOKEN_PRICES_API_URL = 'https://token-prices.api.cabana.fi'
export const USE_TOKEN_PRICES_BOUND_WORKER = true

export const DEFAULT_HEADERS = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, HEAD, OPTIONS',
    'Access-Control-Request-Method': '*',
    'Vary': 'Accept-Encoding, Origin',
    'Access-Control-Allow-Headers': '*',
    'Content-Type': 'application/json;charset=UTF-8'
  }
}

export const KV_KEYS = {
  walletIds: 'walletIds'
}

export const VAULT_ABI = [
  {
    inputs: [
      { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
      { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'assets', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'shares', type: 'uint256' }
    ],
    name: 'Deposit',
    type: 'event'
  },
  {
    inputs: [],
    name: 'asset',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const
