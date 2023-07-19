import { COINGECKO_API_URL, COINGECKO_NATIVE_TOKEN_IDS, COINGECKO_PLATFORMS } from './constants'
import { COINGECKO_PLATFORM, CoingeckoExchangeRates, CoingeckoTokenPrices } from './types'

export const isAddress = (address: string): address is `0x${string}` => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export const getCoingeckoSimpleTokenPrices = async (
  currencies?: string[]
): Promise<CoingeckoTokenPrices> => {
  try {
    const url = new URL(`${COINGECKO_API_URL}/simple/price`)
    const ids = Array.from(new Set(Object.values(COINGECKO_NATIVE_TOKEN_IDS)))
    url.searchParams.set('ids', ids.join(','))
    url.searchParams.set('vs_currencies', currencies?.join(',') ?? 'eth')
    const response = await fetch(url.toString())
    const tokenPrices = await response.json<CoingeckoTokenPrices>()
    return tokenPrices
  } catch (e) {
    console.error(e)
    return {}
  }
}

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
    const tokenPrices = await response.json<CoingeckoTokenPrices>()
    return tokenPrices
  } catch (e) {
    console.error(e)
    return {}
  }
}

export const getCoingeckoExchangeRates = async (): Promise<CoingeckoExchangeRates | undefined> => {
  try {
    const response = await fetch(`${COINGECKO_API_URL}/exchange_rates`)
    const jsonResponse = await response.json<{ rates: CoingeckoExchangeRates; status: string }>()
    const exchangeRates = jsonResponse.rates

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
