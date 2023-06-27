# PoolTogether Protocol Stats Cloudflare Worker

A Cloudflare worker to query some basic stats about the protocol.

### Endpoints

- `/` - Returns the latest cached protocol stats.
- `/update` - Updates KV store manually.

### Setup

Fill in `wrangler.toml` with your data, and run either `wrangler dev` or `wrangler deploy` to deploy locally or on your account.
