import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useHistoricalTokenPrices,
  usePrizeTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { ExternalLink, Spinner } from '@shared/ui'
import { getBlockExplorerUrl, NETWORK, POOL_TOKEN_ADDRESSES } from '@shared/utilities'
import classNames from 'classnames'
import { useMemo } from 'react'
import { Address, formatUnits } from 'viem'
import { useBlockAtTimestamp } from '@hooks/useBlockAtTimestamp'
import { useDrawStatus } from '@hooks/useDrawStatus'
import { useHistoricalLiquidationPairTokenOutPrices } from '@hooks/useHistoricalLiquidationPairTokenOutPrices'
import { useLiquidationEvents } from '@hooks/useLiquidationEvents'
import { DrawCardItemTitle } from './DrawCardItemTitle'

interface DrawLiqEfficiencyProps {
  prizePool: PrizePool
  drawId: number
  className?: string
}

export const DrawLiqEfficiency = (props: DrawLiqEfficiencyProps) => {
  const { prizePool, drawId, className } = props

  const { data: liquidationEvents, isFetched: isFetchedLiquidationEvents } =
    useLiquidationEvents(prizePool)

  const { openedAt, endedAt, isFetched: isFetchedDrawStatus } = useDrawStatus(prizePool, drawId)

  const { data: openedAtBlock } = useBlockAtTimestamp(prizePool?.chainId, openedAt as number)
  const { data: endedAtBlock } = useBlockAtTimestamp(prizePool?.chainId, endedAt as number)

  // TODO: this assumes the tokenIn is always POOL (and uses mainnet pricing) - not ideal
  const { data: prizeToken } = usePrizeTokenData(prizePool)
  const { data: tokenInPrices, isFetched: isFetchedTokenInPrices } = useHistoricalTokenPrices(
    NETWORK.mainnet,
    [POOL_TOKEN_ADDRESSES[NETWORK.mainnet]]
  )
  const prizeTokenPrices =
    tokenInPrices[POOL_TOKEN_ADDRESSES[NETWORK.mainnet].toLowerCase() as Address]

  const drawLiquidationEvents = useMemo(() => {
    if (!!liquidationEvents?.length && isFetchedDrawStatus && !!openedAtBlock) {
      return liquidationEvents.filter(
        (event) =>
          event.blockNumber > openedAtBlock.number &&
          (endedAtBlock === undefined || event.blockNumber <= endedAtBlock.number)
      )
    }
    return []
  }, [liquidationEvents, isFetchedDrawStatus, openedAtBlock, endedAtBlock])

  const lpAddresses = useMemo(() => {
    const addresses = new Set<Address>()
    drawLiquidationEvents.forEach((event) => addresses.add(event.args.liquidationPair))
    return [...addresses]
  }, [drawLiquidationEvents])

  const { data: tokenOutPrices, isFetched: isFetchedTokenOutPrices } =
    useHistoricalLiquidationPairTokenOutPrices(prizePool?.chainId, lpAddresses)

  const liqEfficiencyStats = useMemo(() => {
    if (
      !!drawLiquidationEvents.length &&
      !!prizeToken &&
      !!prizeTokenPrices &&
      !!Object.keys(tokenOutPrices).length &&
      !!openedAt
    ) {
      const targetTimestamp = !!endedAt ? endedAt - (endedAt - openedAt) / 2 : openedAt
      const targetDate = new Date(targetTimestamp * 1_000).toISOString().split('T')[0]
      const prizeTokenPrice = prizeTokenPrices.find((entry) => entry.date === targetDate)?.price

      if (!!prizeTokenPrice) {
        type Stat = { efficiency: number; hash?: `0x${string}` }

        let high: Stat = { efficiency: -Number.MAX_SAFE_INTEGER }
        let low: Stat = { efficiency: Number.MAX_SAFE_INTEGER }

        let totalValueIn = 0
        let totalValueOut = 0

        drawLiquidationEvents.forEach((event) => {
          const tokenOut = tokenOutPrices[event.args.liquidationPair]
          const tokenOutPrice = tokenOut?.priceHistory.find(
            (entry) => entry.date === targetDate
          )?.price

          if (!!tokenOutPrice) {
            const amountIn = parseFloat(formatUnits(event.args.amountIn, prizeToken.decimals))
            const amountOut = parseFloat(formatUnits(event.args.amountOut, tokenOut.decimals))

            const valueIn = amountIn * prizeTokenPrice
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
        })

        if (!!high.hash && !!low.hash && !!totalValueIn && !!totalValueOut) {
          const avg = (totalValueIn / totalValueOut) * 100

          return { avg, high, low }
        }
      }
    }
  }, [drawLiquidationEvents, prizeToken, prizeTokenPrices, tokenOutPrices])

  const isFetched =
    isFetchedLiquidationEvents &&
    isFetchedDrawStatus &&
    isFetchedTokenInPrices &&
    (!lpAddresses.length || isFetchedTokenOutPrices)

  return (
    <div className={classNames('flex flex-col gap-3', className)}>
      <DrawCardItemTitle>Liq. Efficiency</DrawCardItemTitle>
      <div className='flex flex-col gap-1 text-sm text-pt-purple-700'>
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
          <Spinner className='after:border-y-pt-purple-800' />
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
          'text-pt-purple-700': type === 'avg',
          'text-green-600': type === 'high',
          'text-red-600': type === 'low'
        },
        className
      )}
    >
      <span className='w-10 border-r border-r-pt-purple-100'>{type.toUpperCase()}</span>
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
