import { DEFAULT_HEADERS } from './constants'
import { updateHandler } from './updateHandler'
import { getAllWalletData, getRequestBody, getWalletData, isValidDeposit } from './utils'

export const handleRequest = async (event: FetchEvent): Promise<Response> => {
  try {
    const url = new URL(event.request.url)

    if (url.pathname === '/addDeposit' && event.request.method === 'POST') {
      const deposit = await getRequestBody(event.request)

      // TODO: get txhash, chainId and walletId
      // TODO: check that events includes deposit or depositwithpermit (or some underlying event)
      // TODO: get user address from recipient there
      // TODO: check that the tx occurred in the last X mins or 1 hour
      // TODO: what if rpc didnt pick up the tx yet? maybe wait a few seconds and retry

      if (isValidDeposit(deposit)) {
        await updateHandler(event, deposit)

        return new Response(JSON.stringify({ message: 'Added deposit.' }), {
          ...DEFAULT_HEADERS,
          status: 200
        })
      }
    }

    if (url.pathname === '/wallets') {
      const allWalletData = await getAllWalletData()

      if (!!allWalletData) {
        return new Response(JSON.stringify(allWalletData), {
          ...DEFAULT_HEADERS,
          status: 200
        })
      } else {
        return new Response(null, {
          ...DEFAULT_HEADERS,
          status: 500
        })
      }
    }

    if (url.pathname.startsWith('/wallet')) {
      const walletId = url.pathname.split('/')[2]

      if (!!walletId) {
        const walletData = await getWalletData(walletId)

        if (!!walletData) {
          return new Response(JSON.stringify(walletData), {
            ...DEFAULT_HEADERS,
            status: 200
          })
        } else {
          return new Response(null, {
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
