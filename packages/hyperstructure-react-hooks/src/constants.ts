import { LOCAL_STORAGE_KEYS as GENERIC_LOCAL_STORAGE_KEYS } from '@shared/generic-react-hooks'

/**
 * Query keys for various hooks
 */
export const QUERY_KEYS = Object.freeze({
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
  relayAuctionEvents: 'relayAuctionEvents',
  rngAuctionEvents: 'rngAuctionEvents',
  rngL1RelayMsgEvents: 'rngL1RelayMsgEvents',
  rngL2RelayMsgEvents: 'rngL2RelayMsgEvents',
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
