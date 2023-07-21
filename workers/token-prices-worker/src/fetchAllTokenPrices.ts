import { KV_PRICE_KEYS, SUPPORTED_NETWORKS } from './constants'
import { TokenPrices } from './types'

export const fetchAllTokenPrices = async () => {
  try {
    const allTokenPrices: Partial<TokenPrices> = {}

    await Promise.allSettled(
      SUPPORTED_NETWORKS.map((chainId) =>
        (async () => {
          const { value: chainTokenPrices } = await TOKEN_PRICES.getWithMetadata(
            KV_PRICE_KEYS[chainId]
          )
          if (!!chainTokenPrices) {
            allTokenPrices[chainId] = JSON.parse(chainTokenPrices)
          }
        })()
      )
    )

    return JSON.stringify(allTokenPrices)
  } catch (e) {
    return null
  }
}
