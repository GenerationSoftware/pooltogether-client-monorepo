import { handleRequest } from './requestHandler'

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event))
})
