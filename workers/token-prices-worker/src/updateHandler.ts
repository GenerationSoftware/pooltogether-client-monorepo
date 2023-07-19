import { KV_ADDRESS_KEYS, KV_PRICE_KEYS, SUPPORTED_NETWORKS } from './constants'
import { ChainTokenPrices, TokenPrices } from './types'

export const updateHandler = async (
  event: FetchEvent | ScheduledEvent,
  tokenPrices?: Partial<TokenPrices>
) => {
  if (!tokenPrices) {
    return { message: 'No token prices updated.', tokenPrices }
  }

  if (!!tokenPrices.simple) {
    event.waitUntil(
      TOKEN_PRICES.put(KV_PRICE_KEYS.simple, JSON.stringify(tokenPrices.simple), {
        metadata: { lastUpdated: new Date(Date.now()).toUTCString() }
      })
    )
  }

  if (!!tokenPrices.exchangeRates) {
    event.waitUntil(
      TOKEN_PRICES.put(KV_PRICE_KEYS.exchangeRates, JSON.stringify(tokenPrices.exchangeRates), {
        metadata: { lastUpdated: new Date(Date.now()).toUTCString() }
      })
    )
  }

  SUPPORTED_NETWORKS.forEach((chainId) => {
    const chainTokenPrices = tokenPrices[chainId]
    if (!!chainTokenPrices) {
      event.waitUntil(
        TOKEN_PRICES.put(KV_PRICE_KEYS[chainId], JSON.stringify(chainTokenPrices), {
          metadata: { lastUpdated: new Date(Date.now()).toUTCString() }
        })
      )
      updateCachedAddresses(event, chainId, chainTokenPrices)
    }
  })

  return tokenPrices
}

const updateCachedAddresses = async (
  event: FetchEvent | ScheduledEvent,
  chainId: (typeof SUPPORTED_NETWORKS)[number],
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
              JSON.stringify(Array.from(tokenAddresses)),
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
