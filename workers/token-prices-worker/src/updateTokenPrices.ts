import { Address } from 'viem'
import { COINGECKO_PLATFORMS, KV_ADDRESS_KEYS, SUPPORTED_NETWORKS } from './constants'
import { ChainTokenPrices, SimpleTokenPrices, SupportedCoingeckoNetwork } from './types'
import { updateHandler } from './updateHandler'
import {
  getCoingeckoExchangeRates,
  getCoingeckoSimpleTokenPrices,
  getCoingeckoTokenPrices
} from './utils'

export const updateTokenPrices = async (event: FetchEvent | ScheduledEvent) => {
  try {
    const simpleTokenPrices = await getCoingeckoSimpleTokenPrices()
    const simple: SimpleTokenPrices = Object.assign(
      {},
      ...Object.keys(simpleTokenPrices)
        .filter((id) => simpleTokenPrices[id].eth !== undefined)
        .map((id) => ({ [id]: simpleTokenPrices[id].eth }))
    )

    const exchangeRates = await getCoingeckoExchangeRates()

    const allChainTokenPrices = await getAllChainTokenPrices()

    return updateHandler(event, { simple, exchangeRates, ...allChainTokenPrices })
  } catch (e) {
    return undefined
  }
}

const getAllChainTokenPrices = async () => {
  const allChainTokenPrices: { [chainId: number]: ChainTokenPrices } = {}

  await Promise.allSettled(
    SUPPORTED_NETWORKS.map((chainId) => async () => {
      if (chainId in COINGECKO_PLATFORMS) {
        const { value: cachedTokenAddresses } = await TOKEN_ADDRESSES.getWithMetadata(
          KV_ADDRESS_KEYS[chainId as SupportedCoingeckoNetwork]
        )
        if (!!cachedTokenAddresses) {
          const tokenAddresses = cachedTokenAddresses.split(',') as Address[]
          const tokenPrices = await getCoingeckoTokenPrices(
            chainId as SupportedCoingeckoNetwork,
            tokenAddresses
          )
          for (const address in tokenPrices) {
            const tokenPrice = tokenPrices[address]['eth']
            if (tokenPrice !== undefined) {
              if (allChainTokenPrices[chainId] === undefined) {
                allChainTokenPrices[chainId] = {}
              }
              allChainTokenPrices[chainId][address.toLowerCase() as Address] = tokenPrice
            }
          }
        }
      }
    })
  )

  return allChainTokenPrices
}
