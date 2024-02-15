/**
 * Query keys for various hooks
 */
export const QUERY_KEYS = {
  coingeckoExchangeRates: 'coingeckoExchangeRates',
  coingeckoSimpleTokenPrices: 'coingeckoSimpleTokenPrices',
  coingeckoTokenData: 'coingeckoTokenData',
  coingeckoTokenPrices: 'coingeckoTokenPrices'
} as const

/**
 * Local storage keys
 */
export const LOCAL_STORAGE_KEYS = {
  isTestnets: 'isTestnets',
  isDismissed: 'isDismissed',
  selectedCurrency: 'selectedCurrency',
  selectedLanguage: 'selectedLanguage',
  customRPCs: 'customRPCs'
} as const

/**
 * Modal keys
 */
export const MODAL_KEYS = {
  captcha: 'captcha',
  deposit: 'deposit',
  drawWinners: 'drawWinners',
  settings: 'settings',
  withdraw: 'withdraw',
  checkPrizes: 'checkPrizes',
  delegate: 'delegate'
} as const
