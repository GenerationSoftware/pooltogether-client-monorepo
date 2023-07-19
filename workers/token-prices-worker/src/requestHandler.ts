import { Address, isAddress } from 'viem'
import { DEFAULT_HEADERS, SUPPORTED_NETWORKS } from './constants'
import { fetchAllTokenPrices } from './fetchAllTokenPrices'
import { fetchExchangeRates } from './fetchExchangeRates'
import { fetchSimpleTokenPrices } from './fetchSimpleTokenPrices'
import { fetchTokenPrices } from './fetchTokenPrices'
import { updateTokenPrices } from './updateTokenPrices'

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

    if (url.pathname === '/simple') {
      const simpleTokenPrices = await fetchSimpleTokenPrices()
      if (!!simpleTokenPrices) {
        return new Response(simpleTokenPrices, {
          ...DEFAULT_HEADERS,
          status: 200
        })
      } else {
        return new Response(simpleTokenPrices, {
          ...DEFAULT_HEADERS,
          status: 500
        })
      }
    }

    if (url.pathname === '/exchangeRates') {
      const exchangeRates = await fetchExchangeRates()
      if (!!exchangeRates) {
        return new Response(exchangeRates, {
          ...DEFAULT_HEADERS,
          status: 200
        })
      } else {
        return new Response(exchangeRates, {
          ...DEFAULT_HEADERS,
          status: 500
        })
      }
    }

    if (url.pathname === '/update') {
      const updates = await updateTokenPrices(event)

      if (!!updates) {
        return new Response(JSON.stringify(updates), {
          ...DEFAULT_HEADERS,
          status: 200
        })
      } else {
        return new Response(JSON.stringify(updates), {
          ...DEFAULT_HEADERS,
          status: 500
        })
      }
    }

    const chainId = parseInt(url.pathname.split('/')[1])

    if (!!chainId && chainId in SUPPORTED_NETWORKS) {
      const urlTokens = url.searchParams.get('tokens')
      if (!!urlTokens) {
        const tokens = urlTokens
          .split(',')
          .filter((address) => isAddress(address))
          .map((address) => address.toLowerCase()) as Address[]
        const tokenPrices =
          tokens.length > 0 ? await fetchTokenPrices(event, chainId, tokens) : undefined
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
        const tokenPrices = await fetchTokenPrices(event, chainId)
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
