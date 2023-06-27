import { CoingeckoExchangeRates, CoingeckoTokenData, CoingeckoTokenPrices } from '@shared/types'
import {
  COINGECKO_API_URL,
  COINGECKO_NATIVE_TOKEN_IDS,
  COINGECKO_PLATFORM,
  COINGECKO_PLATFORMS
} from '../constants'

/**
 * Returns all native token prices from CoinGecko
 *
 * NOTE: `ids` can be found through `COINGECKO_NATIVE_TOKEN_IDS`
 * @param currencies optional currency override (default is ['eth'])
 * @returns
 */
export const getCoingeckoSimpleTokenPrices = async (
  currencies?: string[]
): Promise<CoingeckoTokenPrices> => {
  try {
    const url = new URL(`${COINGECKO_API_URL}/simple/price`)
    const ids = Array.from(new Set(Object.values(COINGECKO_NATIVE_TOKEN_IDS)))
    url.searchParams.set('ids', ids.join(','))
    url.searchParams.set('vs_currencies', currencies?.join(',') ?? 'eth')
    const response = await fetch(url.toString())
    const tokenPrices: CoingeckoTokenPrices = await response.json()
    return tokenPrices
  } catch (e) {
    console.error(e)
    return {}
  }
}

/**
 * Returns token prices from CoinGecko from provided token addresses on a given chain
 *
 * NOTE: Contract addresses returned are all lowercase
 * @param chainId chain ID where the token addresses provided are from
 * @param tokenAddresses token addresses to query prices for
 * @param currencies optional currency override (default is ['eth'])
 * @returns
 */
export const getCoingeckoTokenPrices = async (
  chainId: COINGECKO_PLATFORM,
  tokenAddresses: string[],
  currencies?: string[]
): Promise<CoingeckoTokenPrices> => {
  try {
    const platform = COINGECKO_PLATFORMS[chainId]
    const url = new URL(`${COINGECKO_API_URL}/simple/token_price/${platform}`)
    url.searchParams.set('contract_addresses', tokenAddresses.join(','))
    url.searchParams.set('vs_currencies', currencies?.join(',') ?? 'eth')
    const response = await fetch(url.toString())
    const tokenPrices: CoingeckoTokenPrices = await response.json()
    return tokenPrices
  } catch (e) {
    console.error(e)
    return {}
  }
}

/**
 * Returns a token's price from an object of many CoinGecko token prices
 * @param chainId chain ID for the token requested
 * @param tokenAddress the token's address
 * @param tokenPrices all token prices returned from CoinGecko
 * @param currency optional currency override (default is 'eth')
 * @returns
 */
export const getTokenPriceFromObject = (
  chainId: number,
  tokenAddress: string,
  tokenPrices: { [chainId: number]: CoingeckoTokenPrices } | undefined,
  currency?: string
) => {
  if (!!tokenPrices) {
    return tokenPrices[chainId]?.[tokenAddress.toLowerCase()]?.[currency ?? 'eth'] ?? 0
  } else {
    return 0
  }
}

/**
 * Returns token data from CoinGecko
 * @param chainId chain ID where the token address provided is from
 * @param tokenAddress token address to query token data for
 * @returns
 */
export const getCoingeckoTokenData = async (
  chainId: COINGECKO_PLATFORM,
  tokenAddress: string
): Promise<CoingeckoTokenData | undefined> => {
  try {
    const platform = COINGECKO_PLATFORMS[chainId]
    const response = await fetch(`${COINGECKO_API_URL}/coins/${platform}/contract/${tokenAddress}`)
    const tokenData: CoingeckoTokenData = await response.json()
    return tokenData
  } catch (e) {
    console.error(e)
    return undefined
  }
}

/**
 * Returns exchange rates from CoinGecko
 * @returns
 */
export const getCoingeckoExchangeRates = async (): Promise<CoingeckoExchangeRates | undefined> => {
  try {
    const response = await fetch(`${COINGECKO_API_URL}/exchange_rates`)
    const jsonResponse = await response.json()
    const exchangeRates: CoingeckoExchangeRates = jsonResponse.rates

    if (!!exchangeRates) {
      return exchangeRates
    } else {
      console.error(jsonResponse.status)
      return undefined
    }
  } catch (e) {
    console.error(e)
    return undefined
  }
}
