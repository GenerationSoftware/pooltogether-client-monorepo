import { getSecondsSinceEpoch, PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { useMemo } from 'react'
import { useAllDrawPeriods, useAllFirstDrawOpenedAt } from '..'

// TODO: need to be able to set refetch interval or manual refetch
/**
 * Returns any prize pools' draw IDs
 * @param prizePool array of instances of the `PrizePool` class
 * @param options optional settings
 * @returns
 */
export const useAllDrawIds = (prizePools: PrizePool[], options?: { until?: number }) => {
  const { data: allFirstDrawOpenedAt, isFetched: isFetchedAllFirstDrawOpenedAt } =
    useAllFirstDrawOpenedAt(prizePools)

  const { data: allDrawPeriods, isFetched: isFetchedAllDrawPeriods } = useAllDrawPeriods(prizePools)

  const data = useMemo(() => {
    const allDrawIds: { [prizePoolId: string]: number[] } = {}
    if (!!Object.keys(allFirstDrawOpenedAt).length && !!Object.keys(allDrawPeriods).length) {
      const timestamp = options?.until ?? getSecondsSinceEpoch()
      for (const prizePoolId in allFirstDrawOpenedAt) {
        const firstDrawOpenedAt = allFirstDrawOpenedAt[prizePoolId]
        const drawPeriod = allDrawPeriods[prizePoolId]
        if (!!firstDrawOpenedAt && !!drawPeriod) {
          allDrawIds[prizePoolId] = []
          for (let i = firstDrawOpenedAt; i < timestamp; i += drawPeriod) {
            allDrawIds[prizePoolId].push(allDrawIds[prizePoolId].length + 1)
          }
        }
      }
    }
    return allDrawIds
  }, [allFirstDrawOpenedAt, allDrawPeriods])

  const isFetched = isFetchedAllFirstDrawOpenedAt && isFetchedAllDrawPeriods

  return { data, isFetched }
}
