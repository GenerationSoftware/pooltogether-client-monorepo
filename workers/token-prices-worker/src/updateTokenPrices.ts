import { NETWORK_KEYS, SUPPORTED_NETWORKS } from './constants'
import { ChainTokenPrices } from './types'
import { updateHandler } from './updateHandler'
import { getCovalentTokenPrices } from './utils'

export const updateTokenPrices = async (event: FetchEvent | ScheduledEvent) => {
  try {
    const allChainTokenPrices = await getAllChainTokenPrices()
    return updateHandler(event, allChainTokenPrices)
  } catch (e) {
    return undefined
  }
}

const getAllChainTokenPrices = async () => {
  const allChainTokenPrices: { [chainId: number]: ChainTokenPrices } = {}

  await Promise.allSettled(
    SUPPORTED_NETWORKS.map((chainId) =>
      (async () => {
        const { value: cachedTokenAddresses } = await TOKEN_ADDRESSES.getWithMetadata(
          NETWORK_KEYS[chainId]
        )
        if (!!cachedTokenAddresses) {
          const tokenAddresses = cachedTokenAddresses.split(',') as `0x${string}`[]
          // TODO: check for least recent token price and use `from` appropriately to only query needed data
          const tokenPrices = await getCovalentTokenPrices(chainId, tokenAddresses)
          for (const strAddress in tokenPrices) {
            const address = strAddress as `0x${string}`
            if (allChainTokenPrices[chainId] === undefined) {
              allChainTokenPrices[chainId] = {}
            }
            allChainTokenPrices[chainId][address] = tokenPrices[address]
          }
        }
      })()
    )
  )

  return allChainTokenPrices
}
