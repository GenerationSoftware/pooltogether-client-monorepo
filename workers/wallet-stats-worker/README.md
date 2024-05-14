# Wallet Stats Cloudflare Worker

A Cloudflare worker to keep track of some basic user stats regarding what wallet software is used for deposits, etc.

### Endpoints

- `/addDeposit` - Adds an entry for a deposit (POST request).
- `/wallets` - Returns basic stats for all wallets.
- `/wallet/<walletId>` - Returns stats for a specific wallet provider.

### Setup

Fill in `wrangler.toml` with your data, and run either `wrangler dev` or `wrangler deploy` to deploy locally or on your account.
