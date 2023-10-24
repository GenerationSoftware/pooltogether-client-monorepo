import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useBlocksAtTimestamps,
  useHistoricalTokenPrices,
  useLiquidationEvents,
  usePrizeTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { formatNumberForDisplay, NETWORK, POOL_TOKEN_ADDRESSES } from '@shared/utilities'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { currentTimestampAtom } from 'src/atoms'
import { Address, formatUnits } from 'viem'
import { QUERY_START_BLOCK } from '@constants/config'
import { useAllDrawsStatus } from '@hooks/useAllDrawsStatus'
import { useHistoricalLiquidationPairTokenOutPrices } from '@hooks/useHistoricalLiquidationPairTokenOutPrices'
import { useRngTxs } from '@hooks/useRngTxs'
import { LineChart } from './LineChart'

interface DrawsAvgLiqEfficiencyChartProps {
  prizePool: PrizePool
  className?: string
}

export const DrawsAvgLiqEfficiencyChart = (props: DrawsAvgLiqEfficiencyChartProps) => {
  const { prizePool, className } = props

  const { data: liquidationEvents } = useLiquidationEvents(prizePool?.chainId, {
    fromBlock: !!prizePool ? QUERY_START_BLOCK[prizePool.chainId] : undefined
  })

  const { data: rngTxs } = useRngTxs(prizePool)
  const drawIds = rngTxs?.map((txs) => txs.rng.drawId) ?? []

  const { data: allDrawsStatus } = useAllDrawsStatus(prizePool, drawIds)

  const currentTimestamp = useAtomValue(currentTimestampAtom)

  const uniqueOpenedAtTimestamps = new Set(allDrawsStatus?.map((draw) => draw.openedAt))
  const { data: openedAtBlocksByTimestamp } = useBlocksAtTimestamps(prizePool?.chainId, [
    ...uniqueOpenedAtTimestamps
  ])

  const uniqueClosedAtTimestamps = new Set(allDrawsStatus?.map((draw) => draw.closedAt))
  const { data: closedAtBlocksByTimestamp } = useBlocksAtTimestamps(
    prizePool?.chainId,
    [...uniqueClosedAtTimestamps].filter((t) => !!t) as number[]
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
    liquidationEvents?.forEach((e) =>
      addresses.add(e.args.liquidationPair.toLowerCase() as Address)
    )
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
      !!closedAtBlocksByTimestamp &&
      !!prizeToken &&
      !!prizeTokenPrices &&
      !!Object.keys(tokenOutPrices).length
    ) {
      const data: { name: string; percentage: number; cumAvg: number }[] = []

      let numValues = 0
      let sumValues = 0

      allDrawsStatus.forEach((draw) => {
        const targetTimestamp =
          draw.closedAt < currentTimestamp
            ? draw.closedAt - (draw.closedAt - draw.openedAt) / 2
            : draw.openedAt
        const targetDate = new Date(targetTimestamp * 1_000).toISOString().split('T')[0]
        const prizeTokenPrice = prizeTokenPrices.find((entry) => entry.date === targetDate)?.price

        const openedAtBlock = openedAtBlocksByTimestamp[draw.openedAt]
        const closedAtBlock = !!draw.closedAt ? closedAtBlocksByTimestamp[draw.closedAt] : undefined

        if (!!prizeTokenPrice && !!openedAtBlock && !!closedAtBlock) {
          let totalValueIn = 0
          let totalValueOut = 0

          const drawLiquidationEvents = liquidationEvents.filter(
            (e) => e.blockNumber > openedAtBlock.number && e.blockNumber <= closedAtBlock.number
          )

          drawLiquidationEvents.forEach((event) => {
            const tokenOut = tokenOutPrices[event.args.liquidationPair.toLowerCase() as Address]
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
            const percentage = (totalValueIn / totalValueOut) * 100
            numValues++
            sumValues += percentage
            const cumAvg = sumValues / numValues
            data.push({ name: `#${draw.id}`, percentage, cumAvg })
          }
        }
      })

      return data
    }
  }, [
    liquidationEvents,
    allDrawsStatus,
    openedAtBlocksByTimestamp,
    closedAtBlocksByTimestamp,
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
          lines={[{ id: 'percentage' }, { id: 'cumAvg', strokeDashArray: 5 }]}
          tooltip={{
            show: true,
            formatter: (value, name) => [
              `${formatNumberForDisplay(value, { maximumFractionDigits: 2 })}%`,
              name === 'percentage' ? 'Avg Liq. Efficiency' : 'Cumulative Avg'
            ],
            labelFormatter: (label) => `Draw ${label}`
          }}
          xAxis={{ interval: Math.floor(chartData.length / 4) }}
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
