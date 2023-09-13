import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useFirstDrawStartTimestamp,
  usePrizeDrawTimestamps
} from '@generationsoftware/hyperstructure-react-hooks'
import { useMemo } from 'react'

type DrawStatus = 'open' | 'closed' | 'finalized'

export const useDrawStatus = (
  prizePool: PrizePool,
  drawId: number
): {
  status?: DrawStatus
  openedAt?: number
  closedAt?: number
  periodsSkipped?: number
  isFetched: boolean
} => {
  const { data: allDrawTimestamps, isFetched: isFetchedAllDrawTimestamps } =
    usePrizeDrawTimestamps(prizePool)

  const { data: firstDrawOpenedAt, isFetched: isFetchedFirstDrawOpenedAt } =
    useFirstDrawStartTimestamp(prizePool)

  // TODO: this data needs to be dynamic - if a draw is closed or another period goes by without closing this data should update (need to watch txs? or just periodically refetch?)
  const data = useMemo(() => {
    if (!!allDrawTimestamps && !!firstDrawOpenedAt) {
      const drawTimestamps = allDrawTimestamps?.find((draw) => draw.id === drawId)
      const lastDrawTimestamps = allDrawTimestamps?.find((draw) => draw.id === drawId - 1)

      const openedAt = lastDrawTimestamps?.lastClaim ?? firstDrawOpenedAt // TODO: this should be the endedAt timestamp for the last draw
      const closedAt = drawTimestamps?.firstClaim // TODO: this should be the endedAt timestamp for the draw

      const timeSinceClosed = !!closedAt ? Date.now() / 1000 - closedAt : -1
      const drawPeriod = prizePool.drawPeriodInSeconds as number
      const isFinalized = timeSinceClosed > drawPeriod

      const status: DrawStatus = isFinalized ? 'finalized' : !!closedAt ? 'closed' : 'open'
      const periodsSkipped = !!closedAt ? Math.floor((closedAt - openedAt) / drawPeriod) : 0

      return { status, openedAt, closedAt, periodsSkipped }
    }
  }, [allDrawTimestamps, firstDrawOpenedAt])

  const isFetched = isFetchedAllDrawTimestamps && isFetchedFirstDrawOpenedAt

  return { ...data, isFetched }
}
