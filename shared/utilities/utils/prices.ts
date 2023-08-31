import { Address } from 'viem'
import { TOKEN_PRICE_REDIRECTS, TOKEN_PRICES_API_URL } from '../constants'

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

    if (
      !!tokenAddresses &&
      tokenAddresses.length > 0 &&
      Object.keys(tokenPrices).length < tokenAddresses.length
    ) {
      const redirectedTokenPrices = await getRedirectedTokenPrices(chainId, tokenAddresses)
      Object.entries(redirectedTokenPrices).forEach(([address, price]) => {
        tokenPrices[address as Address] = price
      })
    }

    return tokenPrices
  } catch (e) {
    console.error(e)
    return {}
  }
}

/**
 * Returns redirected token prices for tokens without accurate pricing data on their original network
 * @param chainId chain ID where the token addresses provided are from
 * @param tokenAddresses token addresses to query redirected prices for (if necessary)
 * @returns
 */
const getRedirectedTokenPrices = async (chainId: number, tokenAddresses: string[]) => {
  const redirectedTokenPrices: { [address: string]: number } = {}
  const redirectedTokens: {
    [chainId: number]: { [address: string]: string }
  } = {}

  tokenAddresses.forEach((address) => {
    const redirect = TOKEN_PRICE_REDIRECTS[chainId]?.[address.toLowerCase()]
    if (!!redirect) {
      if (redirectedTokens[redirect.chainId] === undefined) {
        redirectedTokens[redirect.chainId] = {}
      }
      redirectedTokens[redirect.chainId][redirect.address] = address
    }
  })

  const newTokenPrices = await Promise.all(
    Object.keys(redirectedTokens).map(async (key) => {
      const newChainId = parseInt(key)
      const newTokenAddresses = Object.keys(redirectedTokens[newChainId])
      return {
        chainId: newChainId,
        tokenPrices: await getTokenPrices(newChainId, newTokenAddresses)
      }
    })
  )

  newTokenPrices.forEach((chainNewTokenPrices) => {
    Object.entries(chainNewTokenPrices.tokenPrices).forEach(([address, price]) => {
      const originalTokenAddress = redirectedTokens[chainNewTokenPrices.chainId]?.[address]
      redirectedTokenPrices[originalTokenAddress] = price
    })
  })

  return redirectedTokenPrices
}
