import { KV_PRICE_KEYS } from './constants'

export const fetchSimpleTokenPrices = async () => {
  try {
    const { value: cachedSimpleTokenPrices } = await TOKEN_PRICES.getWithMetadata(
      KV_PRICE_KEYS.simple
    )
    return cachedSimpleTokenPrices
  } catch (e) {
    return null
  }
}
