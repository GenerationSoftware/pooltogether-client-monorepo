import { LOCAL_STORAGE_KEYS as GENERIC_LOCAL_STORAGE_KEYS } from '@shared/generic-react-hooks'

/**
 * Query keys for various hooks
 */
export const QUERY_KEYS = Object.freeze({
  drawPeriod: 'drawPeriod',
  drawTimestamps: 'drawTimestamps',
  drawWinners: 'drawWinners',
  estimatedPrizeCount: 'estimatedPrizeCount',
  firstDrawStartTimestamp: 'firstDrawStartTimestamp',
  gasPrices: 'gasPrices',
  lastDrawId: 'lastDrawId',
  lastDrawTimestamp: 'lastDrawTimestamp',
  nextDrawTimestamp: 'nextDrawTimestamp',
  prizeInfo: 'prizeInfo',
  prizeOdds: 'prizeOdds',
  prizeTokenData: 'prizeTokenData',
  clientChainId: 'clientChainId',
  selectedVaults: 'selectedVaults',
  tokenAllowances: 'tokenAllowances',
  tokenBalances: 'tokenBalances',
  tokenPrices: 'tokenPrices',
  tokens: 'tokens',
  userBalanceUpdates: 'userBalanceUpdates',
  userEligibleDraws: 'userEligibleDraws',
  userVaultBalances: 'userVaultBalances',
  userWins: 'userWins',
  vaultBalances: 'vaultBalances',
  vaultClaimers: 'vaultClaimers',
  vaultExchangeRates: 'vaultExchangeRates',
  vaultFeeInfo: 'vaultFeeInfo',
  vaultLiquidationPairs: 'vaultLiquidationPairs',
  vaultList: 'vaultList',
  vaultOwner: 'vaultOwner',
  vaultPercentageContributions: 'vaultPercentageContributions',
  vaultPrizePower: 'vaultPrizePower',
  vaultShareData: 'vaultShareData',
  vaultTokenAddresses: 'vaultTokenAddresses',
  vaultTokenData: 'vaultTokenData',
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
