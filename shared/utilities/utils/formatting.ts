import { formatUnits } from 'viem'

/**
 * Formats a number string to the requested precision
 * @param val number string (ex. "1005.2924")
 * @param precision precision to format to (default is 2)
 * @returns
 */
export const formatStringWithPrecision = (val: string, precision: number = 2) => {
  const periodIndex = val.indexOf('.')
  if (periodIndex !== -1) {
    if (precision === 0) return val.substring(0, periodIndex)
    return val.substring(0, periodIndex + precision + 1)
  }
  return val
}

/**
 * Formats a number to make it legible & user-friendly
 * @param val number to format
 * @param options formatting options
 * @returns
 */
export const formatNumberForDisplay = (
  val: string | number | bigint,
  options: Intl.NumberFormatOptions & {
    locale?: string
    round?: boolean
    hideZeroes?: boolean
    shortenMillions?: boolean
  } = { locale: 'en' }
) => {
  const { locale, round, hideZeroes, shortenMillions, ...formatOptions } = options

  const format = (
    v: number,
    overrides?: {
      minimumFractionDigits?: number
      maximumFractionDigits?: number
    }
  ) => {
    return v.toLocaleString(locale || 'en', {
      ...formatOptions,
      maximumFractionDigits:
        !!hideZeroes && overrides?.maximumFractionDigits === undefined
          ? v <= 1
            ? formatOptions.maximumFractionDigits
            : 0
          : overrides?.maximumFractionDigits ?? formatOptions.maximumFractionDigits,
      minimumFractionDigits:
        !!hideZeroes && overrides?.minimumFractionDigits === undefined
          ? v <= 1
            ? formatOptions.minimumFractionDigits
            : 0
          : overrides?.minimumFractionDigits ?? formatOptions.minimumFractionDigits
    })
  }

  const formatShortened = (v: number) => {
    if (v < 1e6) return format(v)

    const numDigits = Math.floor(Math.abs(v)).toString().length
    const maximumFractionDigits =
      numDigits === 7 || numDigits === 10 ? 2 : numDigits === 8 || numDigits === 11 ? 1 : 0
    const newValue = Math.round(v / 10 ** (numDigits - 3)) / 10 ** maximumFractionDigits
    const label = numDigits >= 10 ? 'B' : 'M'

    return format(newValue, { minimumFractionDigits: 0, maximumFractionDigits }) + label
  }

  let _val: number

  if (val === undefined || val === null) {
    return ''
  } else if (typeof val === 'number') {
    _val = val
  } else if (typeof val === 'string' || typeof val === 'bigint') {
    _val = Number(val)
  } else {
    return ''
  }

  if (!!round) {
    _val = Math.round(_val)
  }

  if (!!shortenMillions) {
    return formatShortened(_val)
  }

  return format(_val)
}

/**
 * Wraps {@link formatNumberForDisplay} and handles shifting decimals of a BigInt
 * @param val BigInt to format
 * @param decimals decimals to shift by
 * @param options formatting options
 * @returns
 */
export const formatBigIntForDisplay = (
  val: bigint,
  decimals: number,
  options?: Intl.NumberFormatOptions & {
    locale?: string
    round?: boolean
    hideZeroes?: boolean
  }
) => {
  const shiftedBigInt = formatUnits(val, decimals)
  return formatNumberForDisplay(shiftedBigInt, options)
}

/**
 * Wraps {@link formatNumberForDisplay} and handles currency style selection
 * @param val number to format
 * @param currency currency symbol and formatting to follow (default is "USD")
 * @param options formatting options
 * @returns
 */
export const formatCurrencyNumberForDisplay = (
  val: string | number,
  currency: string = 'USD',
  options?: Omit<Intl.NumberFormatOptions, 'style' | 'currency'> & {
    locale?: string
    round?: boolean
    hideZeroes?: boolean
    shortenMillions?: boolean
  }
) => {
  if (currency.toLowerCase() === 'eth') {
    return `Ξ${formatNumberForDisplay(val, {
      ...options,
      style: 'currency',
      currency: 'USD'
    }).slice(1)}`
  } else if (currency.toLowerCase() === 'btc') {
    return `₿${formatNumberForDisplay(val, {
      ...options,
      style: 'currency',
      currency: 'USD'
    }).slice(1)}`
  } else if (currency.toLowerCase() === 'pool') {
    return `${formatNumberForDisplay(val, {
      ...options,
      style: 'currency',
      currency: 'USD'
    }).slice(1)} POOL`
  }

  return formatNumberForDisplay(val, { ...options, style: 'currency', currency })
}

/**
 * Returns the number of digits after a decimal place
 * @param val number to check max precision for
 * @returns
 */
export const getMaxPrecision = (val: number) => {
  return val.toString().includes('e') ? 18 : val.toString().split('.')[1]?.length || 0
}
