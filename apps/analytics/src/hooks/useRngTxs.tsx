import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useBlocks,
  useDrawManagerDrawAwardedEvents,
  usePrizePoolDrawAwardedEvents,
  useRngAuctionCompletedEvents
} from '@generationsoftware/hyperstructure-react-hooks'
import { useMemo } from 'react'
import { Address } from 'viem'
import { QUERY_START_BLOCK } from '@constants/config'

export interface RngAuctionTx {
  drawId: number
  reward?: bigint
  rewardRecipient: Address
  hash: `0x${string}`
  blockNumber: bigint
  timestamp?: number
}

export interface DrawAwardTx {
  drawId: number
  reward: bigint
  rewardRecipient: Address
  reserve: bigint
  remainingReserve: bigint
  lastNumTiers: number
  numTiers: number
  hash: `0x${string}`
  blockNumber: bigint
  timestamp?: number
}

export const useRngTxs = (prizePool: PrizePool) => {
  const fromBlock = !!prizePool ? QUERY_START_BLOCK[prizePool.chainId] : undefined

  const {
    data: rngAuctionCompletedEvents,
    isFetched: isFetchedRngAuctionCompletedEvents,
    refetch: refetchRngAuctionCompletedEvents
  } = useRngAuctionCompletedEvents(prizePool, { fromBlock })
  const {
    data: prizePoolDrawAwardedEvents,
    isFetched: isFetchedPrizePoolDrawAwardedEvents,
    refetch: refetchPrizePoolDrawAwardedEvents
  } = usePrizePoolDrawAwardedEvents(prizePool, { fromBlock })
  const {
    data: drawManagerDrawAwardedEvents,
    isFetched: isFetchedDrawManagerDrawAwardedEvents,
    refetch: refetchDrawManagerDrawAwardedEvents
  } = useDrawManagerDrawAwardedEvents(prizePool, { fromBlock })

  const rngAuctionCompletedBlockNumbers = new Set<bigint>(
    rngAuctionCompletedEvents?.map((e) => e.blockNumber) ?? []
  )
  const drawAwardedBlockNumbers = new Set<bigint>(
    prizePoolDrawAwardedEvents?.map((e) => e.blockNumber) ?? []
  )

  const { data: rngAuctionCompletedBlocks, isFetched: isFetchedRngAuctionCompletedBlocks } =
    useBlocks(prizePool?.chainId, [...rngAuctionCompletedBlockNumbers])
  const { data: drawAwardedBlocks, isFetched: isFetchedDrawAwardedBlocks } = useBlocks(
    prizePool?.chainId,
    [...drawAwardedBlockNumbers]
  )

  const data = useMemo(() => {
    if (
      !!rngAuctionCompletedEvents &&
      !!prizePoolDrawAwardedEvents &&
      !!drawManagerDrawAwardedEvents &&
      !!rngAuctionCompletedBlocks &&
      !!drawAwardedBlocks
    ) {
      const rngTxs = rngAuctionCompletedEvents
        .map((rngAuctionCompletedEvent) => {
          const drawId = rngAuctionCompletedEvent.args.drawId

          const rngAuctionCompletedBlock = rngAuctionCompletedBlocks.find(
            (block) => block.number === rngAuctionCompletedEvent.blockNumber
          )

          const rngAuction: RngAuctionTx = {
            drawId,
            rewardRecipient: rngAuctionCompletedEvent.args.recipient,
            hash: rngAuctionCompletedEvent.transactionHash,
            blockNumber: rngAuctionCompletedEvent.blockNumber,
            timestamp: !!rngAuctionCompletedBlock
              ? Number(rngAuctionCompletedBlock.timestamp)
              : undefined
          }

          let drawAward: DrawAwardTx | undefined = undefined

          const prizePoolDrawAwardedEvent = prizePoolDrawAwardedEvents.find(
            (e) => e.args.drawId === drawId
          )

          if (!!prizePoolDrawAwardedEvent) {
            const drawManagerDrawAwardedEvent = drawManagerDrawAwardedEvents.find(
              (e) => e.args.drawId === drawId
            )

            if (!!drawManagerDrawAwardedEvent) {
              const drawAwardedBlock = drawAwardedBlocks.find(
                (block) => block.number === prizePoolDrawAwardedEvent.blockNumber
              )

              drawAward = {
                drawId,
                reward: drawManagerDrawAwardedEvent.args.awardReward,
                rewardRecipient: drawManagerDrawAwardedEvent.args.awardRecipient,
                reserve: prizePoolDrawAwardedEvent.args.reserve,
                remainingReserve: drawManagerDrawAwardedEvent.args.remainingReserve,
                lastNumTiers: prizePoolDrawAwardedEvent.args.lastNumTiers,
                numTiers: prizePoolDrawAwardedEvent.args.numTiers,
                hash: prizePoolDrawAwardedEvent.transactionHash,
                blockNumber: prizePoolDrawAwardedEvent.blockNumber,
                timestamp: !!drawAwardedBlock ? Number(drawAwardedBlock.timestamp) : undefined
              }

              rngAuction.reward = drawManagerDrawAwardedEvent.args.startReward
            }
          }

          return { rngAuction, drawAward }
        })
        .filter((tx) => !!tx)

      return rngTxs
    }
  }, [
    rngAuctionCompletedEvents,
    prizePoolDrawAwardedEvents,
    drawManagerDrawAwardedEvents,
    rngAuctionCompletedBlocks,
    drawAwardedBlocks
  ])

  const isFetched =
    isFetchedRngAuctionCompletedEvents &&
    isFetchedPrizePoolDrawAwardedEvents &&
    isFetchedDrawManagerDrawAwardedEvents &&
    isFetchedRngAuctionCompletedBlocks &&
    isFetchedDrawAwardedBlocks

  const refetch = () => {
    refetchRngAuctionCompletedEvents()
    refetchPrizePoolDrawAwardedEvents()
    refetchDrawManagerDrawAwardedEvents()
  }

  return { data, isFetched, refetch }
}
