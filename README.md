<p align="center">
  <a href="https://github.com/pooltogether/pooltogether--brand-assets">
    <img src="https://github.com/pooltogether/pooltogether--brand-assets/blob/977e03604c49c63314450b5d432fe57d34747c66/logo/pooltogether-logo--purple-gradient.png?raw=true" alt="PoolTogether Brand" style="max-width:100%;" width="200">
  </a>
</p>

<br />

# 💻 &nbsp; PoolTogether Client Monorepo

This monorepo includes many of PoolTogether's apps and packages in order to facilitate code sharing and maintainability.

## 💾 &nbsp; Installation

Make sure you have [pnpm](https://pnpm.io/) installed, as it is the package manager used throughout this monorepo.

`pnpm i`

## 🏎️ &nbsp; Quickstart

### Development

`pnpm dev`

Each app is already setup with its own port through its `package.json` dev script.

---

### Apps

- `app`: App w/ core PoolTogether Hyperstructure functionality.
- `landing-page`: Landing page for the many interfaces in this monorepo.
- `vault-factory`: App to create and manage 4626 vaults.
- `vaultlist-creator`: App to create, edit and distribute vault lists.
- `analytics`: App to visualize analytics and general health metrics of the PoolTogether protocol.
- `swaps`: Simple app to guide users to swap into PoolTogether vaults.
- `rewards-builder`: App to create and manage TWAB reward promotions for any prize vault.
- `flash-liquidator`: App to flash liquidate yield from any PoolTogether liquidation pair linked to a prize vault.
- `migrations`: App to facilitate migrations from old protocol versions.
- `incentives`: App to present the protocol's many onchain and offchain incentives for contributors.

All apps above are [Next.js](https://nextjs.org/) apps with [Tailwind CSS](https://tailwindcss.com/) support, written in [TypeScript](https://www.typescriptlang.org/).

**Repo Links:** [App](https://github.com/GenerationSoftware/pooltogether-client-monorepo/tree/main/apps/app) | [Landing Page](https://github.com/GenerationSoftware/pooltogether-client-monorepo/tree/main/apps/landing-page) | [Vault Factory](https://github.com/GenerationSoftware/pooltogether-client-monorepo/tree/main/apps/vault-factory) | [VaultList Creator](https://github.com/GenerationSoftware/pooltogether-client-monorepo/tree/main/apps/vaultlist-creator) | [Analytics](https://github.com/GenerationSoftware/pooltogether-client-monorepo/tree/main/apps/analytics) | [Swaps](https://github.com/GenerationSoftware/pooltogether-client-monorepo/tree/main/apps/swaps) | [Rewards Builder](https://github.com/GenerationSoftware/pooltogether-client-monorepo/tree/main/apps/rewards-builder) | [Flash Liquidator](https://github.com/GenerationSoftware/pooltogether-client-monorepo/tree/main/apps/flash-liquidator) | [Migrations](https://github.com/GenerationSoftware/pooltogether-client-monorepo/tree/main/apps/migrations) | [Incentives](https://github.com/GenerationSoftware/pooltogether-client-monorepo/tree/main/apps/incentives)

---

### Packages

- `hyperstructure-client-js`: Protocol-specific functions to easily interact with onchain Hyperstructure data, using [Viem](https://viem.sh/).
- `hyperstructure-react-hooks`: Shared React hooks specific to Hyperstructure functionality, using [WAGMI](https://wagmi.sh/).

Prize pool and auxiliary contract addresses are included in the `hyperstructure-client-js` package. If you'd like to use older protocol deployments, refer to the versions below:

- Current:
  - `hyperstructure-client-js@latest`
  - `hyperstructure-react-hooks@latest`
- Canary (Optimism):
  - `hyperstructure-client-js@1.9.0`
  - `hyperstructure-react-hooks@1.14.5`
- Beta (Optimism):
  - `hyperstructure-client-js@1.2.8`
  - `hyperstructure-react-hooks@1.4.10`

**Repo Links:** [Hyperstructure Client JS](https://github.com/GenerationSoftware/pooltogether-client-monorepo/tree/main/packages/hyperstructure-client-js) | [Hyperstructure React Hooks](https://github.com/GenerationSoftware/pooltogether-client-monorepo/tree/main/packages/hyperstructure-react-hooks)

---

### Shared Library

- `config`: Shared config for TypeScript, [Tailwind](https://tailwindcss.com/), etc.
- `generic-react-hooks`: Shared React hooks.
- `react-components`: React component library utilizing some simpler components from `ui`, using [WAGMI](https://wagmi.sh/).
- `types`: Shared Typescript types.
- `ui`: Stub React component library with [Tailwind](https://tailwindcss.com/) used throughout many apps, using [Flowbite](https://flowbite-react.com/).
- `utilities`: Shared Typescript utilities.

The dependencies for these libraries are picked up from the root `package.json` file of the monorepo!

**Repo Links:** [Config](https://github.com/GenerationSoftware/pooltogether-client-monorepo/tree/main/shared/config) | [Generic React Hooks](https://github.com/GenerationSoftware/pooltogether-client-monorepo/tree/main/shared/generic-react-hooks) | [React Components](https://github.com/GenerationSoftware/pooltogether-client-monorepo/tree/main/shared/react-components) | [Types](https://github.com/GenerationSoftware/pooltogether-client-monorepo/tree/main/shared/types) | [UI](https://github.com/GenerationSoftware/pooltogether-client-monorepo/tree/main/shared/ui) | [Utilities](https://github.com/GenerationSoftware/pooltogether-client-monorepo/tree/main/shared/utilities)

---

### Workers

- `protocol-stats-worker`: Caching basic stats about the PoolTogether protocol.
- `token-prices-worker`: Caching token prices.
- `wallet-stats-worker`: Caching basic stats regarding wallet software usage (metamask, rainbow, etc.).

**Repo Links:** [Protocol Stats](https://github.com/GenerationSoftware/pooltogether-client-monorepo/tree/main/workers/protocol-stats-worker) | [Token Prices](https://github.com/GenerationSoftware/pooltogether-client-monorepo/tree/main/workers/token-prices-worker) | [Wallet Stats](https://github.com/GenerationSoftware/pooltogether-client-monorepo/tree/main/workers/wallet-stats-worker)

---

### Utilities

This Turborepo has some additional tools already setup:

- [Tailwind CSS](https://tailwindcss.com/) for styles
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Prettier](https://prettier.io) for code formatting

---

### Adding New Network

1. Update `shared/utilities/constants.ts` with values and addresses for the new network.
2. Update `shared/utilities/utils/networks.ts` with values for the new network.
3. Update `shared/react-components/constants.ts` with values for the new network.
4. Update `shared/react-components/components/Icons/NetworkIcon.tsx` with a logo for the new network.
5. Update `packages/hyperstructure-react-hooks/src/blockchain/useClients.ts` with the new network.
6. Update the `config.ts`, `wrangler.toml` and `wrangler.example.toml` files for any worker you want to use this new network on.
7. Update the `config.ts`, `.env` and `.env.example` files for any app you want to use this new network on.

---

### Wallet Support

Want your wallet in any of our apps? We rely on [RainbowKit](https://www.rainbowkit.com/) and [WAGMI](https://wagmi.sh) for wallet connection. If you have a suitable [wallet connector](https://github.com/rainbow-me/rainbowkit/tree/main/packages/rainbowkit/src/wallets/walletConnectors) we can add your wallet and give you a custom link to highlight your wallet for your users.

Append `?wallet=<wallet key>` to any app's links to highlight your wallet. Keys are visible on each app's `config.ts` file. Example: [App Config](https://github.com/GenerationSoftware/pooltogether-client-monorepo/blob/main/apps/app/src/constants/config.ts).

---

### Known Issues / Fixes

When adding/updating apps and/or packages, duplicate dependencies may be created, creating versioning issues. This can be resolved through running `pnpm up -r` as described [here](https://github.com/pnpm/pnpm/issues/2443), or just looking through `pnpm-lock.yaml` to identify version discrepancies.

The biggest culprit of the above is `@tanstack/react-query`, which sometimes is installed as two different versions and apps can no longer utilize hooks from the hooks package. This has been solved through the method described [here](https://github.com/TanStack/query/issues/3595#issuecomment-1248074333).

If editing component themes in `ui`, having the `Tailwind CSS IntelliSense` plugin for VSCode is recommended. In order to enable it for custom Flowbite themes and string class names, add `theme` and `.*ClassName*` to the `Class Attributes` setting.

Currently, `lottie-react` has some SSR issues in Node v22 as seen [here](https://github.com/Gamote/lottie-react/issues/101). Downgrading your node version to v18 resolves this issue.
