# Token Prices Cloudflare Worker

A Cloudflare worker to query and cache token prices.

### Endpoints

- `/` - Returns all cached token prices and exchange rates.
- `/simple` - Returns all cached simple token prices by CoinGecko IDs.
- `/exchangeRates` - Returns cached token/fiat exchange rates.
- `/<chainId>` - Returns all cached token prices for a given network.
- `/<chainId>?tokens=<addresses>` - Returns specific tokens' prices and cache them if not previously cached.
- `/update` - Updates token prices manually.

### Setup

Fill in `wrangler.toml` with your data, and run either `wrangler dev` or `wrangler deploy` to deploy locally or on your account.
