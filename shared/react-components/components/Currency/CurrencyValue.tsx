import {
  calculateCurrencyValue,
  formatCurrencyNumberForDisplay
} from '@pooltogether/hyperstructure-client-js'
import {
  CURRENCY_ID,
  SUPPORTED_CURRENCIES,
  useCoingeckoExchangeRates,
  useSelectedCurrency
} from '@shared/generic-react-hooks'
import { CountUp, Spinner } from '@shared/ui'
import { useMemo } from 'react'

export interface CurrencyValueProps extends Omit<Intl.NumberFormatOptions, 'style' | 'currency'> {
  baseValue: number | string
  baseCurrency?: CURRENCY_ID
  countUp?: boolean
  decimals?: number
  hideCountUpSymbol?: boolean
  hideLoading?: boolean
  locale?: string
  round?: boolean
  hideZeroes?: boolean
  fallback?: JSX.Element
}

export const CurrencyValue = (props: CurrencyValueProps) => {
  const {
    baseValue,
    baseCurrency,
    countUp,
    decimals,
    hideCountUpSymbol,
    hideLoading,
    fallback,
    ...rest
  } = props

  const { data: exchangeRates, isFetched: isFetchedExchangeRates } = useCoingeckoExchangeRates()
  const { selectedCurrency } = useSelectedCurrency()

  const currencyValue = useMemo(() => {
    if (isFetchedExchangeRates && !!exchangeRates) {
      return calculateCurrencyValue(baseValue, selectedCurrency, exchangeRates, { baseCurrency })
    } else {
      return undefined
    }
  }, [isFetchedExchangeRates, exchangeRates, baseValue, selectedCurrency, baseCurrency])

  const minValue = 1 / 10 ** (decimals ?? 2)

  if (!isFetchedExchangeRates) {
    if (!hideLoading) {
      return <Spinner />
    } else {
      return <></>
    }
  } else if (currencyValue === undefined) {
    return fallback ?? <>?</>
  } else if (currencyValue > 0 && currencyValue < minValue) {
    return <>{`< ${formatCurrencyNumberForDisplay(minValue, selectedCurrency, { ...rest })}`}</>
  } else if (countUp) {
    const fractionDigits = decimals ?? currencyValue > 10_000 ? 0 : 2
    return (
      <>
        {!hideCountUpSymbol && SUPPORTED_CURRENCIES[selectedCurrency]?.symbol}
        <CountUp
          countTo={currencyValue}
          minimumFractionDigits={fractionDigits}
          maximumFractionDigits={fractionDigits}
          {...rest}
        />
      </>
    )
  } else {
    return <>{formatCurrencyNumberForDisplay(currencyValue, selectedCurrency, { ...rest })}</>
  }
}
