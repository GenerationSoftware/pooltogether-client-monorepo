import { Address } from 'viem'
import { NETWORK_KEYS, SUPPORTED_NETWORKS } from './constants'
import { ChainTokenPrices, SUPPORTED_NETWORK, TokenPrices } from './types'
import { sortTokenPricesByDate } from './utils'

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
        TOKEN_PRICES.getWithMetadata(NETWORK_KEYS[chainId]).then((data) => {
          const cachedChainTokenPrices: ChainTokenPrices = !!data.value
            ? JSON.parse(data.value)
            : {}

          const newChainTokenPrices: ChainTokenPrices = { ...cachedChainTokenPrices }
          Object.keys(chainTokenPrices).forEach((strAddress) => {
            const address = strAddress as Address
            if (newChainTokenPrices[address] === undefined) {
              newChainTokenPrices[address] = sortTokenPricesByDate(chainTokenPrices[address])
            } else {
              chainTokenPrices[address].forEach((item) => {
                const itemIndex = newChainTokenPrices[address].findIndex(
                  (i) => i.date === item.date
                )
                if (itemIndex === -1) {
                  newChainTokenPrices[address].push(item)
                } else {
                  newChainTokenPrices[address][itemIndex].price = item.price
                }
              })
              newChainTokenPrices[address] = sortTokenPricesByDate(newChainTokenPrices[address])
            }
          })

          event.waitUntil(
            TOKEN_PRICES.put(NETWORK_KEYS[chainId], JSON.stringify(newChainTokenPrices), {
              metadata: { lastUpdated: new Date(Date.now()).toUTCString() }
            })
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
  event.waitUntil(
    TOKEN_ADDRESSES.getWithMetadata(NETWORK_KEYS[chainId]).then((data) => {
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
          TOKEN_ADDRESSES.put(NETWORK_KEYS[chainId], Array.from(tokenAddresses).join(','), {
            metadata: { lastUpdated: new Date(Date.now()).toUTCString() }
          })
        )
      }
    })
  )
}
