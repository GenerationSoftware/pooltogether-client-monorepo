import { useTokenPrices } from '@generationsoftware/hyperstructure-react-hooks'
import {
  CURRENCY_ID,
  SUPPORTED_CURRENCIES,
  useCoingeckoExchangeRates,
  useSelectedCurrency
} from '@shared/generic-react-hooks'
import { CountUp, Spinner } from '@shared/ui'
import {
  calculateCurrencyValue,
  formatCurrencyNumberForDisplay,
  lower,
  NETWORK,
  POOL_TOKEN_ADDRESSES
} from '@shared/utilities'
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
  shortenMillions?: boolean
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

  const { data: coingeckoExchangeRates, isFetched: isFetchedCoingeckoExchangeRates } =
    useCoingeckoExchangeRates()
  const { selectedCurrency } = useSelectedCurrency()

  const { data: extraTokenPrices, isFetched: isFetchedExtraTokenPrices } = useTokenPrices(
    NETWORK.mainnet,
    [POOL_TOKEN_ADDRESSES[NETWORK.mainnet]]
  )

  const exchangeRates = useMemo(() => {
    const rates = { ...coingeckoExchangeRates }

    if (!!rates.eth && !!extraTokenPrices) {
      const poolPrice = extraTokenPrices[lower(POOL_TOKEN_ADDRESSES[NETWORK.mainnet])]

      if (!!poolPrice) {
        rates.pool = {
          name: SUPPORTED_CURRENCIES.pool.name,
          unit: SUPPORTED_CURRENCIES.pool.symbol,
          value: rates.eth.value / poolPrice,
          type: 'crypto'
        }
      }
    }

    return rates
  }, [coingeckoExchangeRates, extraTokenPrices])

  const isFetchedExchangeRates = isFetchedCoingeckoExchangeRates && isFetchedExtraTokenPrices

  const [isFallbackUsdCurrency, setIsFallbackUsdCurrency] = useState<boolean>(false)

  const currencyValue = useMemo(() => {
    setIsFallbackUsdCurrency(false)

    if (Number(baseValue) === 0) {
      return 0
    }

    if (selectedCurrency === 'eth' && (baseCurrency === 'eth' || baseCurrency === undefined)) {
      return Number(baseValue)
    }

    if (Object.keys(exchangeRates).length === 0) {
      return undefined
    }

    const value = calculateCurrencyValue(baseValue, selectedCurrency, exchangeRates, {
      baseCurrency
    })

    if (value !== undefined) {
      return value
    } else {
      const usdValue = calculateCurrencyValue(baseValue, 'usd', exchangeRates, { baseCurrency })

      if (!!usdValue !== undefined) {
        setIsFallbackUsdCurrency(true)
        return usdValue
      }
    }
  }, [exchangeRates, baseValue, selectedCurrency, baseCurrency])

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
      <>
        {`< ${formatCurrencyNumberForDisplay(
          minValue,
          !isFallbackUsdCurrency ? selectedCurrency : 'usd',
          { ...rest }
        )}`}
      </>
    )
  } else if (countUp) {
    const symbol = SUPPORTED_CURRENCIES[!isFallbackUsdCurrency ? selectedCurrency : 'usd']?.symbol
    const fractionDigits = decimals ?? currencyValue > 10_000 ? 0 : 2
    return (
      <>
        {!hideCountUpSymbol && symbol !== 'POOL' && symbol}
        <CountUp
          countTo={currencyValue}
          minimumFractionDigits={fractionDigits}
          maximumFractionDigits={fractionDigits}
          {...rest}
        />
        {!hideCountUpSymbol && symbol === 'POOL' && ` ${symbol}`}
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
