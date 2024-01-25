import { NETWORK, TOKEN_PRICES_API_URL } from './constants'
import { TokenPricesApiResponse } from './types'

export const getTokenPrices = async (chainId: NETWORK, tokenAddresses: `0x${string}`[]) => {
  try {
    const url = new URL(`${TOKEN_PRICES_API_URL}/${chainId}`)
    const tokenPrices: { [address: `0x${string}`]: number } = {}

    if (!!tokenAddresses.length) {
      url.searchParams.set('tokens', tokenAddresses.join(','))

      const response = await fetch(url.toString())
      const rawTokenPrices = await response.json<TokenPricesApiResponse>()

      Object.keys(rawTokenPrices).forEach((key) => {
        const address = key as Lowercase<`0x${string}`>
        tokenPrices[address] = rawTokenPrices[address][0]?.price
      })
    }

    return tokenPrices
  } catch (e) {
    console.error(e)
    return {}
  }
}
