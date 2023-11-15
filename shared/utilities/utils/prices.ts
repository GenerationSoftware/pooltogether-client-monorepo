import { Address, isAddress } from 'viem'
import {
  TOKEN_PRICE_API_SUPPORTED_NETWORKS,
  TOKEN_PRICE_REDIRECTS,
  TOKEN_PRICES_API_URL
} from '../constants'

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
    if (chainId in TOKEN_PRICE_API_SUPPORTED_NETWORKS) {
      const url = new URL(`${TOKEN_PRICES_API_URL}/${chainId}`)
      const tokenPrices: { [address: Address]: number } = {}

      if (!!tokenAddresses && tokenAddresses.length > 0) {
        url.searchParams.set('tokens', tokenAddresses.join(','))
      }

      const response = await fetch(url.toString())
      const rawTokenPrices: { [address: Address]: { date: string; price: number }[] } =
        await response.json()
      Object.keys(rawTokenPrices).forEach((key) => {
        const address = key as Address
        const tokenPrice = rawTokenPrices[address][0]?.price
        if (tokenPrice !== undefined) {
          tokenPrices[address] = tokenPrice
        }
      })

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
    } else if (!!tokenAddresses && tokenAddresses.length > 0) {
      return await getRedirectedTokenPrices(chainId, tokenAddresses)
    } else {
      return {}
    }
  } catch (e) {
    console.error(e)
    return {}
  }
}

/**
 * Returns a token's historical prices in ETH from the CloudFlare API
 * @param chainId chain ID where the token addresses provided is from
 * @param tokenAddress token address to query historical prices for
 * @returns
 */
export const getHistoricalTokenPrices = async (
  chainId: number,
  tokenAddress: string
): Promise<{ [address: Address]: { date: string; price: number }[] }> => {
  if (!isAddress(tokenAddress)) return {}

  try {
    const url = new URL(`${TOKEN_PRICES_API_URL}/${chainId}/${tokenAddress}`)

    const response = await fetch(url.toString())
    const tokenPrices: { [address: Address]: { date: string; price: number }[] } =
      await response.json()

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
      redirectedTokens[redirect.chainId][redirect.address] = address.toLowerCase()
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
