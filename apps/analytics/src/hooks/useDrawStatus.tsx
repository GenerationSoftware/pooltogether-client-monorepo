import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { useDrawPeriod, useFirstDrawOpenedAt } from '@generationsoftware/hyperstructure-react-hooks'
import { DrawStatus } from '@shared/types'
import { getSecondsSinceEpoch, SECONDS_PER_HOUR } from '@shared/utilities'
import { useMemo } from 'react'
import { useRngTxs } from './useRngTxs'

// TODO: need to be able to set refetch interval or manual refetch
export const useDrawStatus = (prizePool: PrizePool, drawId: number) => {
  const { data: firstDrawOpenedAt, isFetched: isFetchedFirstDrawOpenedAt } =
    useFirstDrawOpenedAt(prizePool)

  const { data: drawPeriod, isFetched: isFetchedDrawPeriod } = useDrawPeriod(prizePool)

  const { data: allRngTxs, isFetched: isFetchedAllRngTxs } = useRngTxs(prizePool)

  const isFetched =
    !!drawId && isFetchedFirstDrawOpenedAt && isFetchedDrawPeriod && isFetchedAllRngTxs

  const data = useMemo(() => {
    if (isFetched && !!firstDrawOpenedAt && !!drawPeriod && !!allRngTxs) {
      const rngTxs = allRngTxs.find((txs) => txs.rngAuction.drawId === drawId)

      const openedAt = firstDrawOpenedAt + drawPeriod * (drawId - 1)
      const closedAt = openedAt + drawPeriod
      const rngCompletedAt = rngTxs?.rngAuction.timestamp
      const awardedAt = rngTxs?.drawAward?.timestamp
      const finalizedAt = closedAt + drawPeriod

      const currentTime = getSecondsSinceEpoch()
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

      return {
        status,
        openedAt,
        closedAt,
        awardedAt,
        finalizedAt,
        isSkipped
      }
    }
  }, [drawId, firstDrawOpenedAt, drawPeriod, allRngTxs, isFetched])

  return { ...data, isFetched }
}
