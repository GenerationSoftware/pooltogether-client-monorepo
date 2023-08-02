<p align="center">
  <a href="https://github.com/pooltogether/pooltogether--brand-assets">
    <img src="https://github.com/pooltogether/pooltogether--brand-assets/blob/977e03604c49c63314450b5d432fe57d34747c66/logo/pooltogether-logo--purple-gradient.png?raw=true" alt="PoolTogether Brand" style="max-width:100%;" width="200">
  </a>
</p>

<br />

# 💻 &nbsp; PoolTogether Hyperstucture React Hooks Library

![ts](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)
![viem](https://img.shields.io/static/v1?label&logo=v&logoColor=white&message=viem&color=gray)
![react](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)
![npm](https://img.shields.io/npm/v/@pooltogether/hyperstructure-react-hooks)
![license](https://img.shields.io/npm/l/@pooltogether/hyperstructure-react-hooks)

[Client Monorepo](https://github.com/GenerationSoftware/pooltogether-client-monorepo) | [Documentation](https://dev.pooltogether.com/) | [Prize Pool Contract](https://github.com/pooltogether/v5-prize-pool) | [Vault Contract](https://github.com/pooltogether/v5-vault)

# 🏆 &nbsp; Overview

A library of shared React hooks specific to Hyperstructure functionality, using [WAGMI](https://wagmi.sh/).

Many hooks utilize `react-query` in order to prevent unecessary refetching. A `refetch` function is returned in order to manually refetch if necessary, or alternatively a `refetchInterval` may be passed initially in order to automatically refetch every N milliseconds.

## 💾 &nbsp; Installation

This library is available as an NPM package:

```sh
npm install @pooltogether/hyperstructure-react-hooks
```

or

```sh
pnpm install @pooltogether/hyperstructure-react-hooks
```

or

```sh
yarn add @pooltogether/hyperstructure-react-hooks
```

## 🐱‍👤 &nbsp; Available Hooks

### App Hooks

- `useCachedVaultLists`
- `useSelectedVaultListIds`
- `useSelectedVaultLists`
- `useSelectedVaults`
- `useSelectedVault`
- `useVaultList`

### Blockchain Hooks

- `useClientChainId`
- `useClientChainIds`
- `useClients`
- `useGasCostEstimates`
- `useGasPrices`

### Prize Pool Hooks

- `useAllPrizeInfo`
- `useAllUserPrizeOdds`
- `useAllUserPrizePoolWins`
- `useDrawPeriod`
- `useEstimatedPrizeCount`
- `useLargestGrandPrize`
- `useNextDrawTimestamps`
- `usePrizeDrawWinners`
- `usePrizeOdds`
- `usePrizePools`
- `usePrizeTokenData`
- `usePrizeTokenPrice`

### Token Hooks

- `useTokenAllowances`
- `useTokenBalances`
- `useTokenPrices`
- `useTokenPricesAcrossChains`
- `useTokens`

### Transaction Hooks

- `useSendApproveTransaction`
- `useSendDepositTransaction`
- `useSendRedeemTransaction`
- `useSendWithdrawTransaction`

### Vault Hooks

- `useAllUserVaultBalances`
- `useAllVaultBalances`
- `useAllVaultExchangeRates`
- `useAllVaultPercentageContributions`
- `useAllVaultPrizePowers`
- `useAllVaultShareData`
- `useAllVaultTokenAddresses`
- `useAllVaultTokenData`
- `useAllVaultTokenPrices`
- `useSortedVaults`
- `useUserTotalBalance`
- `useUserVaultShareBalance`
- `useUserVaultTokenBalance`
- `useVault`
- `useVaultBalance`
- `useVaultClaimer`
- `useVaultExchangeRate`
- `useVaultLiquidationPair`
- `useVaultPercentageContribution`
- `useVaultPrizePower`
- `useVaults`
- `useVaultShareData`
- `useVaultSharePrice`
- `useVaultTokenAddress`
- `useVaultTokenData`
- `useVaultTokenPrice`
