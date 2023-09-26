import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { RNG_AUCTION } from '@shared/utilities'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useBlocks } from './useBlocks'
import { useDrawClosedEvents } from './useDrawClosedEvents'
import { useRelayAuctionEvents } from './useRelayAuctionEvents'
import { useRngAuctionEvents } from './useRngAuctionEvents'

interface RngTx {
  drawId: number
  fee?: bigint
  feeFraction: bigint
  feeRecipient: Address
  hash: `0x${string}`
  blockNumber: bigint
}

interface RelayTx {
  drawId: number
  fee: bigint
  feeFraction?: bigint
  feeRecipient: Address
  hash: `0x${string}`
  endedAt: number
  blockNumber: bigint
}

export const useRngTxs = (prizePool: PrizePool) => {
  const { data: rngAuctionEvents, isFetched: isFetchedRngAuctionEvents } = useRngAuctionEvents()
  const { data: relayAuctionEvents, isFetched: isFetchedRelayAuctionEvents } =
    useRelayAuctionEvents(prizePool)

  const { data: drawClosedEvents, isFetched: isFetchedDrawClosedEvents } =
    useDrawClosedEvents(prizePool)
  const drawClosedBlockNumbers = new Set<bigint>(drawClosedEvents?.map((e) => e.blockNumber) ?? [])

  const { data: drawClosedBlocks, isFetched: isFetchedDrawClosedBlocks } = useBlocks(
    prizePool?.chainId,
    [...drawClosedBlockNumbers]
  )

  const data = useMemo(() => {
    if (!!rngAuctionEvents && !!relayAuctionEvents && !!drawClosedEvents && !!drawClosedBlocks) {
      const rngTxs = rngAuctionEvents
        .map((rngAuctionEvent, i) => {
          const periodStart =
            RNG_AUCTION.sequenceOffset +
            RNG_AUCTION.sequencePeriod * rngAuctionEvent.args.sequenceId
          const periodEnd = periodStart + RNG_AUCTION.sequencePeriod

          const drawClosedBlock = drawClosedBlocks.find(
            (block) => block.timestamp > periodStart && block.timestamp < periodEnd
          )

          const lastDrawId = drawClosedEvents[drawClosedEvents.length - 1].args.drawId
          let drawId = drawClosedEvents.find((e) => e.blockNumber === drawClosedBlock?.number)?.args
            .drawId
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
              blockNumber: rngAuctionEvent.blockNumber
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
                  blockNumber: secondRelayEvent.blockNumber
                }
              : undefined

            return { rng, relay }
          }
        })
        .filter((tx) => !!tx) as { rng: RngTx; relay?: RelayTx }[]

      return rngTxs
    }
  }, [rngAuctionEvents, relayAuctionEvents, drawClosedEvents, drawClosedBlocks])

  const isFetched =
    isFetchedRngAuctionEvents &&
    isFetchedRelayAuctionEvents &&
    isFetchedDrawClosedEvents &&
    isFetchedDrawClosedBlocks

  return { data, isFetched }
}
