import { CoingeckoExchangeRates } from '@shared/types'
import { formatCurrencyNumberForDisplay } from './formatting'

/**
 * Returns a converted and formatted currency value in string form
 *
 * NOTE: Assumes 'eth' as `baseCurrency` unless otherwise specified through `options`
 * @param baseValue a currency value to convert and format
 * @param currency the currency to convert to
 * @param exchangeRates currency exchange rates to refer to
 * @param options formatting and base currency options
 * @returns
 */
export const formatCurrencyValue = (
  baseValue: number | string,
  currency: string,
  exchangeRates: CoingeckoExchangeRates,
  options?: Omit<Intl.NumberFormatOptions, 'style' | 'currency'> & {
    baseCurrency?: string
    locale?: string
    round?: boolean
    hideZeroes?: boolean
    shortenMillions?: boolean
  }
) => {
  const currencyValue = calculateCurrencyValue(baseValue, currency, exchangeRates, {
    baseCurrency: options?.baseCurrency
  })

  if (!!currencyValue) {
    return formatCurrencyNumberForDisplay(currencyValue, currency, options)
  } else {
    return undefined
  }
}

/**
 * Returns a currency value converted to another currency
 *
 * NOTE: Assumes 'eth' as `baseCurrency` unless otherwise specified through `options`
 * @param baseValue a currency value to convert
 * @param currency the currency to convert to
 * @param exchangeRates currency exchange rates to refer to
 * @param options optional settings
 * @returns
 */
export const calculateCurrencyValue = (
  baseValue: number | string,
  currency: string,
  exchangeRates: CoingeckoExchangeRates,
  options?: { baseCurrency?: string }
) => {
  if (!!exchangeRates && !!exchangeRates[currency]) {
    const baseCurrencyValue = options?.baseCurrency
      ? exchangeRates[options.baseCurrency]?.value
      : exchangeRates.eth?.value
    if (!!baseCurrencyValue) {
      const currencyExchangeRate = exchangeRates[currency].value / baseCurrencyValue
      const currencyValue = Number(baseValue) * currencyExchangeRate
      return currencyValue
    } else {
      console.warn(`No base currency value found: ${options?.baseCurrency}`)
    }
  } else {
    console.warn(`No currency exchange rate found: ${currency}`)
  }

  return undefined
}
