import { DEFAULT_HEADERS } from './constants'
import { updateHandler } from './updateHandler'
import {
  getAllWalletData,
  getDeposit,
  getRequestBody,
  getWalletData,
  isValidDepositData
} from './utils'

export const handleRequest = async (event: FetchEvent): Promise<Response> => {
  try {
    const url = new URL(event.request.url)

    if (url.pathname === '/addDeposit' && event.request.method === 'POST') {
      const depositData = await getRequestBody(event.request)

      if (isValidDepositData(depositData)) {
        const deposit = await getDeposit(depositData)

        if (!!deposit) {
          await updateHandler(event, deposit)

          return new Response(JSON.stringify(deposit), {
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
