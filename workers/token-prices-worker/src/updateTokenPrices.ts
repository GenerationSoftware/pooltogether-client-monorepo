import { Address } from 'viem'
import { NETWORK_KEYS, SUPPORTED_NETWORKS } from './constants'
import { ChainTokenPrices } from './types'
import { updateHandler } from './updateHandler'
import { calcLpTokenPrices, getLpTokenInfo, getOnchainTokenPrices } from './utils'

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
          const tokenAddresses = new Set(cachedTokenAddresses.split(',') as Address[])
          // TODO: should not query known lp tokens
          const tokenPrices = await getOnchainTokenPrices(chainId, Array.from(tokenAddresses))

          for (const strAddress in tokenPrices) {
            const address = strAddress as Address
            if (allChainTokenPrices[chainId] === undefined) {
              allChainTokenPrices[chainId] = {}
            }
            allChainTokenPrices[chainId][address] = tokenPrices[address]
            tokenAddresses.delete(address)
          }

          if (tokenAddresses.size > 0) {
            const lpTokenInfo = await getLpTokenInfo(chainId, Array.from(tokenAddresses))
            const lpTokenPrices = calcLpTokenPrices(lpTokenInfo, tokenPrices)

            for (const strAddress in lpTokenPrices) {
              const address = strAddress as Address
              if (allChainTokenPrices[chainId] === undefined) {
                allChainTokenPrices[chainId] = {}
              }
              allChainTokenPrices[chainId][address] = lpTokenPrices[address]
            }
          }
        }
      })()
    )
  )

  return allChainTokenPrices
}
