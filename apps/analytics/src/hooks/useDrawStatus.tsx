import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { useFirstDrawStartTimestamp } from '@generationsoftware/hyperstructure-react-hooks'
import { useMemo } from 'react'
import { useRngTxs } from './useRngTxs'

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
  const { data: firstDrawOpenedAt, isFetched: isFetchedFirstDrawOpenedAt } =
    useFirstDrawStartTimestamp(prizePool)

  const { data: allRngTxs, isFetched: isFetchedAllRngTxs } = useRngTxs(prizePool)

  // TODO: this data needs to be dynamic - if a draw is closed or another period goes by without closing this data should update (need to watch txs? or just periodically refetch?)
  const data = useMemo(() => {
    if (!!firstDrawOpenedAt && !!allRngTxs) {
      const rngTxs = allRngTxs.find((txs) => txs.rng.drawId === drawId)
      const prevRngTxs = allRngTxs.find((txs) => txs.rng.drawId === drawId - 1)

      const openedAt = prevRngTxs?.relay?.endedAt ?? firstDrawOpenedAt
      const closedAt = rngTxs?.relay?.endedAt

      const timeSinceClosed = !!closedAt ? Math.floor(Date.now() / 1_000) - closedAt : -1
      const drawPeriod = prizePool.drawPeriodInSeconds as number
      const isFinalized = timeSinceClosed > drawPeriod

      const status: DrawStatus = isFinalized ? 'finalized' : !!closedAt ? 'closed' : 'open'
      const periodsSkipped = !!closedAt ? Math.floor((closedAt - openedAt - 1) / drawPeriod) : 0

      return { status, openedAt, closedAt, periodsSkipped }
    }
  }, [firstDrawOpenedAt, allRngTxs])

  const isFetched = isFetchedFirstDrawOpenedAt && isFetchedAllRngTxs

  return { ...data, isFetched }
}
