import { Address, isAddress } from 'viem'
import { DEFAULT_HEADERS, SUPPORTED_NETWORKS } from './constants'
import { fetchAllTokenPrices } from './fetchAllTokenPrices'
import { fetchTokenPrices } from './fetchTokenPrices'
import { SUPPORTED_NETWORK } from './types'

export const handleRequest = async (event: FetchEvent): Promise<Response> => {
  try {
    const url = new URL(event.request.url)

    // Route: "/"
    if (url.pathname === '/') {
      const tokenPrices = await fetchAllTokenPrices()
      if (!!tokenPrices) {
        return new Response(tokenPrices, {
          ...DEFAULT_HEADERS,
          status: 200
        })
      } else {
        return new Response(tokenPrices, {
          ...DEFAULT_HEADERS,
          status: 500
        })
      }
    }

    // Route: "/{chainId}*"
    const chainId = parseInt(url.pathname.split('/')[1])
    if (!!chainId && (SUPPORTED_NETWORKS as readonly number[]).includes(chainId)) {
      // Route: "/{chainId}/{tokenAddress}"
      const singleToken = url.pathname.split('/')[2]
      if (!!singleToken && isAddress(singleToken)) {
        const tokenPrices = await fetchTokenPrices(
          event,
          chainId as SUPPORTED_NETWORK,
          [singleToken],
          { includeHistory: true }
        )
        if (!!tokenPrices) {
          return new Response(tokenPrices, {
            ...DEFAULT_HEADERS,
            status: 200
          })
        } else {
          return new Response(tokenPrices, {
            ...DEFAULT_HEADERS,
            status: 500
          })
        }
      }

      // Route: "/{chainId}?tokens={tokenAddresses}"
      const urlTokens = url.searchParams.get('tokens')
      if (!!urlTokens) {
        const tokens = urlTokens
          .split(',')
          .filter((address) => isAddress(address))
          .map((address) => address.toLowerCase()) as Address[]
        const tokenPrices =
          tokens.length > 0
            ? await fetchTokenPrices(event, chainId as SUPPORTED_NETWORK, tokens)
            : undefined
        if (!!tokenPrices) {
          return new Response(tokenPrices, {
            ...DEFAULT_HEADERS,
            status: 200
          })
        } else {
          return new Response(tokenPrices, {
            ...DEFAULT_HEADERS,
            status: 500
          })
        }
      } else {
        // Route: "/{chainId}"
        const tokenPrices = await fetchTokenPrices(event, chainId as SUPPORTED_NETWORK)
        if (!!tokenPrices) {
          return new Response(tokenPrices, {
            ...DEFAULT_HEADERS,
            status: 200
          })
        } else {
          return new Response(tokenPrices, {
            ...DEFAULT_HEADERS,
            status: 500
          })
        }
      }
    }

    return new Response(JSON.stringify({ message: `Invalid request.` }), {
      ...DEFAULT_HEADERS,
      status: 400
    })
  } catch (e) {
    console.error(e)

    const errorResponse = new Response('Error', {
      ...DEFAULT_HEADERS,
      status: 500
    })
    errorResponse.headers.set('Content-Type', 'text/plain')

    return errorResponse
  }
}
