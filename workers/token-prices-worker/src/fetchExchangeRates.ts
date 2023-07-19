import { KV_PRICE_KEYS } from './constants'

export const fetchExchangeRates = async () => {
  try {
    const { value: cachedExchangeRates } = await TOKEN_PRICES.getWithMetadata(
      KV_PRICE_KEYS.exchangeRates
    )
    return cachedExchangeRates
  } catch (e) {
    return null
  }
}
