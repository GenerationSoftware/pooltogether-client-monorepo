import { Address } from 'viem'
import { TOKEN_PRICES_API_URL } from '../constants'

/**
 * Returns token prices in ETH from the CloudFlare API
 * @param chainId chain ID where the token addresses provided are from
 * @param tokenAddresses token addresses to query prices for
 * @returns
 */
export const getTokenPrices = async (
  chainId: number,
  tokenAddresses?: string[]
): Promise<{ [address: Address]: number }> => {
  try {
    const url = new URL(`${TOKEN_PRICES_API_URL}/${chainId}`)
    if (!!tokenAddresses && tokenAddresses.length > 0) {
      url.searchParams.set('tokens', tokenAddresses.join(','))
    }
    const response = await fetch(url.toString())
    const tokenPrices: { [address: Address]: number } = await response.json()
    return tokenPrices
  } catch (e) {
    console.error(e)
    return {}
  }
}
