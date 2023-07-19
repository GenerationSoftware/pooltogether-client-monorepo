import { Address } from 'viem'
import { KV_PRICE_KEYS, SUPPORTED_NETWORKS } from './constants'
import { ChainTokenPrices } from './types'

export const fetchTokenPrices = async (
  chainId: (typeof SUPPORTED_NETWORKS)[number],
  tokens?: Address[]
) => {
  try {
    const { value: allCachedChainTokenPrices } = await TOKEN_PRICES.getWithMetadata(
      KV_PRICE_KEYS[chainId]
    )

    if (!!tokens) {
      const chainTokenPrices: ChainTokenPrices = {}
      const tokenSet = new Set(tokens)

      // Getting prices from existing cache
      const parsedAllCachedChainTokenPrices = !!allCachedChainTokenPrices
        ? (JSON.parse(allCachedChainTokenPrices) as ChainTokenPrices)
        : undefined
      if (!!parsedAllCachedChainTokenPrices) {
        tokenSet.forEach((address) => {
          const cachedPrice = parsedAllCachedChainTokenPrices[address]
          if (cachedPrice !== undefined) {
            chainTokenPrices[address] = cachedPrice
            tokenSet.delete(address)
          }
        })
      }

      // Querying missing tokens' prices
      if (tokenSet.size > 0) {
        // TODO: query coingecko for missing token prices
        // TODO: update cache
        // TODO: add token addresses to address KV if successful
      }

      return JSON.stringify(chainTokenPrices)
    } else {
      return allCachedChainTokenPrices
    }
  } catch (e) {
    return null
  }
}
