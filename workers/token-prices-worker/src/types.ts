import { SUPPORTED_NETWORKS } from './constants'

export interface TokenPrices {
  [chainId: number]: ChainTokenPrices
}

export interface ChainTokenPrices {
  [address: `0x${string}`]: number
}

export type SUPPORTED_NETWORK = (typeof SUPPORTED_NETWORKS)[number]

export interface CovalentPricingApiResponse {
  contract_address: `0x${string}`
  quote_currency: string
  prices: { date: string; price: number | null }[]
}
