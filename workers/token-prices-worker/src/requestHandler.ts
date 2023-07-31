import { DEFAULT_HEADERS, SUPPORTED_NETWORKS } from './constants'
import { fetchAllTokenPrices } from './fetchAllTokenPrices'
import { fetchTokenPrices } from './fetchTokenPrices'
import { SUPPORTED_NETWORK } from './types'
import { isAddress } from './utils'

export const handleRequest = async (event: FetchEvent): Promise<Response> => {
  try {
    const url = new URL(event.request.url)

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

    const chainId = parseInt(url.pathname.split('/')[1])

    if (!!chainId && (SUPPORTED_NETWORKS as readonly number[]).includes(chainId)) {
      const urlTokens = url.searchParams.get('tokens')
      if (!!urlTokens) {
        const tokens = urlTokens
          .split(',')
          .filter((address) => isAddress(address))
          .map((address) => address.toLowerCase()) as `0x${string}`[]
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
