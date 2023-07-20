import { COVALENT_API_URL } from './constants'
import { ChainTokenPrices, CovalentPricingApiResponse, SUPPORTED_NETWORK } from './types'

export const isAddress = (address: string): address is `0x${string}` => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export const getCovalentTokenPrices = async (
  chainId: SUPPORTED_NETWORK,
  tokenAddresses: `0x${string}`[]
) => {
  try {
    const strTokenAddresses = tokenAddresses.join(',')
    const url = new URL(
      `${COVALENT_API_URL}/pricing/historical_by_addresses_v2/${chainId}/eth/${strTokenAddresses}/`
    )
    url.searchParams.set('key', COVALENT_API_KEY)
    url.searchParams.set('from', getDateXDaysAgo(3))
    const response = await fetch(url.toString())
    const tokenPricesArray = (await response.json<{ data: CovalentPricingApiResponse[] }>()).data
    const tokenPrices: ChainTokenPrices = {}
    tokenPricesArray.forEach((token) => {
      let tokenPrice: number | null = null
      token.prices.forEach((day) => {
        if (tokenPrice === null) {
          tokenPrice = day.price
        }
      })
      if (tokenPrice !== null) {
        tokenPrices[token.contract_address.toLowerCase() as `0x${string}`] = tokenPrice
      }
    })
    return tokenPrices
  } catch (e) {
    console.error(e)
    return {}
  }
}

const getDateXDaysAgo = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString().split('T')[0]
}
