import { COINGECKO_PLATFORMS, SUPPORTED_NETWORKS } from './constants'

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

export interface CoingeckoTokenPrices {
  [id: string]: {
    [currency: string]: number
  }
}

export interface CoingeckoExchangeRates {
  [id: string]: {
    name: string
    unit: string
    value: number
    type: 'crypto' | 'fiat' | 'commodity'
  }
}

export type COINGECKO_PLATFORM = keyof typeof COINGECKO_PLATFORMS

export type SupportedCoingeckoNetwork = keyof typeof COINGECKO_PLATFORMS &
  (typeof SUPPORTED_NETWORKS)[number]
