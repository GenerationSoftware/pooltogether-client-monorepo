import { PrizePool } from '@pooltogether/hyperstructure-client-js'
import { msToS, sToMs } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { NO_REFETCH, useDrawPeriod } from '..'
import { QUERY_KEYS } from '../constants'

/**
 * Returns the start and end timestamps of a prize pool's next draw (in seconds)
 * @param prizePool instance of the `PrizePool` class
 * @returns
 */
export const useNextDrawTimestamps = (prizePool: PrizePool) => {
  const [nextDrawStartTimestamp, setNextDrawStartTimestamp] = useState<number>(0)

  const { data: drawPeriod, isFetched: isFetchedDrawPeriod } = useDrawPeriod(prizePool)

  const queryKey = [QUERY_KEYS.nextDrawTimestamp, prizePool?.id]

  const { data: _nextDrawStartTimestamp, isFetched: isFetchedNextDrawStartTimestamp } = useQuery(
    queryKey,
    async () => {
      const timestamp = await prizePool.getNextDrawStartTimestamp()
      setNextDrawStartTimestamp(timestamp)
      return timestamp
    },
    {
      enabled: !!prizePool,
      ...NO_REFETCH
    }
  )

  const isFetched =
    isFetchedDrawPeriod &&
    isFetchedNextDrawStartTimestamp &&
    !!drawPeriod &&
    !!_nextDrawStartTimestamp &&
    !!nextDrawStartTimestamp

  useEffect(() => {
    if (!!drawPeriod && !!_nextDrawStartTimestamp) {
      const currentTime = new Date().getTime()
      const timeUntilUpdate = sToMs(nextDrawStartTimestamp) - currentTime
      if (timeUntilUpdate > 0) {
        setTimeout(() => {
          const timeDiff = currentTime + timeUntilUpdate - sToMs(_nextDrawStartTimestamp)
          const updateCount = timeDiff >= 0 ? Math.floor(msToS(timeDiff) / drawPeriod) : 0
          const newNextDrawStartTimestamp = _nextDrawStartTimestamp + drawPeriod * (updateCount + 1)
          setNextDrawStartTimestamp(newNextDrawStartTimestamp)
        }, timeUntilUpdate)
      } else {
        setNextDrawStartTimestamp(_nextDrawStartTimestamp + drawPeriod)
      }
    }
  }, [drawPeriod, _nextDrawStartTimestamp, nextDrawStartTimestamp])

  if (isFetched) {
    const data = { start: nextDrawStartTimestamp, end: nextDrawStartTimestamp + drawPeriod }
    return { data, isFetched }
  } else {
    return { isFetched }
  }
}
