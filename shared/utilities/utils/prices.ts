import { Address, isAddress } from 'viem'
import {
  TOKEN_PRICE_API_SUPPORTED_NETWORKS,
  TOKEN_PRICE_REDIRECTS,
  TOKEN_PRICES_API_URL
} from '../constants'
import { lower } from './addresses'

/**
 * Returns token prices in ETH from the CloudFlare API
 * @param chainId chain ID where the token addresses provided are from
 * @param tokenAddresses token addresses to query prices for
 * @returns
 */
export const getTokenPrices = async (
  chainId: number,
  tokenAddresses?: string[],
  options?: { requestHeaders?: Record<string, string> }
): Promise<{ [address: Address]: number }> => {
  try {
    if (TOKEN_PRICE_API_SUPPORTED_NETWORKS.includes(chainId)) {
      const url = new URL(`${TOKEN_PRICES_API_URL}/${chainId}`)
      const tokenPrices: { [address: Address]: number } = {}

      if (!!tokenAddresses && tokenAddresses.length > 0) {
        url.searchParams.set('tokens', tokenAddresses.join(','))
      }

      const response = await fetch(
        url.toString(),
        !!options?.requestHeaders ? { headers: options.requestHeaders } : undefined
      )
      const rawTokenPrices: { [address: Address]: { date: string; price: number }[] } =
        await response.json()
      Object.keys(rawTokenPrices).forEach((address) => {
        const tokenPrice = rawTokenPrices[address as Address][0]?.price
        if (tokenPrice !== undefined) {
          tokenPrices[address as Address] = tokenPrice
        }
      })

      if (
        !!tokenAddresses &&
        tokenAddresses.length > 0 &&
        Object.keys(tokenPrices).length < tokenAddresses.length
      ) {
        const redirectedTokenPrices = await getRedirectedTokenPrices(chainId, tokenAddresses)
        Object.entries(redirectedTokenPrices).forEach(([address, price]) => {
          if (!tokenPrices[address as Address]) {
            tokenPrices[address as Address] = price
          }
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
  tokenAddress: string,
  options?: { requestHeaders?: Record<string, string> }
): Promise<{ [address: Address]: { date: string; price: number }[] }> => {
  if (!isAddress(tokenAddress)) return {}

  try {
    if (TOKEN_PRICE_API_SUPPORTED_NETWORKS.includes(chainId)) {
      const url = new URL(`${TOKEN_PRICES_API_URL}/${chainId}/${tokenAddress}`)

      const response = await fetch(
        url.toString(),
        !!options?.requestHeaders ? { headers: options.requestHeaders } : undefined
      )
      const tokenPrices: { [address: Address]: { date: string; price: number }[] } =
        await response.json()

      const priceEntries = Object.values(tokenPrices)[0]
      if (!!priceEntries?.length) {
        return tokenPrices
      } else {
        return await getRedirectedHistoricalTokenPrices(chainId, tokenAddress)
      }
    } else {
      const lowercaseTokenAddress = lower(tokenAddress)
      const mostRecentTokenPrice = (await getTokenPrices(chainId, [tokenAddress]))[
        lowercaseTokenAddress
      ]
      const dateNow = new Date().toISOString().split('T')[0]

      return { [lowercaseTokenAddress]: [{ date: dateNow, price: mostRecentTokenPrice }] }
    }
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
  const redirectedTokens: { [chainId: number]: { [address: string]: string } } = {}

  tokenAddresses.forEach((_address) => {
    const address = lower(_address)
    const redirect = TOKEN_PRICE_REDIRECTS[chainId]?.[address]

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

/**
 * Returns redirected historical token prices for a token without accurate pricing data on their original network
 * @param chainId chain ID where the token addresses provided is from
 * @param tokenAddress token address to query redirected historical prices for (if necessary)
 * @returns
 */
const getRedirectedHistoricalTokenPrices = async (chainId: number, tokenAddress: string) => {
  const redirect = TOKEN_PRICE_REDIRECTS[chainId]?.[lower(tokenAddress)]

  if (!!redirect) {
    const redirectedHistoricalTokenPrices: {
      [address: Address]: { date: string; price: number }[]
    } = {}

    const newHistoricalTokenPrices = await getHistoricalTokenPrices(
      redirect.chainId,
      redirect.address
    )

    const priceEntries = Object.values(newHistoricalTokenPrices)[0]
    if (!!priceEntries?.length) {
      redirectedHistoricalTokenPrices[tokenAddress as Address] = priceEntries
    }

    return redirectedHistoricalTokenPrices
  } else {
    return {}
  }
}
