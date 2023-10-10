import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NETWORK, RNG_AUCTION } from '@shared/utilities'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useBlocks } from './useBlocks'
import { useDrawClosedEvents } from './useDrawClosedEvents'
import { useRelayAuctionEvents } from './useRelayAuctionEvents'
import { useRngAuctionEvents } from './useRngAuctionEvents'
import { useRngL1RelayMsgEvents } from './useRngL1RelayMsgEvents'
import { useRngL2RelayMsgEvents } from './useRngL2RelayMsgEvents'

export interface RngTx {
  drawId: number
  fee?: bigint
  feeFraction: bigint
  feeRecipient: Address
  hash: `0x${string}`
  blockNumber: bigint
}

export interface RelayTx {
  drawId: number
  fee: bigint
  feeFraction?: bigint
  feeRecipient: Address
  reserve: bigint
  hash: `0x${string}`
  endedAt: number
  blockNumber: bigint
  timestamp: number
}

export interface RelayMsgTx {
  drawId: number
  msgId: `0x${string}`
  hash: `0x${string}`
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

  const { data: rngL1RelayMsgEvents, isFetched: isFetchedRngL1RelayMsgEvents } =
    useRngL1RelayMsgEvents()
  const { data: rngL2RelayMsgEvents, isFetched: isFetchedRngL2RelayMsgEvents } =
    useRngL2RelayMsgEvents(prizePool)

  const data = useMemo(() => {
    if (
      !!rngAuctionEvents &&
      !!relayAuctionEvents &&
      !!drawClosedEvents &&
      !!drawClosedBlocks &&
      !!rngL1RelayMsgEvents &&
      !!rngL2RelayMsgEvents
    ) {
      const rngTxs = rngAuctionEvents
        .map((rngAuctionEvent, i) => {
          const periodStart =
            RNG_AUCTION[NETWORK.mainnet].sequenceOffset +
            RNG_AUCTION[NETWORK.mainnet].sequencePeriod * rngAuctionEvent.args.sequenceId
          const periodEnd = periodStart + RNG_AUCTION[NETWORK.mainnet].sequencePeriod

          const drawClosedBlock = drawClosedBlocks.find(
            (block) => block.timestamp > periodStart && block.timestamp < periodEnd
          )

          const lastDrawId = drawClosedEvents[drawClosedEvents.length - 1].args.drawId
          const drawClosedEvent = drawClosedEvents.find(
            (e) => e.blockNumber === drawClosedBlock?.number
          )
          let drawId = drawClosedEvent?.args.drawId
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

            const relayMsgReceivedEvent = !!secondRelayEvent
              ? rngL2RelayMsgEvents.find(
                  (event) => event.blockNumber === secondRelayEvent.blockNumber
                )
              : undefined
            const relayMsgEvent = !!relayMsgReceivedEvent
              ? rngL1RelayMsgEvents.find(
                  (event) =>
                    Number(event.args.remoteOwnerChainId) === prizePool.chainId &&
                    event.args.messageId.toLowerCase() ===
                      relayMsgReceivedEvent.args.messageId.toLowerCase()
                )
              : undefined

            const rng: RngTx = {
              drawId: drawId,
              fee: firstRelayEvent?.args.reward,
              feeFraction: rngAuctionEvent.args.rewardFraction,
              feeRecipient: rngAuctionEvent.args.recipient,
              hash: rngAuctionEvent.transactionHash,
              blockNumber: rngAuctionEvent.blockNumber
            }

            const relay: { l1?: RelayMsgTx; l2?: RelayTx } = {
              l1: !!relayMsgEvent
                ? {
                    drawId: drawId,
                    msgId: relayMsgEvent.args.messageId,
                    hash: relayMsgEvent.transactionHash,
                    blockNumber: relayMsgEvent.blockNumber
                  }
                : undefined,
              l2:
                !!secondRelayEvent && !!drawClosedEvent && !!drawClosedBlock
                  ? {
                      drawId: drawId,
                      fee: secondRelayEvent.args.reward,
                      feeFraction: !!rng.fee
                        ? secondRelayEvent.args.reward / (rng.fee / rng.feeFraction)
                        : undefined,
                      feeRecipient: secondRelayEvent.args.recipient,
                      reserve: drawClosedEvent.args.reserve,
                      hash: secondRelayEvent.transactionHash,
                      endedAt: periodStart,
                      blockNumber: secondRelayEvent.blockNumber,
                      timestamp: Number(drawClosedBlock.timestamp)
                    }
                  : undefined
            }

            return { rng, relay }
          }
        })
        .filter((tx) => !!tx) as { rng: RngTx; relay: { l1?: RelayMsgTx; l2?: RelayTx } }[]

      return rngTxs
    }
  }, [
    rngAuctionEvents,
    relayAuctionEvents,
    drawClosedEvents,
    drawClosedBlocks,
    rngL1RelayMsgEvents,
    rngL2RelayMsgEvents
  ])

  const isFetched =
    isFetchedRngAuctionEvents &&
    isFetchedRelayAuctionEvents &&
    isFetchedDrawClosedEvents &&
    isFetchedDrawClosedBlocks &&
    isFetchedRngL1RelayMsgEvents &&
    isFetchedRngL2RelayMsgEvents

  return { data, isFetched }
}
