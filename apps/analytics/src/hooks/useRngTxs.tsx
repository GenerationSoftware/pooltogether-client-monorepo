import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useBlocks,
  useDrawAwardedEvents,
  useDrawFinishedEvents,
  useDrawStartedEvents
} from '@generationsoftware/hyperstructure-react-hooks'
import { useMemo } from 'react'
import { Address } from 'viem'
import { QUERY_START_BLOCK } from '@constants/config'

export interface DrawStartTx {
  drawId: number
  reward?: bigint
  rewardRecipient: Address
  elapsedTime: number
  hash: `0x${string}`
  blockNumber: bigint
  timestamp?: number
}

export interface DrawFinishTx {
  drawId: number
  reward: bigint
  rewardRecipient: Address
  reserve: bigint
  remainingReserve: bigint
  lastNumTiers: number
  numTiers: number
  elapsedTime: number
  hash: `0x${string}`
  blockNumber: bigint
  timestamp?: number
}

export const useRngTxs = (prizePool: PrizePool) => {
  const fromBlock = !!prizePool ? QUERY_START_BLOCK[prizePool.chainId] : undefined

  const {
    data: drawStartedEvents,
    isFetched: isFetchedDrawStartedEvents,
    refetch: refetchDrawStartedEvents
  } = useDrawStartedEvents(prizePool, { fromBlock })
  const {
    data: drawFinishedEvents,
    isFetched: isFetchedDrawFinishedEvents,
    refetch: refetchDrawFinishedEvents
  } = useDrawFinishedEvents(prizePool, { fromBlock })
  const {
    data: drawAwardedEvents,
    isFetched: isFetchedDrawAwardedEvents,
    refetch: refetchDrawAwardedEvents
  } = useDrawAwardedEvents(prizePool, { fromBlock })

  const drawStartedBlockNumbers = new Set<bigint>(
    drawStartedEvents?.map((e) => e.blockNumber) ?? []
  )
  const drawAwardedBlockNumbers = new Set<bigint>(
    drawAwardedEvents?.map((e) => e.blockNumber) ?? []
  )

  const { data: drawStartedBlocks, isFetched: isFetchedDrawStartedBlocks } = useBlocks(
    prizePool?.chainId,
    [...drawStartedBlockNumbers]
  )
  const { data: drawAwardedBlocks, isFetched: isFetchedDrawAwardedBlocks } = useBlocks(
    prizePool?.chainId,
    [...drawAwardedBlockNumbers]
  )

  const data = useMemo(() => {
    if (
      !!drawStartedEvents &&
      !!drawFinishedEvents &&
      !!drawAwardedEvents &&
      !!drawStartedBlocks &&
      !!drawAwardedBlocks
    ) {
      const rngTxs = drawStartedEvents
        .map((drawStartedEvent) => {
          const drawId = drawStartedEvent.args.drawId

          const drawStartedBlock = drawStartedBlocks.find(
            (block) => block.number === drawStartedEvent.blockNumber
          )

          const drawStart: DrawStartTx = {
            drawId,
            rewardRecipient: drawStartedEvent.args.recipient,
            elapsedTime: drawStartedEvent.args.elapsedTime,
            hash: drawStartedEvent.transactionHash,
            blockNumber: drawStartedEvent.blockNumber,
            timestamp: !!drawStartedBlock ? Number(drawStartedBlock.timestamp) : undefined
          }

          let drawFinish: DrawFinishTx | undefined = undefined

          const drawAwardedEvent = drawAwardedEvents.find((e) => e.args.drawId === drawId)

          if (!!drawAwardedEvent) {
            const drawFinishedEvent = drawFinishedEvents.find((e) => e.args.drawId === drawId)

            if (!!drawFinishedEvent) {
              const drawAwardedBlock = drawAwardedBlocks.find(
                (block) => block.number === drawAwardedEvent.blockNumber
              )

              drawFinish = {
                drawId,
                reward: drawFinishedEvent.args.finishReward,
                rewardRecipient: drawFinishedEvent.args.finishRecipient,
                reserve: drawAwardedEvent.args.reserve,
                remainingReserve: drawFinishedEvent.args.remainingReserve,
                lastNumTiers: drawAwardedEvent.args.lastNumTiers,
                numTiers: drawAwardedEvent.args.numTiers,
                elapsedTime: Number(drawFinishedEvent.args.elapsedTime), // TODO: remove number cast once contract is fixed
                hash: drawAwardedEvent.transactionHash,
                blockNumber: drawAwardedEvent.blockNumber,
                timestamp: !!drawAwardedBlock ? Number(drawAwardedBlock.timestamp) : undefined
              }

              drawStart.reward = drawFinishedEvent.args.startReward
            }
          }

          return { drawStart, drawFinish }
        })
        .filter((tx) => !!tx)

      return rngTxs
    }
  }, [
    drawStartedEvents,
    drawFinishedEvents,
    drawAwardedEvents,
    drawStartedBlocks,
    drawAwardedBlocks
  ])

  const isFetched =
    isFetchedDrawStartedEvents &&
    isFetchedDrawFinishedEvents &&
    isFetchedDrawAwardedEvents &&
    isFetchedDrawStartedBlocks &&
    isFetchedDrawAwardedBlocks

  const refetch = () => {
    refetchDrawStartedEvents()
    refetchDrawFinishedEvents()
    refetchDrawAwardedEvents()
  }

  return { data, isFetched, refetch }
}
