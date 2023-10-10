import { LOCAL_STORAGE_KEYS as GENERIC_LOCAL_STORAGE_KEYS } from '@shared/generic-react-hooks'

/**
 * Query keys for various hooks
 */
export const QUERY_KEYS = Object.freeze({
  drawPeriod: 'drawPeriod',
  drawTimestamps: 'drawTimestamps',
  drawWinners: 'drawWinners',
  estimatedPrizeCount: 'estimatedPrizeCount',
  firstDrawOpenedAt: 'firstDrawOpenedAt',
  gasAmountEstimates: 'gasAmountEstimates',
  gasPrices: 'gasPrices',
  historicalTokenPrices: 'historicalTokenPrices',
  lastAwardedDrawId: 'lastAwardedDrawId',
  lastAwardedDrawTimestamps: 'lastAwardedDrawTimestamps',
  prizeInfo: 'prizeInfo',
  prizeOdds: 'prizeOdds',
  prizeTokenData: 'prizeTokenData',
  clientChainId: 'clientChainId',
  selectedVaults: 'selectedVaults',
  tokenAllowances: 'tokenAllowances',
  tokenBalances: 'tokenBalances',
  tokenNonces: 'tokenNonces',
  tokenPermitSupport: 'tokenPermitSupport',
  tokenPrices: 'tokenPrices',
  tokenVersions: 'tokenVersions',
  tokens: 'tokens',
  userBalanceUpdates: 'userBalanceUpdates',
  userEligibleDraws: 'userEligibleDraws',
  userVaultBalances: 'userVaultBalances',
  userVaultDelegationBalances: 'userVaultDelegationBalances',
  userWins: 'userWins',
  vaultBalances: 'vaultBalances',
  vaultClaimers: 'vaultClaimers',
  vaultContributionAmounts: 'vaultContributionAmounts',
  vaultExchangeRates: 'vaultExchangeRates',
  vaultFeeInfo: 'vaultFeeInfo',
  vaultFeesAvailable: 'vaultFeeInfo',
  vaultLiquidationPairs: 'vaultLiquidationPairs',
  vaultList: 'vaultList',
  vaultOwner: 'vaultOwner',
  vaultPercentageContributions: 'vaultPercentageContributions',
  vaultShareData: 'vaultShareData',
  vaultTokenAddresses: 'vaultTokenAddresses',
  vaultTokenData: 'vaultTokenData',
  vaultTotalSupplyTwabs: 'vaultTotalSupplyTwabs',
  vaultYieldSources: 'vaultYieldSources'
})

/**
 * Local storage keys
 */
export const LOCAL_STORAGE_KEYS = Object.freeze({
  ...GENERIC_LOCAL_STORAGE_KEYS,
  cachedVaultLists: 'cachedVaultLists',
  localVaultListIds: 'localVaultListIds',
  importedVaultListIds: 'importedVaultListIds',
  lastCheckedPrizesTimestamps: 'lastCheckedPrizesTimestamps'
})
