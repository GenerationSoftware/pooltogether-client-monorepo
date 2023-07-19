import { handleRequest } from './requestHandler'
import { handleScheduled } from './scheduledHandler'

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event))
})

addEventListener('scheduled', (event) => {
  event.waitUntil(handleScheduled(event))
})
