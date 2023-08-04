import { LOCAL_STORAGE_KEYS as GENERIC_LOCAL_STORAGE_KEYS } from '@shared/generic-react-hooks'

/**
 * Query keys for various hooks
 */
export const QUERY_KEYS = Object.freeze({
  drawPeriod: 'drawPeriod',
  drawWinners: 'drawWinners',
  estimatedPrizeCount: 'estimatedPrizeCount',
  gasPrices: 'gasPrices',
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
  userVaultBalances: 'userVaultBalances',
  userWins: 'userWins',
  vaultBalances: 'vaultBalances',
  vaultClaimers: 'vaultClaimers',
  vaultExchangeRates: 'vaultExchangeRates',
  vaultLiquidationPairs: 'vaultLiquidationPairs',
  vaultList: 'vaultList',
  vaultPercentageContributions: 'vaultPercentageContributions',
  vaultPrizePower: 'vaultPrizePower',
  vaultShareData: 'vaultShareData',
  vaultTokenAddresses: 'vaultTokenAddresses',
  vaultTokenData: 'vaultTokenData'
})

/**
 * Local storage key suffix (update for breaking updates)
 */
const LOCAL_STORAGE_KEY_SUFFIX = '-alpha.1'

/**
 * Local storage keys
 */
export const LOCAL_STORAGE_KEYS = Object.freeze({
  ...GENERIC_LOCAL_STORAGE_KEYS,
  cachedVaultLists: `cachedVaultLists${LOCAL_STORAGE_KEY_SUFFIX}`,
  localVaultListIds: `localVaultListIds${LOCAL_STORAGE_KEY_SUFFIX}`,
  importedVaultListIds: `importedVaultListIds${LOCAL_STORAGE_KEY_SUFFIX}`
})
