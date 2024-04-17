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
  reward: bigint
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
  lastNumTiers: number
  numTiers: number
  elapsedTime: number
  contribution: bigint
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
      const drawIds = [...new Set<number>(drawStartedEvents.map((e) => e.args.drawId))]

      const rngTxs = drawIds
        .map((drawId) => {
          const relevantDrawStartedEvents = drawStartedEvents.filter(
            (e) => e.args.drawId === drawId
          )

          const drawStart: DrawStartTx[] = []

          relevantDrawStartedEvents.forEach((drawStartedEvent) => {
            const drawStartedBlock = drawStartedBlocks.find(
              (block) => block.number === drawStartedEvent.blockNumber
            )

            drawStart.push({
              drawId,
              reward: drawStartedEvent.args.reward,
              rewardRecipient: drawStartedEvent.args.recipient,
              elapsedTime: drawStartedEvent.args.elapsedTime,
              hash: drawStartedEvent.transactionHash,
              blockNumber: drawStartedEvent.blockNumber,
              timestamp: !!drawStartedBlock ? Number(drawStartedBlock.timestamp) : undefined
            })
          })

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
                reward: drawFinishedEvent.args.reward,
                rewardRecipient: drawFinishedEvent.args.recipient,
                reserve: drawAwardedEvent.args.reserve,
                lastNumTiers: drawAwardedEvent.args.lastNumTiers,
                numTiers: drawAwardedEvent.args.numTiers,
                elapsedTime: drawFinishedEvent.args.elapsedTime,
                contribution: drawFinishedEvent.args.contribution,
                hash: drawAwardedEvent.transactionHash,
                blockNumber: drawAwardedEvent.blockNumber,
                timestamp: !!drawAwardedBlock ? Number(drawAwardedBlock.timestamp) : undefined
              }
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
