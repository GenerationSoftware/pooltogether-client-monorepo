import { KV_PRICE_KEYS, SUPPORTED_NETWORKS } from './constants'
import { CoingeckoExchangeRates, SimpleTokenPrices, TokenPrices } from './types'

export const fetchAllTokenPrices = async () => {
  try {
    const { value: cachedSimpleTokenPrices } = await TOKEN_PRICES.getWithMetadata(
      KV_PRICE_KEYS.simple
    )
    const { value: cachedExchangeRates } = await TOKEN_PRICES.getWithMetadata(
      KV_PRICE_KEYS.exchangeRates
    )

    const simple = !!cachedSimpleTokenPrices
      ? (JSON.parse(cachedSimpleTokenPrices) as SimpleTokenPrices)
      : undefined
    const exchangeRates = !!cachedExchangeRates
      ? (JSON.parse(cachedExchangeRates) as CoingeckoExchangeRates)
      : undefined

    const allTokenPrices: Partial<TokenPrices> = { simple, exchangeRates }

    await Promise.allSettled(
      SUPPORTED_NETWORKS.map((chainId) => async () => {
        const { value: chainTokenPrices } = await TOKEN_PRICES.getWithMetadata(
          KV_PRICE_KEYS[chainId]
        )
        if (!!chainTokenPrices) {
          allTokenPrices[chainId] = JSON.parse(chainTokenPrices)
        }
      })
    )

    return JSON.stringify(allTokenPrices)
  } catch (e) {
    return null
  }
}
