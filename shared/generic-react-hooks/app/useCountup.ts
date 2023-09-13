import { getTimeBreakdown, msToS, sToMs } from '@shared/utilities'
import { useEffect, useState } from 'react'

/**
 * Returns days, hours, minutes and seconds since a given epoch timestamp
 * @param sourceEpochTimestampInSeconds epoch timestamp in seconds
 * @returns
 */
export const useCountup = (sourceEpochTimestampInSeconds: number) => {
  const sourceTimestampInMs = new Date(sToMs(sourceEpochTimestampInSeconds ?? 0)).getTime()
  const [countupInMs, setCountupInMs] = useState(new Date().getTime() - sourceTimestampInMs)

  useEffect(() => {
    if (sourceTimestampInMs > 0) {
      setCountupInMs(new Date().getTime() - sourceTimestampInMs)

      const interval = setInterval(() => {
        setCountupInMs(new Date().getTime() - sourceTimestampInMs)
      }, 1_000)

      return () => clearInterval(interval)
    }
  }, [sourceTimestampInMs])

  if (countupInMs > 0) {
    return getTimeBreakdown(msToS(countupInMs))
  } else {
    return { years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }
  }
}
