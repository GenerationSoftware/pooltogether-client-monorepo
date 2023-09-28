import { KV_PRICE_KEYS, SUPPORTED_NETWORKS } from './constants'
import { ChainTokenPrices, TokenPrices } from './types'

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
            const parsedChainTokenPrices = JSON.parse(chainTokenPrices) as ChainTokenPrices
            Object.keys(parsedChainTokenPrices).forEach((strAddress) => {
              const address = strAddress as `0x${string}`
              parsedChainTokenPrices[address].splice(1)
            })
            allTokenPrices[chainId] = parsedChainTokenPrices
          }
        })()
      )
    )

    return JSON.stringify(allTokenPrices)
  } catch (e) {
    return null
  }
}
