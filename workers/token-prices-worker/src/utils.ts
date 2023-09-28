import { COVALENT_API_URL, START_DATE } from './constants'
import { ChainTokenPrices, CovalentPricingApiResponse, SUPPORTED_NETWORK } from './types'

export const isAddress = (address: string): address is `0x${string}` => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

// TODO: should take in a var of the last date queried, in order to only query recent data
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
    url.searchParams.set('from', START_DATE)
    const response = await fetch(url.toString())
    const tokenPricesArray = (await response.json<{ data: CovalentPricingApiResponse[] }>()).data
    const tokenPrices: ChainTokenPrices = {}
    tokenPricesArray.forEach((token) => {
      const tokenAddress = token.contract_address.toLowerCase() as `0x${string}`
      token.prices.forEach((day) => {
        if (day.price !== null) {
          if (tokenPrices[tokenAddress] === undefined) {
            tokenPrices[tokenAddress] = []
          }
          tokenPrices[tokenAddress].push({ date: day.date, price: day.price })
        }
      })
    })
    return tokenPrices
  } catch (e) {
    console.error(e)
    return {}
  }
}

export const sortTokenPricesByDate = (
  tokenPrices: { date: string; price: number }[],
  direction: 'asc' | 'desc' = 'desc'
) => {
  return [...tokenPrices].sort((a, b) => {
    const aDate = new Date(a.date)
    const bDate = new Date(b.date)

    return direction === 'desc'
      ? bDate.getTime() - aDate.getTime()
      : aDate.getTime() - bDate.getTime()
  })
}
