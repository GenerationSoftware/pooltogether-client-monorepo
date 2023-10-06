import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useHistoricalTokenPrices,
  usePrizeTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { formatNumberForDisplay, NETWORK, POOL_TOKEN_ADDRESSES } from '@shared/utilities'
import classNames from 'classnames'
import { useMemo } from 'react'
import { Address, formatUnits } from 'viem'
import { useAllDrawsStatus } from '@hooks/useAllDrawsStatus'
import { useBlocksAtTimestamps } from '@hooks/useBlocksAtTimestamps'
import { useHistoricalLiquidationPairTokenOutPrices } from '@hooks/useHistoricalLiquidationPairTokenOutPrices'
import { useLiquidationEvents } from '@hooks/useLiquidationEvents'
import { useRngTxs } from '@hooks/useRngTxs'
import { LineChart } from './LineChart'

interface DrawsAvgLiqEfficiencyChartProps {
  prizePool: PrizePool
  className?: string
}

export const DrawsAvgLiqEfficiencyChart = (props: DrawsAvgLiqEfficiencyChartProps) => {
  const { prizePool, className } = props

  const { data: liquidationEvents } = useLiquidationEvents(prizePool)

  const { data: rngTxs } = useRngTxs(prizePool)
  const drawIds = rngTxs?.map((txs) => txs.rng.drawId) ?? []

  const { data: allDrawsStatus } = useAllDrawsStatus(prizePool, drawIds)

  const uniqueOpenedAtTimestamps = new Set(allDrawsStatus?.map((draw) => draw.openedAt))
  const { data: openedAtBlocksByTimestamp } = useBlocksAtTimestamps(prizePool?.chainId, [
    ...uniqueOpenedAtTimestamps
  ])

  const uniqueEndedAtTimestamps = new Set(allDrawsStatus?.map((draw) => draw.endedAt))
  const { data: endedAtBlocksByTimestamp } = useBlocksAtTimestamps(
    prizePool?.chainId,
    [...uniqueEndedAtTimestamps].filter((t) => !!t) as number[]
  )

  // TODO: this assumes the tokenIn is always POOL (and uses mainnet pricing) - not ideal
  const { data: prizeToken } = usePrizeTokenData(prizePool)
  const { data: tokenInPrices } = useHistoricalTokenPrices(NETWORK.mainnet, [
    POOL_TOKEN_ADDRESSES[NETWORK.mainnet]
  ])
  const prizeTokenPrices =
    tokenInPrices[POOL_TOKEN_ADDRESSES[NETWORK.mainnet].toLowerCase() as Address]

  const lpAddresses = useMemo(() => {
    const addresses = new Set<Address>()
    liquidationEvents?.forEach((e) => addresses.add(e.args.liquidationPair))
    return [...addresses]
  }, [liquidationEvents])

  const { data: tokenOutPrices } = useHistoricalLiquidationPairTokenOutPrices(
    prizePool?.chainId,
    lpAddresses
  )

  const chartData = useMemo(() => {
    if (
      !!liquidationEvents &&
      !!allDrawsStatus &&
      !!openedAtBlocksByTimestamp &&
      !!endedAtBlocksByTimestamp &&
      !!prizeToken &&
      !!prizeTokenPrices &&
      !!Object.keys(tokenOutPrices).length
    ) {
      const data: { name: string; percentage: number }[] = []

      allDrawsStatus.forEach((draw) => {
        const targetTimestamp = !!draw.endedAt
          ? draw.endedAt - (draw.endedAt - draw.openedAt) / 2
          : draw.openedAt
        const targetDate = new Date(targetTimestamp * 1_000).toISOString().split('T')[0]
        const prizeTokenPrice = prizeTokenPrices.find((entry) => entry.date === targetDate)?.price

        const openedAtBlock = openedAtBlocksByTimestamp[draw.openedAt]
        const endedAtBlock = !!draw.endedAt ? endedAtBlocksByTimestamp[draw.endedAt] : undefined

        if (!!prizeTokenPrice && !!openedAtBlock) {
          let totalValueIn = 0
          let totalValueOut = 0

          const drawLiquidationEvents = liquidationEvents.filter(
            (e) =>
              e.blockNumber > openedAtBlock.number &&
              (draw.endedAt === undefined ||
                (!!endedAtBlock && e.blockNumber <= endedAtBlock.number))
          )

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

              totalValueIn += valueIn
              totalValueOut += valueOut
            }
          })

          if (!!totalValueIn && !!totalValueOut) {
            data.push({ name: `#${draw.id}`, percentage: (totalValueIn / totalValueOut) * 100 })
          }
        }
      })

      return data
    }
  }, [
    liquidationEvents,
    allDrawsStatus,
    openedAtBlocksByTimestamp,
    endedAtBlocksByTimestamp,
    prizeToken,
    prizeTokenPrices,
    tokenOutPrices
  ])

  if (!!chartData?.length) {
    return (
      <div className={classNames('w-full flex flex-col gap-2', className)}>
        <span className='ml-2 md:ml-6'>Average Liquidation Efficiency</span>
        <LineChart
          data={chartData}
          lines={[{ id: 'percentage' }]}
          tooltip={{
            show: true,
            formatter: (value) => [
              `${formatNumberForDisplay(value, { maximumFractionDigits: 2 })}%`,
              'Avg Liq. Efficiency'
            ],
            labelFormatter: (label) => `Draw ${label}`
          }}
          xAxis={{ interval: 2 }}
          yAxis={{
            domain: ([dataMin]) => [Math.floor(dataMin), 100],
            tickFormatter: (tick) => `${tick}%`
          }}
        />
      </div>
    )
  }

  return <></>
}
