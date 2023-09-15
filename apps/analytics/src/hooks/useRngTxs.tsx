import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { usePrizeDrawTimestamps } from '@generationsoftware/hyperstructure-react-hooks'
import { RNG_AUCTION } from '@shared/utilities'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useRelayAuctionEvents } from './useRelayAuctionEvents'
import { useRngAuctionEvents } from './useRngAuctionEvents'

interface RngTx {
  drawId: number
  fee?: bigint
  feeFraction: bigint
  feeRecipient: Address
  hash: `0x${string}`
  block: bigint
}

interface RelayTx {
  drawId: number
  fee: bigint
  feeFraction?: bigint
  feeRecipient: Address
  hash: `0x${string}`
  endedAt: number
  block: bigint
}

export const useRngTxs = (prizePool: PrizePool) => {
  const { data: rngAuctionEvents, isFetched: isFetchedRngAuctionEvents } = useRngAuctionEvents()
  const { data: relayAuctionEvents, isFetched: isFetchedRelayAuctionEvents } =
    useRelayAuctionEvents(prizePool)

  const { data: drawTimestamps, isFetched: isFetchedDrawTimestamps } =
    usePrizeDrawTimestamps(prizePool)

  const data = useMemo(() => {
    if (!!rngAuctionEvents && !!relayAuctionEvents && !!drawTimestamps) {
      const rngTxs = rngAuctionEvents
        .map((rngAuctionEvent, i) => {
          const periodStart =
            RNG_AUCTION.sequenceOffset +
            RNG_AUCTION.sequencePeriod * rngAuctionEvent.args.sequenceId
          const periodEnd = periodStart + RNG_AUCTION.sequencePeriod

          const lastDrawId = drawTimestamps[drawTimestamps.length - 1].id
          let drawId = drawTimestamps.find(
            (draw) => draw.firstClaim > periodStart && draw.firstClaim < periodEnd // TODO: should be `draw.endedAt` (both cases)
          )?.id
          if (!drawId && i === rngAuctionEvents.length - 1) {
            drawId = lastDrawId + 1
          }

          if (!!drawId) {
            const relevantRelayAuctionEvents = relayAuctionEvents.filter(
              (event) => event.args.sequenceId === rngAuctionEvent.args.sequenceId
            )
            const firstRelayEvent = relevantRelayAuctionEvents.find(
              (event) => event.args.index === 0
            )
            const secondRelayEvent = relevantRelayAuctionEvents.find(
              (event) => event.args.index === 1
            )

            const rng: RngTx = {
              drawId: drawId,
              fee: firstRelayEvent?.args.reward,
              feeFraction: rngAuctionEvent.args.rewardFraction,
              feeRecipient: rngAuctionEvent.args.recipient,
              hash: rngAuctionEvent.transactionHash,
              block: rngAuctionEvent.blockNumber
            }

            const relay: RelayTx | undefined = !!secondRelayEvent
              ? {
                  drawId: drawId,
                  fee: secondRelayEvent.args.reward,
                  feeFraction: !!rng.fee
                    ? secondRelayEvent.args.reward / (rng.fee / rng.feeFraction)
                    : undefined,
                  feeRecipient: secondRelayEvent.args.recipient,
                  hash: secondRelayEvent.transactionHash,
                  endedAt: periodStart,
                  block: secondRelayEvent.blockNumber
                }
              : undefined

            return { rng, relay }
          }
        })
        .filter((tx) => !!tx) as { rng: RngTx; relay?: RelayTx }[]

      return rngTxs
    }
  }, [rngAuctionEvents, relayAuctionEvents, drawTimestamps])

  const isFetched =
    isFetchedRngAuctionEvents && isFetchedRelayAuctionEvents && isFetchedDrawTimestamps

  return { data, isFetched }
}
