import { LOCAL_STORAGE_KEYS as GENERIC_LOCAL_STORAGE_KEYS } from '@shared/generic-react-hooks'

/**
 * Query keys for various hooks
 */
export const QUERY_KEYS = {
  block: 'block',
  blockAtTimestamp: 'blockAtTimestamp',
  clientChainId: 'clientChainId',
  drawAwardedEvents: 'drawAwardedEvents',
  drawPeriod: 'drawPeriod',
  drawTimestamps: 'drawTimestamps',
  drawWinners: 'drawWinners',
  estimatedPrizeCount: 'estimatedPrizeCount',
  firstDrawOpenedAt: 'firstDrawOpenedAt',
  gasAmountEstimates: 'gasAmountEstimates',
  gasCostRollup: 'gasCostRollup',
  gasPrices: 'gasPrices',
  historicalTokenPrices: 'historicalTokenPrices',
  lastAwardedDrawId: 'lastAwardedDrawId',
  lastAwardedDrawTimestamps: 'lastAwardedDrawTimestamps',
  liquidationEvents: 'liquidationEvents',
  manualContributionEvents: 'manualContributionEvents',
  prizeBackstopEvents: 'prizeBackstopEvents',
  prizeInfo: 'prizeInfo',
  prizeOdds: 'prizeOdds',
  prizeTokenData: 'prizeTokenData',
  promotionCreatedEvents: 'promotionCreatedEvents',
  promotionRewardsClaimedEvents: 'promotionRewardsClaimedEvents',
  promotionInfo: 'promotionInfo',
  rngAuctionCompletedEvents: 'rngAuctionCompletedEvents',
  selectedVaults: 'selectedVaults',
  tokenAllowances: 'tokenAllowances',
  tokenBalances: 'tokenBalances',
  tokenDomain: 'tokenDomain',
  tokenNonces: 'tokenNonces',
  tokenPermitSupport: 'tokenPermitSupport',
  tokenPrices: 'tokenPrices',
  tokenTransferEvents: 'tokenTransferEvents',
  tokens: 'tokens',
  txReceipt: 'txReceipt',
  userBalanceUpdates: 'userBalanceUpdates',
  userClaimableRewards: 'userClaimableRewards',
  userEligibleDraws: 'userEligibleDraws',
  userVaultBalances: 'userVaultBalances',
  userVaultDelegate: 'userVaultDelegate',
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
  vaultTwabController: 'vaultTwabController',
  vaultYieldSources: 'vaultYieldSources'
} as const

/**
 * Local storage keys
 */
export const LOCAL_STORAGE_KEYS = {
  ...GENERIC_LOCAL_STORAGE_KEYS,
  cachedVaultLists: 'cachedVaultLists',
  localVaultListIds: 'localVaultListIds',
  importedVaultListIds: 'importedVaultListIds',
  lastCheckedPrizesTimestamps: 'lastCheckedPrizesTimestamps'
} as const
