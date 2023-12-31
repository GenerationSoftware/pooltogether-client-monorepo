# Token Prices Cloudflare Worker

A Cloudflare worker to query and cache token prices.

### Endpoints

- `/` - Returns all cached token prices and exchange rates.
- `/<chainId>` - Returns all cached token prices for a given network.
- `/<chainId>?tokens=<addresses>` - Returns specific tokens' prices.
- `/<chainId>/<tokenAddress>` - Returns a single token's historical prices.

### Setup

Fill in `wrangler.toml` with your data, and run either `wrangler dev` or `wrangler deploy` to deploy locally or on your account.
