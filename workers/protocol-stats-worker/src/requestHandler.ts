import { DEFAULT_HEADERS } from './constants'
import { fetchStats } from './fetchStats'
import { updateStats } from './updateStats'

export const handleRequest = async (event: FetchEvent): Promise<Response> => {
  try {
    const url = new URL(event.request.url)

    if (url.pathname === '/') {
      const stats = await fetchStats()
      if (!!stats) {
        return new Response(stats, {
          ...DEFAULT_HEADERS,
          status: 200
        })
      } else {
        return new Response(stats, {
          ...DEFAULT_HEADERS,
          status: 500
        })
      }
    }

    if (url.pathname.startsWith('/update')) {
      const updates = await updateStats(event)

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
