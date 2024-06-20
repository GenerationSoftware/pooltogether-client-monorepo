import { Intl, TimeUnit } from '@shared/types'
import {
  MINUTES_PER_DAY,
  SECONDS_PER_DAY,
  SECONDS_PER_HOUR,
  SECONDS_PER_MINUTE,
  SECONDS_PER_YEAR
} from '../constants'
import { formatNumberForDisplay } from './formatting'

/**
 * Breaks down a number of seconds into years, months, days, hours, minutes, seconds
 * @param totalSeconds
 * @returns
 */
export const getTimeBreakdown = (totalSeconds: number | string) => {
  let diff = Number(totalSeconds)

  let years = 0
  if (diff >= SECONDS_PER_YEAR) {
    years = Math.floor(diff / SECONDS_PER_YEAR)
    diff -= years * SECONDS_PER_YEAR
  }

  let days = 0
  if (diff >= SECONDS_PER_DAY) {
    days = Math.floor(diff / SECONDS_PER_DAY)
    diff -= days * SECONDS_PER_DAY
  }

  let hours = 0
  if (days || diff >= SECONDS_PER_HOUR) {
    hours = Math.floor(diff / SECONDS_PER_HOUR)
    diff -= hours * SECONDS_PER_HOUR
  }

  let minutes = 0
  if (hours || diff >= 60) {
    minutes = Math.floor(diff / 60)
    diff -= minutes * 60
  }

  let seconds = 0
  if (minutes || diff >= 1) {
    seconds = Math.floor(diff)
  }

  return {
    years,
    days,
    hours,
    minutes,
    seconds
  }
}

/**
 * Converts milliseconds to seconds
 * @param milliseconds milliseconds as a number
 * @returns
 */
export const msToS = (ms: number | bigint) => {
  if (!ms) {
    return 0
  }
  if (typeof ms === 'bigint') {
    return Number(ms / BigInt(1_000))
  } else {
    return ms / 1_000
  }
}

/**
 * Converts seconds to milliseconds
 * @param seconds seconds as a number
 * @returns
 */
export const sToMs = (seconds: number) => {
  if (!seconds) {
    return 0
  }
  return seconds * 1_000
}

/**
 * Converts days to milliseconds
 * @param days days as a number
 * @returns
 */
export const dToMs = (days: number) => {
  if (!days) {
    return 0
  }
  return days * SECONDS_PER_DAY * 1_000
}

/**
 * Converts milliseconds to days
 * @param days days as a number
 * @returns
 */
export const msToD = (ms: number) => {
  if (!ms) {
    return 0
  }
  return ms / 1_000 / SECONDS_PER_DAY
}

/**
 * Converts days to seconds
 * @param days days as a number
 * @returns
 */
export const dToS = (days: number) => {
  if (!days) {
    return 0
  }
  return days * SECONDS_PER_DAY
}

/**
 * Converts seconds to days
 * @param s seconds as a number
 * @returns
 */
export const sToD = (s: number) => {
  if (!s) {
    return 0
  }
  return s / SECONDS_PER_DAY
}

/**
 * Converts seconds to minutes
 * @param s seconds as a number
 * @returns
 */
export const sToM = (s: number) => {
  if (!s) {
    return 0
  }
  return s / SECONDS_PER_MINUTE
}

/**
 * Converts days to minutes
 * @param days days as a number
 * @returns
 */
export const dToM = (days: number) => {
  if (!days) {
    return 0
  }
  return days * MINUTES_PER_DAY
}

/**
 * Finds the difference between two date objects in days, hours, minutes and seconds
 * @param dateA DateTime JS object (ie. new Date(Date.now()))
 * @param dateB DateTime JS object (ie. new Date(Date.now()))
 * @returns
 */
export const subtractDates = (dateA: Date, dateB: Date) => {
  let msA = dateA.getTime()
  let msB = dateB.getTime()

  let diff = msA - msB

  let days = 0
  if (diff >= 86_400_000) {
    days = diff / 86_400_000
    diff -= days * 86_400_000
  }

  let hours = 0
  if (days || diff >= 3_600_000) {
    hours = diff / 3_600_000
    diff -= hours * 3_600_000
  }

  let minutes = 0
  if (hours || diff >= 60_000) {
    minutes = diff / 60_000
    diff -= minutes * 60_000
  }

  let seconds = 0
  if (minutes || diff >= 1_000) {
    seconds = diff / 1_000
  }

  return {
    days,
    hours,
    minutes,
    seconds
  }
}

/**
 * Return seconds since Epoch as a number
 * @returns
 */
export const getSecondsSinceEpoch = () => Number((Date.now() / 1_000).toFixed(0))

/**
 * Converts a daily event count into a frequency (every X days/weeks/months/years) with the most relevant unit of time
 * @param dailyCount Number count of times an event takes place in any given day

 * 0 means the event never takes place
 * 
 * 1 means it happens once a day
 * 
 * 2 means it happens twice a day, etc.
 * @returns
 */
export const formatDailyCountToFrequency = (dailyCount: number) => {
  const result: { frequency: number; unit: TimeUnit } = {
    frequency: 0,
    unit: TimeUnit.day
  }

  if (dailyCount > 0) {
    const days = 1 / dailyCount
    const weeks = days / 7
    const months = days / (365 / 12)
    const years = days / 365

    if (weeks < 1.5) {
      result.frequency = days
    } else if (months < 1.5) {
      result.frequency = weeks
      result.unit = TimeUnit.week
    } else if (years < 1.5) {
      result.frequency = months
      result.unit = TimeUnit.month
    } else {
      result.frequency = years
      result.unit = TimeUnit.year
    }
  }

  return result
}

