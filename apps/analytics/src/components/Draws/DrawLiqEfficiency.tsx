import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useBlockAtTimestamp,
  useLiquidationEvents
} from '@generationsoftware/hyperstructure-react-hooks'
import { ExternalLink, Spinner } from '@shared/ui'
import { getBlockExplorerUrl } from '@shared/utilities'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { currentTimestampAtom } from 'src/atoms'
import { Address, formatUnits } from 'viem'
import { QUERY_START_BLOCK } from '@constants/config'
import { useDrawStatus } from '@hooks/useDrawStatus'
import { useHistoricalLiquidationPairTokenInPrices } from '@hooks/useHistoricalLiquidationPairTokenInPrices'
import { useHistoricalLiquidationPairTokenOutPrices } from '@hooks/useHistoricalLiquidationPairTokenOutPrices'
import { DrawCardItemTitle } from './DrawCardItemTitle'

interface DrawLiqEfficiencyProps {
  prizePool: PrizePool
  drawId: number
  className?: string
}

export const DrawLiqEfficiency = (props: DrawLiqEfficiencyProps) => {
  const { prizePool, drawId, className } = props

  const { data: liquidationEvents, isFetched: isFetchedLiquidationEvents } = useLiquidationEvents(
    prizePool?.chainId,
    { fromBlock: !!prizePool ? QUERY_START_BLOCK[prizePool.chainId] : undefined }
  )

  const { openedAt, closedAt, isFetched: isFetchedDrawStatus } = useDrawStatus(prizePool, drawId)

  const currentTimestamp = useAtomValue(currentTimestampAtom)

  const { data: openedAtBlock } = useBlockAtTimestamp(prizePool?.chainId, openedAt as number)
  const { data: closedAtBlock } = useBlockAtTimestamp(prizePool?.chainId, closedAt as number)

  const drawLiquidationEvents = useMemo(() => {
    if (!!liquidationEvents && isFetchedDrawStatus && !!openedAtBlock && !!closedAtBlock) {
      return liquidationEvents.filter(
        (event) =>
          event.blockNumber > openedAtBlock.number && event.blockNumber <= closedAtBlock.number
      )
    } else {
      return []
    }
  }, [liquidationEvents, isFetchedDrawStatus, openedAtBlock, closedAtBlock])

  const lpAddresses = useMemo(() => {
    const addresses = new Set<Address>()
    drawLiquidationEvents.forEach((event) =>
      addresses.add(event.args.liquidationPair.toLowerCase() as Address)
    )
    return [...addresses]
  }, [drawLiquidationEvents])

  const { data: tokenInPrices, isFetched: isFetchedTokenInPrices } =
    useHistoricalLiquidationPairTokenInPrices(prizePool?.chainId, lpAddresses)

  const { data: tokenOutPrices, isFetched: isFetchedTokenOutPrices } =
    useHistoricalLiquidationPairTokenOutPrices(prizePool?.chainId, lpAddresses)

  const liqEfficiencyStats = useMemo(() => {
    if (
      !!drawLiquidationEvents.length &&
      !!openedAt &&
      !!closedAt &&
      !!Object.keys(tokenInPrices).length &&
      !!Object.keys(tokenOutPrices).length
    ) {
      const targetTimestamp =
        closedAt < currentTimestamp ? closedAt - (closedAt - openedAt) / 2 : openedAt
      const targetDate = new Date(targetTimestamp * 1_000).toISOString().split('T')[0]

      type Stat = { efficiency: number; hash?: `0x${string}` }

      let high: Stat = { efficiency: -Number.MAX_SAFE_INTEGER }
      let low: Stat = { efficiency: Number.MAX_SAFE_INTEGER }

      let totalValueIn = 0
      let totalValueOut = 0

      drawLiquidationEvents.forEach((event) => {
        const liquidationPair = event.args.liquidationPair.toLowerCase() as Address

        const tokenIn = tokenInPrices[liquidationPair]
        const tokenInPrice = tokenIn?.priceHistory.find((entry) => entry.date === targetDate)?.price

        if (!!tokenInPrice) {
          const tokenOut = tokenOutPrices[liquidationPair]
          const tokenOutPrice = tokenOut?.priceHistory.find(
            (entry) => entry.date === targetDate
          )?.price

          if (!!tokenOutPrice) {
            const amountIn = parseFloat(formatUnits(event.args.amountIn, tokenIn.decimals))
            const amountOut = parseFloat(formatUnits(event.args.amountOut, tokenOut.decimals))

            const valueIn = amountIn * tokenInPrice
            const valueOut = amountOut * tokenOutPrice

            const efficiency = (valueIn / valueOut) * 100

            if (efficiency > high.efficiency) {
              high = { efficiency, hash: event.transactionHash }
            }
            if (efficiency < low.efficiency) {
              low = { efficiency, hash: event.transactionHash }
            }

            totalValueIn += valueIn
            totalValueOut += valueOut
          }
        }
      })

      if (!!high.hash && !!low.hash && !!totalValueIn && !!totalValueOut) {
        const avg = (totalValueIn / totalValueOut) * 100

        return { avg, high, low }
      }
    }
  }, [drawLiquidationEvents, openedAt, closedAt, tokenInPrices, tokenOutPrices])

  const isFetched =
    isFetchedLiquidationEvents &&
    isFetchedDrawStatus &&
    (!lpAddresses.length || (isFetchedTokenInPrices && isFetchedTokenOutPrices))

  return (
    <div className={classNames('flex flex-col gap-3', className)}>
      <DrawCardItemTitle>Liq. Efficiency</DrawCardItemTitle>
      <div className='flex flex-col gap-1 text-sm text-pt-purple-300'>
        {isFetched && !!liqEfficiencyStats ? (
          <>
            <LiqEffiencyStat type='avg' percentage={liqEfficiencyStats.avg} />
            <LiqEffiencyStat
              type='high'
              percentage={liqEfficiencyStats.high.efficiency}
              chainId={prizePool?.chainId}
              txHash={liqEfficiencyStats.high.hash}
            />
            <LiqEffiencyStat
              type='low'
              percentage={liqEfficiencyStats.low.efficiency}
              chainId={prizePool?.chainId}
              txHash={liqEfficiencyStats.low.hash}
            />
          </>
        ) : isFetched ? (
          <span>-</span>
        ) : (
          <Spinner className='after:border-y-pt-purple-300' />
        )}
      </div>
    </div>
  )
}

interface LiqEffiencyStatProps {
  type: 'avg' | 'high' | 'low'
  percentage: number
  chainId?: number
  txHash?: string
  className?: string
}

const LiqEffiencyStat = (props: LiqEffiencyStatProps) => {
  const { type, percentage, chainId, txHash, className } = props

  const formattedPercentage = (
    <span className='pl-2'>
      <span className='text-xl'>
        {percentage.toLocaleString(undefined, { maximumFractionDigits: 0 })}
      </span>
      %
    </span>
  )

  return (
    <div
      className={classNames(
        'flex items-center text-sm',
        {
          'text-pt-purple-200': type === 'avg',
          'text-green-200': type === 'high',
          'text-red-400': type === 'low'
        },
        className
      )}
    >
      <span className='w-10 border-r border-r-pt-purple-600'>{type.toUpperCase()}</span>
      {!!chainId && !!txHash ? (
        <ExternalLink href={getBlockExplorerUrl(chainId, txHash, 'tx')} size='sm'>
          {formattedPercentage}
        </ExternalLink>
      ) : (
        formattedPercentage
      )}
    </div>
  )
}
