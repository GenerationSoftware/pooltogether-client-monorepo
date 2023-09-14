import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useFirstDrawStartTimestamp,
  usePrizeDrawTimestamps
} from '@generationsoftware/hyperstructure-react-hooks'
import { RNG_AUCTION } from '@shared/utilities'
import { useMemo } from 'react'
import { Address, formatUnits } from 'viem'
import { useRelayAuctionEvents } from './useRelayAuctionEvents'
import { useRngAuctionEvents } from './useRngAuctionEvents'

interface RngTx {
  drawId: number
  feePercentage: number
  feeRecipient: Address
  hash: `0x${string}`
  fee?: bigint
}

interface RelayTx {
  drawId: number
  fee: bigint
  feeRecipient: Address
  hash: `0x${string}`
}

export const useRngTxs = (prizePool: PrizePool) => {
  const { data: rngAuctionEvents, isFetched: isFetchedRngAuctionEvents } = useRngAuctionEvents()
  const { data: relayAuctionEvents, isFetched: isFetchedRelayAuctionEvents } =
    useRelayAuctionEvents(prizePool)

  const { data: drawTimestamps, isFetched: isFetchedDrawTimestamps } =
    usePrizeDrawTimestamps(prizePool)

  const { data: firstDrawStartTimestamp, isFetched: isFetchedFirstDrawStartTimestamp } =
    useFirstDrawStartTimestamp(prizePool)

  const data = useMemo(() => {
    if (
      !!rngAuctionEvents &&
      !!relayAuctionEvents &&
      !!drawTimestamps &&
      !!firstDrawStartTimestamp
    ) {
      const rngTxs = drawTimestamps
        .map((draw, i) => {
          const drawPeriod = prizePool.drawPeriodInSeconds as number
          const drawEndedAt =
            i > 0
              ? draw.firstClaim ?? drawTimestamps[i - 1].firstClaim + drawPeriod // TODO: this should use `draw.endedAt`, not `draw.firstClaim` (both cases)
              : firstDrawStartTimestamp + drawPeriod
          const sequenceId = Math.floor(
            (drawEndedAt - RNG_AUCTION.sequenceOffset) / RNG_AUCTION.sequencePeriod
          )
          const rngAuctionEvent = rngAuctionEvents.find(
            (event) => event.args.sequenceId === sequenceId
          )

          if (!!rngAuctionEvent) {
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
              drawId: draw.id,
              feePercentage: parseFloat(formatUnits(rngAuctionEvent.args.rewardFraction, 18)) * 100,
              feeRecipient: rngAuctionEvent.args.recipient,
              hash: rngAuctionEvent.transactionHash,
              fee: firstRelayEvent?.args.reward
            }

            const relay: RelayTx | undefined = !!secondRelayEvent
              ? {
                  drawId: draw.id,
                  fee: secondRelayEvent.args.reward,
                  feeRecipient: secondRelayEvent.args.recipient,
                  hash: secondRelayEvent.transactionHash
                }
              : undefined

            return { rng, relay }
          }
        })
        .filter((tx) => !!tx) as { rng: RngTx; relay?: RelayTx }[]

      if (rngAuctionEvents.length > drawTimestamps.length) {
        const rngAuctionEvent = rngAuctionEvents[rngAuctionEvents.length - 1]
        rngTxs.push({
          rng: {
            drawId: drawTimestamps[drawTimestamps.length - 1].id + 1,
            feePercentage: parseFloat(formatUnits(rngAuctionEvent.args.rewardFraction, 18)) * 100,
            feeRecipient: rngAuctionEvent.args.recipient,
            hash: rngAuctionEvent.transactionHash
          }
        })
      }

      return rngTxs
    }
  }, [rngAuctionEvents, relayAuctionEvents, drawTimestamps, firstDrawStartTimestamp])

  const isFetched =
    isFetchedRngAuctionEvents &&
    isFetchedRelayAuctionEvents &&
    isFetchedDrawTimestamps &&
    isFetchedFirstDrawStartTimestamp

  return { data, isFetched }
}
