import { CoingeckoExchangeRates } from '@shared/types'
import { SUPPORTED_NETWORKS } from './constants'
import { COINGECKO_PLATFORMS } from './utilities'

export interface TokenPrices {
  simple: SimpleTokenPrices
  exchangeRates: CoingeckoExchangeRates
  [chainId: number]: ChainTokenPrices
}

export interface ChainTokenPrices {
  [address: `0x${string}`]: number
}

export interface SimpleTokenPrices {
  [id: string]: number
}

export type SupportedCoingeckoNetwork = keyof typeof COINGECKO_PLATFORMS &
  (typeof SUPPORTED_NETWORKS)[number]
