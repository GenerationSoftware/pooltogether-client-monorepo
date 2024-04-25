import { Address } from 'viem'
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

// TODO: need to include logic to query lp token prices as well
const getAllChainTokenPrices = async () => {
  const allChainTokenPrices: { [chainId: number]: ChainTokenPrices } = {}

  await Promise.allSettled(
    SUPPORTED_NETWORKS.map((chainId) =>
      (async () => {
        const { value: cachedTokenAddresses } = await TOKEN_ADDRESSES.getWithMetadata(
          NETWORK_KEYS[chainId]
        )
        if (!!cachedTokenAddresses) {
          const tokenAddresses = cachedTokenAddresses.split(',') as Address[]
          // TODO: check for least recent token price and use `from` appropriately to only query needed data
          const tokenPrices = await getCovalentTokenPrices(chainId, tokenAddresses)
          for (const strAddress in tokenPrices) {
            const address = strAddress as Address
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
