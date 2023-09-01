<p align="center">
  <a href="https://github.com/pooltogether/pooltogether--brand-assets">
    <img src="https://github.com/pooltogether/pooltogether--brand-assets/blob/977e03604c49c63314450b5d432fe57d34747c66/logo/pooltogether-logo--purple-gradient.png?raw=true" alt="PoolTogether Brand" style="max-width:100%;" width="200">
  </a>
</p>

<br />

# 💻 &nbsp; PoolTogether Hyperstucture Client Library

![ts](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)
![viem](https://img.shields.io/static/v1?label&logo=v&logoColor=white&message=viem&color=gray)
![npm](https://img.shields.io/npm/v/@generationsoftware/hyperstructure-client-js)
![license](https://img.shields.io/npm/l/@generationsoftware/hyperstructure-client-js)

[Client Monorepo](https://github.com/GenerationSoftware/pooltogether-client-monorepo) | [Documentation](https://dev.pooltogether.com/) | [Prize Pool Contract](https://github.com/pooltogether/v5-prize-pool) | [Vault Contract](https://github.com/pooltogether/v5-vault)

# 🏆 &nbsp; Overview

A JS client library for wrapping [Viem](https://viem.sh/) contracts and providing simple, unopinionated interfaces for interacting with the protocol.

The library exports the following classes to interact with different aspects of the protocol, including reading and writing onchain data:

- `PrizePool`
- `Vault`
- `Vaults`

Useful utilities and types are also exported from internal packages. See the [utilities](https://github.com/GenerationSoftware/pooltogether-client-monorepo/tree/main/packages/utilities) or [types](https://github.com/GenerationSoftware/pooltogether-client-monorepo/tree/main/packages/types) packages for more info.

## 💾 &nbsp; Installation

This library is available as an NPM package:

```sh
npm install @generationsoftware/hyperstructure-client-js
```

or

```sh
pnpm install @generationsoftware/hyperstructure-client-js
```

or

```sh
yarn add @generationsoftware/hyperstructure-client-js
```

## 🏎️ &nbsp; Quickstart

### PrizePool

A `PrizePool` is an interface to interact with a [prize pool contract](https://github.com/pooltogether/v5-prize-pool), which is responsible for aggregating contributions from all vaults and awarding prizes.

To create an instance of a `PrizePool`, you will need:

- The chain ID of the network the prize pool contract is deployed to.
- The prize pool's address.
- A [Viem public client](https://viem.sh/docs/clients/public.html).

If you'd like to use any write methods, you must also provide a [Viem wallet client](https://viem.sh/docs/clients/wallet.html).

```ts
import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { createPublicClient, createWalletClient } from 'viem'

// Viem clients
const publicClient = createPublicClient({ ... })
const walletClient = createWalletClient({ ... })

// Optional parameters
const options = {
  walletClient: walletClient,
  prizeTokenAddress: '0x456...',
  drawPeriodInSeconds: 86_400,
  tierShares: 100
}

// Initializing PrizePool
const prizePool = new PrizePool(1, '0x123...', publicClient, options)
```

### Vault

A `Vault` is an interface to interact with a [vault contract](https://github.com/pooltogether/v5-vault), which is an [ERC 4626](https://eips.ethereum.org/EIPS/eip-4626) wrapper around any yield source, responsible for deposits and withdrawals.

To create an instance of a `Vault`, you will need:

- The chain ID of the network the vault contract is deployed to.
- The vault's address.
- A [Viem public client](https://viem.sh/docs/clients/public.html).

If you'd like to use any write methods, you must also provide a [Viem wallet client](https://viem.sh/docs/clients/wallet.html).

```ts
import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { createPublicClient, createWalletClient } from 'viem'

// Viem clients
const publicClient = createPublicClient({ ... })
const walletClient = createWalletClient({ ... })

// Optional parameters
const options = {
  walletClient: walletClient,
  decimals: 18,
  tokenAddress: '0x456...',
  name: 'Really Cool Vault',
  logoURI: 'https://...',
  tokenLogoURI: 'https://...'
}

// Initializing Vault
const vault = new Vault(1, '0x123...', publicClient, options)
```

### Vaults

A `Vaults` is an read-only interface for multiple [vault contracts](https://github.com/pooltogether/v5-vault). It is meant to take in all vaults in a `VaultList` and create `Vault` objects for each of them, allowing for more efficient aggregate queries.

To create an instance of `Vaults`, you will need:

- An array of `VaultInfo` data for each of the vaults in the `VaultList`.
- [Viem public clients](https://viem.sh/docs/clients/public.html) for each network vaults are deployed in.

See the typing of a `VaultList` [here](https://github.com/GenerationSoftware/pooltogether-client-monorepo/blob/main/shared/types/types/vaults.ts).

```ts
import { Vaults } from '@generationsoftware/hyperstructure-client-js'

// VaultList
const vaultList = {
  name: 'Amazing Vault List',
  version: { ... },
  timestamp: '...',
  tokens: [{ ... }]
}

// Viem public clients
const publicClients = {
  1: createPublicClient({ ... }),
  10: createPublicClient({ ... }),
  42161: createPublicClient({ ... })
}

// Initializing Vaults
const vaults = new Vaults(vaultList.tokens, publicClients)
```

## 🧮 &nbsp; Examples

### Getting prize token data for a prize pool

```ts
const tokenData = await prizePool.getPrizeTokenData()
```

### Getting a prize pool's last awarded draw ID

```ts
const lastDrawId = await prizePool.getLastDrawId()
```

### Getting current and estimated prize amounts and frequency for all tiers of a prize pool

```ts
const allPrizeInfo = await prizePool.getAllPrizeInfo()
```

### Claiming a prize from a prize pool

NOTE: Since this is a write function, a wallet client is required when initializing `PrizePool`.

```ts
const userAddress = '0x123...'
const prizeTier = 0
const txHash = await prizePool.claimPrize(userAddress, prizeTier)
```

### Getting token & share data for a vault

```ts
const tokenData = await vault.getTokenData() // Deposited asset
const shareData = await vault.getShareData() // Receipt token
```

### Getting a user's deposited balance for a vault

```ts
const userAddress = '0x123...'
const tokenBalance = await vault.getUserTokenBalance(userAddress)
const shareBalance = await vault.getUserShareBalance(userAddress)
```

### Getting total tokens deposited in a vault

```ts
const totalTokenBalance = await vault.getTotalTokenBalance()
```

### Depositing into a vault

NOTE: Since this is a write function, a wallet client is required when initializing `Vault`.

```ts
const amount = 123456789n // Bigint value w/ decimals
const txHash = await vault.deposit(amount)
```

### Withdrawing from a vault

NOTE: Since this is a write function, a wallet client is required when initializing `Vault`.

NOTE: You can `withdraw` a token amount, but it is generally better to `redeem` a share amount.

```ts
const amount = 123456789n // Bigint value w/ decimals
const txHash = await vault.redeem(amount)
```

### Getting token & share data for multiple vaults

```ts
const allTokenData = await vaults.getTokenData()
const allShareData = await vaults.getShareData()
```

### Getting a user's deposited balances for multiple vaults

```ts
const userAddress = '0x123...'
const allTokenBalances = await vaults.getUserTokenBalances(userAddress)
const allShareBalances = await vaults.getUserShareBalances(userAddress)
```