/**
 * Returns prize frequency text for any given frequency
 * @param data data from `formatDailyCountToFrequency()`
 * @param format desired output format (default is 'everyXdays')
 * @param intl optional localization
 * @returns
 */
export const getPrizeTextFromFrequency = (
  data: { frequency: number; unit: TimeUnit },
  format: 'everyXdays' | 'daily',
  intl?: Intl<
    | 'daily'
    | 'everyXdays'
    | 'everyXweeks'
    | 'everyXmonths'
    | 'everyXyears'
    | 'xPrizesDaily'
    | 'xPrizesWeekly'
    | 'xPrizesMonthly'
    | 'xPrizesYearly'
  >
) => {
  // "Every X Days/Weeks/Months/Years" format:
  if (format === 'everyXdays' || format === undefined) {
    if (data.frequency !== 0) {
      const x = Math.round(data.frequency)
      if (data.unit === TimeUnit.day) {
        if (data.frequency < 1.5) {
          const prizesDaily = Math.round(1 / data.frequency)
          if (prizesDaily > 1) {
            const formattedMultiplier = `${formatNumberForDisplay(prizesDaily)}x`
            return `${formattedMultiplier} ${intl?.('daily')}` ?? `${formattedMultiplier} Daily`
          } else {
            return intl?.('daily') ?? `Daily`
          }
        } else {
          return intl?.('everyXdays', { number: x }) ?? `Every ${x} days`
        }
      } else if (data.unit === TimeUnit.week) {
        return intl?.('everyXweeks', { number: x }) ?? `Every ${x} weeks`
      } else if (data.unit === TimeUnit.month) {
        return intl?.('everyXmonths', { number: x }) ?? `Every ${x} months`
      } else {
        return intl?.('everyXyears', { number: x }) ?? `Every ${x} years`
      }
    }
  }

  // "X Prize(s) Daily/Weekly/Monthly/Yearly" format:
  if (format === 'daily') {
    if (data.frequency !== 0) {
      let perUnitFreq = 1 / data.frequency

      if (data.unit === TimeUnit.day) {
        if (perUnitFreq >= 1.5) {
          const x = Math.round(perUnitFreq)
          return intl?.('xPrizesDaily', { number: x }) ?? `${x} prizes daily`
        } else if (perUnitFreq >= 6.5 / 7) {
          return intl?.('xPrizesDaily', { number: 1 }) ?? `1 prize daily`
        } else {
          perUnitFreq *= 7
          data.unit = TimeUnit.week
        }
      }

      if (data.unit === TimeUnit.week) {
        if (perUnitFreq >= 1.5) {
          const x = Math.round(perUnitFreq)
          return intl?.('xPrizesWeekly', { number: x }) ?? `${x} prizes weekly`
        } else if (perUnitFreq >= 3.5 / (365 / 12 / 7)) {
          return intl?.('xPrizesWeekly', { number: 1 }) ?? `1 prize weekly`
        } else {
          perUnitFreq *= 365 / 12 / 7
          data.unit = TimeUnit.month
        }
      }

      if (data.unit === TimeUnit.month) {
        if (perUnitFreq >= 1.5) {
          const x = Math.round(perUnitFreq)
          return intl?.('xPrizesMonthly', { number: x }) ?? `${x} prizes monthly`
        } else if (perUnitFreq >= 11.5 / 12) {
          return intl?.('xPrizesMonthly', { number: 1 }) ?? `1 prize monthly`
        } else {
          perUnitFreq *= 12
          data.unit = TimeUnit.year
        }
      }

      if (data.unit === TimeUnit.year) {
        if (perUnitFreq >= 1.5 || perUnitFreq < 1) {
          const x = Math.round(perUnitFreq)
          return intl?.('xPrizesYearly', { number: x }) ?? `${x} prizes yearly`
        } else {
          return intl?.('xPrizesYearly', { number: 1 }) ?? `1 prize yearly`
        }
      }
    }
  }

  return null
}

/**
 * Returns countdown text for any given timestamp
 * @param timestamp timestamp to countdown to
 * @param intl optional localization
 * @returns
 */
export const getCountdownTextFromTimestamp = (
  timestamp: number,
  intl?: Intl<'lessThanAnHour' | 'inXhours' | 'inXdays' | 'inXweeks' | 'inXmonths'>
) => {
  const currentTimestamp = getSecondsSinceEpoch()

  if (timestamp > currentTimestamp) {
    const { years, days, hours } = getTimeBreakdown(timestamp - currentTimestamp)
    const months = Math.floor(years * 12 + days / (365 / 12))
    const weeks = Math.floor(days / 7)

    if (months > 0) {
      return (
        intl?.('inXmonths', { number: months }) ?? `In ${months} month${months === 1 ? '' : 's'}`
      )
    } else if (weeks > 0) {
      return intl?.('inXweeks', { number: weeks }) ?? `In ${weeks} week${weeks === 1 ? '' : 's'}`
    } else if (days > 0) {
      return intl?.('inXdays', { number: days }) ?? `In ${days} day${days === 1 ? '' : 's'}`
    } else if (hours > 0) {
      return intl?.('inXhours', { number: hours }) ?? `In ${hours} hour${hours === 1 ? '' : 's'}`
    } else {
      return intl?.('lessThanAnHour') ?? `In less than an hour`
    }
  }

  return null
}

/**
 * Returns a simple date showing month and day in UTC
 * @param timestamp timestamp in seconds
 */
export const getSimpleDate = (timestamp: number) => {
  return new Date(timestamp * 1e3).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  })
}

/**
 * Returns a simple time showing hours and minutes in the current locale
 * @param timestamp timestamp in seconds
 * @returns
 */
export const getSimpleTime = (timestamp: number) => {
  return new Date(timestamp * 1e3).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false
  })
}
