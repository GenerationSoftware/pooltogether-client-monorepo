import {
  calculateCurrencyValue,
  formatCurrencyNumberForDisplay,
  NETWORK,
  USDC_TOKEN_ADDRESSES
} from '@pooltogether/hyperstructure-client-js'
import { useTokenPrices } from '@pooltogether/hyperstructure-react-hooks'
import {
  CURRENCY_ID,
  SUPPORTED_CURRENCIES,
  useCoingeckoExchangeRates,
  useSelectedCurrency
} from '@shared/generic-react-hooks'
import { CountUp, Spinner } from '@shared/ui'
import { useMemo, useState } from 'react'

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

  const { data: tokenPrices, isFetched: isFetchedTokenPrices } = useTokenPrices(NETWORK.mainnet, [
    USDC_TOKEN_ADDRESSES[NETWORK.mainnet]
  ])

  const [isFallbackUsdCurrency, setIsFallbackUsdCurrency] = useState<boolean>(false)

  const currencyValue = useMemo(() => {
    if (isFetchedExchangeRates && !!exchangeRates) {
      const value = calculateCurrencyValue(baseValue, selectedCurrency, exchangeRates, {
        baseCurrency
      })
      if (value !== undefined) {
        setIsFallbackUsdCurrency(false)
        return value
      } else if (isFetchedTokenPrices && !!tokenPrices) {
        setIsFallbackUsdCurrency(true)
        const usdValue =
          Number(baseValue) * (1 / tokenPrices[USDC_TOKEN_ADDRESSES[NETWORK.mainnet]])
        return usdValue
      }
    } else if (Number(baseValue) === 0) {
      return 0
    } else {
      return undefined
    }
  }, [
    isFetchedExchangeRates,
    exchangeRates,
    isFetchedTokenPrices,
    tokenPrices,
    baseValue,
    selectedCurrency,
    baseCurrency
  ])

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
    return (
      <>{`< ${formatCurrencyNumberForDisplay(
        minValue,
        !isFallbackUsdCurrency ? selectedCurrency : 'usd',
        { ...rest }
      )}`}</>
    )
  } else if (countUp) {
    const fractionDigits = decimals ?? currencyValue > 10_000 ? 0 : 2
    return (
      <>
        {!hideCountUpSymbol &&
          SUPPORTED_CURRENCIES[!isFallbackUsdCurrency ? selectedCurrency : 'usd']?.symbol}
        <CountUp
          countTo={currencyValue}
          minimumFractionDigits={fractionDigits}
          maximumFractionDigits={fractionDigits}
          {...rest}
        />
      </>
    )
  } else {
    return (
      <>
        {formatCurrencyNumberForDisplay(
          currencyValue,
          !isFallbackUsdCurrency ? selectedCurrency : 'usd',
          { ...rest }
        )}
      </>
    )
  }
}
