import { KV_ADDRESS_KEYS, KV_PRICE_KEYS, SUPPORTED_NETWORKS } from './constants'
import { ChainTokenPrices } from './types'
import { updateHandler } from './updateHandler'
import { getCovalentTokenPrices } from './utils'

export const fetchTokenPrices = async (
  event: FetchEvent,
  chainId: (typeof SUPPORTED_NETWORKS)[number],
  tokens?: `0x${string}`[],
  options?: {
    includeHistory?: boolean
  }
) => {
  try {
    const { value: allCachedChainTokenPrices } = await TOKEN_PRICES.getWithMetadata(
      KV_PRICE_KEYS[chainId]
    )
    const parsedAllCachedChainTokenPrices = !!allCachedChainTokenPrices
      ? (JSON.parse(allCachedChainTokenPrices) as ChainTokenPrices)
      : undefined

    if (!!tokens) {
      const chainTokenPrices: ChainTokenPrices = {}
      const tokenSet = new Set(tokens)

      // Getting prices from existing cache
      if (!!parsedAllCachedChainTokenPrices) {
        tokenSet.forEach((address) => {
          const cachedPrices = parsedAllCachedChainTokenPrices[address]
          if (!!cachedPrices) {
            if (options?.includeHistory) {
              chainTokenPrices[address] = cachedPrices
            } else {
              chainTokenPrices[address] = [cachedPrices[0]]
            }
            tokenSet.delete(address)
          }
        })
      }

      // Querying missing tokens' prices
      if (tokenSet.size > 0 && chainId in KV_ADDRESS_KEYS) {
        const missingTokenPrices = await getCovalentTokenPrices(chainId, Array.from(tokenSet))
        for (const strAddress in missingTokenPrices) {
          const address = strAddress as `0x${string}`
          chainTokenPrices[address] = options?.includeHistory
            ? missingTokenPrices[address]
            : [missingTokenPrices[address][0]]
        }
        await updateHandler(event, { [chainId]: missingTokenPrices })
      }

      return JSON.stringify(chainTokenPrices)
    } else {
      if (!!parsedAllCachedChainTokenPrices) {
        Object.keys(parsedAllCachedChainTokenPrices).forEach((strAddress) => {
          const address = strAddress as `0x${string}`
          parsedAllCachedChainTokenPrices[address].splice(1)
        })
        return JSON.stringify(parsedAllCachedChainTokenPrices)
      } else {
        return JSON.stringify({})
      }
    }
  } catch (e) {
    return null
  }
}
