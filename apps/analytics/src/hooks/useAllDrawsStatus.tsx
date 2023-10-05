import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { useFirstDrawStartTimestamp } from '@generationsoftware/hyperstructure-react-hooks'
import { getSecondsSinceEpoch } from '@shared/utilities'
import { useMemo } from 'react'
import { DrawStatus } from './useDrawStatus'
import { useRngTxs } from './useRngTxs'

export const useAllDrawsStatus = (prizePool: PrizePool, drawIds: number[]) => {
  const { data: firstDrawOpenedAt, isFetched: isFetchedFirstDrawOpenedAt } =
    useFirstDrawStartTimestamp(prizePool)

  const { data: allRngTxs, isFetched: isFetchedAllRngTxs } = useRngTxs(prizePool)

  const data = useMemo(() => {
    if (!!firstDrawOpenedAt && !!allRngTxs) {
      const allDrawsStatus: {
        id: number
        status: DrawStatus
        openedAt: number
        endedAt?: number
        closedAt?: number
        periodsSkipped: number
      }[] = []

      drawIds.forEach((drawId) => {
        const rngTxs = allRngTxs.find((txs) => txs.rng.drawId === drawId)
        const prevRngTxs = allRngTxs.find((txs) => txs.rng.drawId === drawId - 1)

        const openedAt = prevRngTxs?.relay.l2?.endedAt ?? firstDrawOpenedAt
        const endedAt = rngTxs?.relay.l2?.endedAt
        const closedAt = rngTxs?.relay.l2?.timestamp

        const timeSinceEnded = !!endedAt ? getSecondsSinceEpoch() - endedAt : -1
        const drawPeriod = prizePool.drawPeriodInSeconds as number
        const isFinalized = timeSinceEnded > drawPeriod

        const status: DrawStatus = isFinalized ? 'finalized' : !!closedAt ? 'closed' : 'open'
        const periodsSkipped = !!endedAt ? Math.floor((endedAt - openedAt - 1) / drawPeriod) : 0

        allDrawsStatus.push({ id: drawId, status, openedAt, endedAt, closedAt, periodsSkipped })
      })

      return allDrawsStatus
    }
  }, [drawIds, firstDrawOpenedAt, allRngTxs])

  const isFetched = isFetchedFirstDrawOpenedAt && isFetchedAllRngTxs

  return { data, isFetched }
}
