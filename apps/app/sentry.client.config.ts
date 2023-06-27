// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || 'development',

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Filter data from being sent to Sentry
  beforeSend(event) {
    // Modify or drop the event here
    if (event.user) {
      delete event.user.ip_address
    }
    return event
  },

  // Simple heuristic to filter out events that should not be sent to Sentry
  ignoreTransactions: ['User denied account authorization', 'solana', 'UserRejectedRequestError']
})
