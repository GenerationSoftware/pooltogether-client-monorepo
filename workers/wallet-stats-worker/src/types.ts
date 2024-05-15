import { Address } from 'viem'
import { NETWORKS } from './constants'

export type Network = (typeof NETWORKS)[number]

export interface AddDepositData {
  chainId: Network
  txHash: `0x${string}`
  walletId: string
}

export interface Deposit {
  user: Address
  vault: Address
  walletId: string
  chainId: Network
  txHash: `0x${string}`
  ethValue?: number
}

export interface TokenPricesApiResponse {
  [address: Address]: [{ date: string; price: number }]
}
