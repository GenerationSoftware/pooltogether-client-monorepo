import { Address } from 'viem'
import { NETWORK_KEYS } from './constants'
import { ChainTokenPrices, SUPPORTED_NETWORK } from './types'
import { updateHandler } from './updateHandler'
import { getCovalentTokenPrices, getLpTokenInfo } from './utils'

export const fetchTokenPrices = async (
  event: FetchEvent,
  chainId: SUPPORTED_NETWORK,
  tokens?: Address[],
  options?: {
    includeHistory?: boolean
  }
) => {
  try {
    const { value: allCachedChainTokenPrices } = await TOKEN_PRICES.getWithMetadata(
      NETWORK_KEYS[chainId]
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
      if (tokenSet.size > 0) {
        const missingTokenPrices = await getCovalentTokenPrices(chainId, Array.from(tokenSet))
        for (const strAddress in missingTokenPrices) {
          const address = strAddress as Address
          chainTokenPrices[address] = options?.includeHistory
            ? missingTokenPrices[address]
            : [missingTokenPrices[address][0]]
          tokenSet.delete(address)
        }
        await updateHandler(event, { [chainId]: missingTokenPrices })
      }

      // Querying missing LP token prices
      if (tokenSet.size > 0) {
        const lpTokenInfo = await getLpTokenInfo(chainId, Array.from(tokenSet))

        if (Object.keys(lpTokenInfo).length > 0) {
          const underlyingTokenAddresses = new Set<Address>()
          Object.values(lpTokenInfo).forEach((entry) => {
            underlyingTokenAddresses.add(entry.token0.address)
            underlyingTokenAddresses.add(entry.token1.address)
          })

          const strUnderlyingTokenPrices = await fetchTokenPrices(event, chainId, [
            ...underlyingTokenAddresses
          ])
          const underlyingTokenPrices = !!strUnderlyingTokenPrices
            ? (JSON.parse(strUnderlyingTokenPrices) as ChainTokenPrices)
            : {}

          // TODO: calculate lp token prices
          // TODO: append to chainTokenPrices
          // TODO: call updateHandler
        }
      }

      return JSON.stringify(chainTokenPrices)
    } else {
      if (!!parsedAllCachedChainTokenPrices) {
        Object.keys(parsedAllCachedChainTokenPrices).forEach((strAddress) => {
          const address = strAddress as Address
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
