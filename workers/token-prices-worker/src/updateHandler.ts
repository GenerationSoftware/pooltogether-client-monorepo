import { KV_ADDRESS_KEYS, KV_PRICE_KEYS, SUPPORTED_NETWORKS } from './constants'
import { ChainTokenPrices, SUPPORTED_NETWORK, TokenPrices } from './types'

export const updateHandler = async (
  event: FetchEvent | ScheduledEvent,
  tokenPrices?: TokenPrices
) => {
  if (!tokenPrices || Object.keys(tokenPrices).length === 0) {
    return { message: 'No token prices updated.', tokenPrices }
  }

  SUPPORTED_NETWORKS.forEach((chainId) => {
    const chainTokenPrices = tokenPrices[chainId]
    if (!!chainTokenPrices) {
      event.waitUntil(
        TOKEN_PRICES.getWithMetadata(KV_PRICE_KEYS[chainId]).then((data) => {
          const cachedChainTokenPrices: ChainTokenPrices = !!data.value
            ? JSON.parse(data.value)
            : {}

          event.waitUntil(
            TOKEN_PRICES.put(
              KV_PRICE_KEYS[chainId],
              JSON.stringify({ ...cachedChainTokenPrices, ...chainTokenPrices }),
              {
                metadata: { lastUpdated: new Date(Date.now()).toUTCString() }
              }
            )
          )
        })
      )

      updateCachedAddresses(event, chainId, chainTokenPrices)
    }
  })

  return tokenPrices
}

const updateCachedAddresses = async (
  event: FetchEvent | ScheduledEvent,
  chainId: SUPPORTED_NETWORK,
  chainTokenPrices: ChainTokenPrices
) => {
  if (chainId in KV_ADDRESS_KEYS) {
    event.waitUntil(
      TOKEN_ADDRESSES.getWithMetadata(
        KV_ADDRESS_KEYS[chainId as keyof typeof KV_ADDRESS_KEYS]
      ).then((data) => {
        const tokenAddresses = new Set(data.value?.split(',') ?? [])
        let needsUpdate = false

        for (const address in chainTokenPrices) {
          if (!tokenAddresses.has(address)) {
            tokenAddresses.add(address)
            needsUpdate = true
          }
        }

        if (needsUpdate) {
          event.waitUntil(
            TOKEN_ADDRESSES.put(
              KV_ADDRESS_KEYS[chainId as keyof typeof KV_ADDRESS_KEYS],
              Array.from(tokenAddresses).join(','),
              {
                metadata: { lastUpdated: new Date(Date.now()).toUTCString() }
              }
            )
          )
        }
      })
    )
  }
}
