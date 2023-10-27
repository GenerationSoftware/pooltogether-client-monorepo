import { getSecondsSinceEpoch, PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { useMemo } from 'react'
import { useDrawPeriod, useFirstDrawOpenedAt } from '..'

// TODO: need to be able to set refetch interval or manual refetch
/**
 * Returns a prize pool's draw IDs
 * @param prizePool instance of the `PrizePool` class
 * @param options optional settings
 * @returns
 */
export const useDrawIds = (prizePool: PrizePool, options?: { until?: number }) => {
  const { data: firstDrawOpenedAt, isFetched: isFetchedFirstDrawOpenedAt } =
    useFirstDrawOpenedAt(prizePool)

  const { data: drawPeriod, isFetched: isFetchedDrawPeriod } = useDrawPeriod(prizePool)

  const data = useMemo(() => {
    const drawIds: number[] = []
    if (!!firstDrawOpenedAt && !!drawPeriod) {
      const timestamp = options?.until ?? getSecondsSinceEpoch()
      for (let i = firstDrawOpenedAt; i < timestamp; i += drawPeriod) {
        drawIds.push(drawIds.length + 1)
      }
    }
    return drawIds
  }, [firstDrawOpenedAt, drawPeriod])

  const isFetched = isFetchedFirstDrawOpenedAt && isFetchedDrawPeriod

  return { data, isFetched }
}
