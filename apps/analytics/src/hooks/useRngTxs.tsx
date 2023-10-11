import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { RNG_AUCTION } from '@shared/utilities'
import { useMemo } from 'react'
import { Address } from 'viem'
import { RELAY_ORIGINS } from '@constants/config'
import { useBlocks } from './useBlocks'
import { useDrawAwardedEvents } from './useDrawAwardedEvents'
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
  closedAt: number
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
  const { data: rngAuctionEvents, isFetched: isFetchedRngAuctionEvents } =
    useRngAuctionEvents(prizePool)
  const { data: relayAuctionEvents, isFetched: isFetchedRelayAuctionEvents } =
    useRelayAuctionEvents(prizePool)

  const { data: drawAwardedEvents, isFetched: isFetchedDrawAwardedEvents } =
    useDrawAwardedEvents(prizePool)
  const drawAwardedBlockNumbers = new Set<bigint>(
    drawAwardedEvents?.map((e) => e.blockNumber) ?? []
  )

  const { data: drawAwardedBlocks, isFetched: isFetchedDrawAwardedBlocks } = useBlocks(
    prizePool?.chainId,
    [...drawAwardedBlockNumbers]
  )

  const { data: rngL1RelayMsgEvents, isFetched: isFetchedRngL1RelayMsgEvents } =
    useRngL1RelayMsgEvents(prizePool)
  const { data: rngL2RelayMsgEvents, isFetched: isFetchedRngL2RelayMsgEvents } =
    useRngL2RelayMsgEvents(prizePool)

  const originChainId = !!prizePool ? RELAY_ORIGINS[prizePool.chainId] : undefined

  const data = useMemo(() => {
    if (
      !!rngAuctionEvents &&
      !!relayAuctionEvents &&
      !!drawAwardedEvents &&
      !!drawAwardedBlocks &&
      !!rngL1RelayMsgEvents &&
      !!rngL2RelayMsgEvents &&
      !!originChainId
    ) {
      const rngTxs = rngAuctionEvents
        .map((rngAuctionEvent, i) => {
          const periodStart =
            RNG_AUCTION[originChainId].sequenceOffset +
            RNG_AUCTION[originChainId].sequencePeriod * rngAuctionEvent.args.sequenceId
          const periodEnd = periodStart + RNG_AUCTION[originChainId].sequencePeriod

          const drawAwardedBlock = drawAwardedBlocks.find(
            (block) => block.timestamp > periodStart && block.timestamp < periodEnd
          )

          const lastDrawId = drawAwardedEvents[drawAwardedEvents.length - 1].args.drawId
          const drawAwardedEvent = drawAwardedEvents.find(
            (e) => e.blockNumber === drawAwardedBlock?.number
          )
          let drawId = drawAwardedEvent?.args.drawId
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
                !!secondRelayEvent && !!drawAwardedEvent && !!drawAwardedBlock
                  ? {
                      drawId: drawId,
                      fee: secondRelayEvent.args.reward,
                      feeFraction: !!rng.fee
                        ? secondRelayEvent.args.reward / (rng.fee / rng.feeFraction)
                        : undefined,
                      feeRecipient: secondRelayEvent.args.recipient,
                      reserve: drawAwardedEvent.args.reserve,
                      hash: secondRelayEvent.transactionHash,
                      closedAt: periodStart,
                      blockNumber: secondRelayEvent.blockNumber,
                      timestamp: Number(drawAwardedBlock.timestamp)
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
    drawAwardedEvents,
    drawAwardedBlocks,
    rngL1RelayMsgEvents,
    rngL2RelayMsgEvents
  ])

  const isFetched =
    isFetchedRngAuctionEvents &&
    isFetchedRelayAuctionEvents &&
    isFetchedDrawAwardedEvents &&
    isFetchedDrawAwardedBlocks &&
    isFetchedRngL1RelayMsgEvents &&
    isFetchedRngL2RelayMsgEvents

  return { data, isFetched }
}
