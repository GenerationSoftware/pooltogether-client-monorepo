import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { useDrawPeriod, useFirstDrawOpenedAt } from '@generationsoftware/hyperstructure-react-hooks'
import { DrawStatus } from '@shared/types'
import { getSecondsSinceEpoch, SECONDS_PER_HOUR } from '@shared/utilities'
import { useMemo } from 'react'
import { useRngTxs } from './useRngTxs'

// TODO: need to be able to set refetch interval or manual refetch
export const useAllDrawsStatus = (prizePool: PrizePool, drawIds: number[]) => {
  const { data: firstDrawOpenedAt, isFetched: isFetchedFirstDrawOpenedAt } =
    useFirstDrawOpenedAt(prizePool)

  const { data: drawPeriod, isFetched: isFetchedDrawPeriod } = useDrawPeriod(prizePool)

  const { data: allRngTxs, isFetched: isFetchedAllRngTxs } = useRngTxs(prizePool)

  const data = useMemo(() => {
    if (!!firstDrawOpenedAt && !!drawPeriod && !!allRngTxs) {
      const allDrawsStatus: {
        id: number
        status: DrawStatus
        openedAt: number
        closedAt: number
        awardedAt?: number
        finalizedAt: number
        isSkipped: boolean
      }[] = []

      const currentTime = getSecondsSinceEpoch()

      drawIds.forEach((drawId) => {
        const rngTxs = allRngTxs.find((txs) => txs.rng.drawId === drawId)

        const openedAt = firstDrawOpenedAt + drawPeriod * (drawId - 1)
        const closedAt = openedAt + drawPeriod
        const rngCompletedAt = rngTxs?.rng?.timestamp
        const awardedAt = rngTxs?.relay.l2?.timestamp
        const finalizedAt = closedAt + drawPeriod

        const isClosed = currentTime >= closedAt
        const isAwarded = !!awardedAt
        const isFinalized = isAwarded && currentTime >= finalizedAt

        const status: DrawStatus = isFinalized
          ? 'finalized'
          : isAwarded
          ? 'awarded'
          : isClosed
          ? 'closed'
          : 'open'

        const relayAuctionClosesAt = !!rngCompletedAt
          ? rngCompletedAt + SECONDS_PER_HOUR * 6
          : finalizedAt
        const isSkipped = status === 'closed' && currentTime >= relayAuctionClosesAt

        allDrawsStatus.push({
          id: drawId,
          status,
          openedAt,
          closedAt,
          awardedAt,
          finalizedAt,
          isSkipped
        })
      })

      return allDrawsStatus
    }
  }, [drawIds, firstDrawOpenedAt, allRngTxs])

  const isFetched = isFetchedFirstDrawOpenedAt && isFetchedDrawPeriod && isFetchedAllRngTxs

  return { data, isFetched }
}
