import { COINGECKO_PLATFORMS, KV_PRICE_KEYS, SUPPORTED_NETWORKS } from './constants'
import { ChainTokenPrices, SupportedCoingeckoNetwork } from './types'
import { updateHandler } from './updateHandler'
import { getCoingeckoTokenPrices } from './utils'

export const fetchTokenPrices = async (
  event: FetchEvent,
  chainId: (typeof SUPPORTED_NETWORKS)[number],
  tokens?: `0x${string}`[]
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
      if (tokenSet.size > 0 && chainId in COINGECKO_PLATFORMS) {
        const missingTokenPrices = await getCoingeckoTokenPrices(
          chainId as SupportedCoingeckoNetwork,
          Array.from(tokenSet)
        )
        for (const address in missingTokenPrices) {
          const tokenPrice = missingTokenPrices[address]['eth']
          if (tokenPrice !== undefined) {
            chainTokenPrices[address.toLowerCase() as `0x${string}`] = tokenPrice
          }
        }
        await updateHandler(event, { [chainId]: chainTokenPrices })
      }

      return JSON.stringify(chainTokenPrices)
    } else {
      return allCachedChainTokenPrices
    }
  } catch (e) {
    return null
  }
}
