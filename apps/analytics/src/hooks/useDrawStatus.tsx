import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { useFirstDrawStartTimestamp } from '@generationsoftware/hyperstructure-react-hooks'
import { getSecondsSinceEpoch } from '@shared/utilities'
import { useMemo } from 'react'
import { useBlock } from './useBlock'
import { useDrawClosedEvents } from './useDrawClosedEvents'
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

  const { data: drawClosedEvents, isFetched: isFetchedDrawClosedEvents } =
    useDrawClosedEvents(prizePool)
  const closeEvent = drawClosedEvents?.find((e) => e.args.drawId === drawId)

  const { data: closeBlock, isFetched: isFetchedCloseBlock } = useBlock(
    prizePool?.chainId,
    closeEvent?.blockNumber as bigint
  )

  const { data: allRngTxs, isFetched: isFetchedAllRngTxs } = useRngTxs(prizePool)

  const data = useMemo(() => {
    if (
      !!firstDrawOpenedAt &&
      (!!closeBlock || (!!drawClosedEvents && !closeEvent)) &&
      !!allRngTxs
    ) {
      const rngTxs = allRngTxs.find((txs) => txs.rng.drawId === drawId)
      const prevRngTxs = allRngTxs.find((txs) => txs.rng.drawId === drawId - 1)

      const openedAt = prevRngTxs?.relay.l2?.endedAt ?? firstDrawOpenedAt
      const endedAt = rngTxs?.relay.l2?.endedAt
      const closedAt = !!closeBlock ? Number(closeBlock.timestamp) : undefined

      const timeSinceEnded = !!endedAt ? getSecondsSinceEpoch() - endedAt : -1
      const drawPeriod = prizePool.drawPeriodInSeconds as number
      const isFinalized = timeSinceEnded > drawPeriod

      const status: DrawStatus = isFinalized ? 'finalized' : !!closedAt ? 'closed' : 'open'
      const periodsSkipped = !!endedAt ? Math.floor((endedAt - openedAt - 1) / drawPeriod) : 0

      return { status, openedAt, endedAt, closedAt, periodsSkipped }
    }
  }, [drawId, firstDrawOpenedAt, closeBlock, allRngTxs])

  const isFetched =
    isFetchedFirstDrawOpenedAt &&
    isFetchedDrawClosedEvents &&
    (!closeEvent || isFetchedCloseBlock) &&
    isFetchedAllRngTxs

  return { ...data, isFetched }
}
