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
![npm](https://img.shields.io/npm/v/@generationsoftware/hyperstructure-react-hooks)
![license](https://img.shields.io/npm/l/@generationsoftware/hyperstructure-react-hooks)

[Client Monorepo](https://github.com/GenerationSoftware/pooltogether-client-monorepo) | [Documentation](https://dev.pooltogether.com/) | [Prize Pool Contract](https://github.com/GenerationSoftware/pt-v5-prize-pool) | [Vault Contract](https://github.com/GenerationSoftware/pt-v5-vault)

# 🏆 &nbsp; Overview

A library of shared React hooks specific to Hyperstructure functionality, using [WAGMI](https://wagmi.sh/).

Many hooks utilize `react-query` in order to prevent unecessary refetching. A `refetch` function is returned in order to manually refetch if necessary, or alternatively a `refetchInterval` may be passed initially in order to automatically refetch every N milliseconds.

## 💾 &nbsp; Installation

This library is available as an NPM package:

```sh
npm install @generationsoftware/hyperstructure-react-hooks
```

or

```sh
pnpm install @generationsoftware/hyperstructure-react-hooks
```

or

```sh
yarn add @generationsoftware/hyperstructure-react-hooks
```

## 🐱‍👤 &nbsp; Available Hooks

### App Hooks

- `useCachedVaultLists`
- `useLastCheckedPrizesTimestamps`
- `useSelectedVaultListIds`
- `useSelectedVaultLists`
- `useSelectedVaults`
- `useSelectedVault`
- `useVaultList`

### Blockchain Hooks

- `useBlock`
- `useBlockAtTimestamp`
- `useBlocks`
- `useBlocksAtTimestamps`
- `useClientChainId`
- `useClientChainIds`
- `useClients`
- `useGasAmountEstimate`
- `useGasCostEstimates`
- `useGasPrice`
- `useTxReceipt`
- `useTxReceipts`

### Event Hooks

- `useDepositEvents`
- `useDrawAwardedEvents`
- `useDrawFinishedEvents`
- `useDrawStartedEvents`
- `useLiquidationEvents`
- `useManualContributionEvents`
- `usePrizeBackstopEvents`
- `usePromotionCreatedEvents`
- `usePromotionRewardsClaimedEvents`
- `useTransferEvents`
- `useVaultContributionEvents`
- `useWithdrawEvents`

### Prize Pool Hooks

- `useAllDrawIds`
- `useAllDrawPeriods`
- `useAllFirstDrawOpenedAt`
- `useAllLastAwardedDrawIds`
- `useAllPrizeDrawWinners`
- `useAllPrizeInfo`
- `useAllPrizeTokenData`
- `useAllPrizeTokenPrices`
- `useAllPrizeValue`
- `useAllUserBalanceUpdates`
- `useAllUserEligibleDraws`
- `useAllUserPrizeOdds`
- `useAllUserPrizePoolWins`
- `useDrawAuctionDuration`
- `useDrawIds`
- `useDrawPeriod`
- `useDrawsToCheckForPrizes`
- `useEstimatedPrizeCount`
- `useFirstDrawOpenedAt`
- `useGrandPrize`
- `useLargestGrandPrize`
- `useLastAwardedDrawId`
- `useLastAwardedDrawTimestamps`
- `usePrizeDrawWinners`
- `usePrizeOdds`
- `usePrizePools`
- `usePrizeTokenData`
- `usePrizeTokenPrice`
- `useWalletAddresses`

### Signature Hooks

- `useApproveSignature`
- `useGenericApproveSignature`

### Token Hooks

- `useHistoricalTokenPrices`
- `useTokenAllowances`
- `useTokenBalances`
- `useTokenNonces`
- `useTokenPermitSupport`
- `useTokenPrices`
- `useTokenPricesAcrossChains`
- `useTokens`
- `useTokenVersion`

### Transaction Hooks

- `useSendApproveTransaction`
- `useSendClaimRewardsTransaction`
- `useSendClaimVaultFeesTransaction`
- `useSendCreatePromotionTransaction`
- `useSendDeployLiquidationPairTransaction`
- `useSendDeployVaultTransaction`
- `useSendDepositTransaction`
- `useSendDepositWithPermitTransaction`
- `useSendGenericApproveTransaction`
- `useSendRedeemTransaction`
- `useSendSetClaimerTransaction`
- `useSendSetLiquidationPairTransaction`
- `useSendWithdrawTransaction`

### Vault Hooks

- `useAllUserClaimableRewards`
- `useAllUserVaultBalances`
- `useAllUserVaultDelegates`
- `useAllUserVaultDelegationBalances`
- `useAllVaultBalances`
- `useAllVaultContributionAmounts`
- `useAllVaultExchangeRates`
- `useAllVaultHistoricalSharePrices`
- `useAllVaultHistoricalTokenPrices`
- `useAllVaultPercentageContributions`
- `useAllVaultPrizeYields`
- `useAllVaultPromotions`
- `useAllVaultPromotionsApr`
- `useAllVaultShareData`
- `useAllVaultSharePrices`
- `useAllVaultTokenAddresses`
- `useAllVaultTokenData`
- `useAllVaultTokenPrices`
- `useAllVaultTotalSupplyTwabs`
- `useSortedVaults`
- `useUserClaimableRewards`
- `useUserVaultDelegate`
- `useUserVaultDelegationBalance`
- `useUserVaultShareBalance`
- `useUserVaultTokenBalance`
- `useVault`
- `useVaultBalance`
- `useVaultClaimer`
- `useVaultContributionAmount`
- `useVaultExchangeRate`
- `useVaultFeeInfo`
- `useVaultFeesAvailable`
- `useVaultLiquidationPair`
- `useVaultOwner`
- `useVaultPercentageContribution`
- `useVaultPrizeYield`
- `useVaultPromotions`
- `useVaultPromotionsApr`
- `useVaults`
- `useVaultShareData`
- `useVaultSharePrice`
- `useVaultTokenAddress`
- `useVaultTokenData`
- `useVaultTokenPrice`
- `useVaultTotalSupplyTwab`
- `useVaultYieldSource`
