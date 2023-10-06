import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { useDrawPeriod, usePrizeDrawWinners } from '@generationsoftware/hyperstructure-react-hooks'
import {
  divideBigInts,
  formatNumberForDisplay,
  getSimpleTime,
  SECONDS_PER_HOUR
} from '@shared/utilities'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { currentTimestampAtom } from 'src/atoms'
import { useDrawClosedEvents } from '@hooks/useDrawClosedEvents'
import { useDrawStatus } from '@hooks/useDrawStatus'
import { LineChart, LineChartProps } from './LineChart'

interface DrawAvgClaimFeesChartProps {
  prizePool: PrizePool
  drawId: number
  hideCanary?: boolean
  className?: string
}

export const DrawAvgClaimFeesChart = (props: DrawAvgClaimFeesChartProps) => {
  const { prizePool, drawId, hideCanary, className } = props

  const { data: allDraws } = usePrizeDrawWinners(prizePool)
  const draw = allDraws?.find((d) => d.id === drawId)

  const { endedAt, closedAt } = useDrawStatus(prizePool, drawId)

  const { data: drawPeriod } = useDrawPeriod(prizePool)

  const { data: drawClosedEvents } = useDrawClosedEvents(prizePool)
  const numTiers = drawClosedEvents?.find((e) => e.args.drawId === drawId)?.args.nextNumTiers // TODO: switch to `args.numTiers` once event is fixed

  const currentTimestamp = useAtomValue(currentTimestampAtom)

  const chartTimestamps = useMemo(() => {
    const timestamps: number[] = []

    if (!!endedAt && !!closedAt && !!drawPeriod) {
      const startTimestamp = closedAt
      const endTimestamp = Math.min(endedAt + drawPeriod, currentTimestamp)
      const checkpointSize = SECONDS_PER_HOUR

      for (let i = startTimestamp; i <= endTimestamp; i += checkpointSize) {
        timestamps.push(i)
      }
      timestamps.push(endTimestamp)
    }

    return timestamps
  }, [endedAt, closedAt, drawPeriod, currentTimestamp])

  const chartData = useMemo(() => {
    if (!!draw && !!numTiers) {
      const data: { name: number; [tier: number]: number }[] = []

      const rollingTierValues: {
        [tier: number]: { sumClaimFeeAmount: bigint; sumPrizeAmount: bigint }
      } = {}

      const wins = draw.prizeClaims.filter(
        (win) => win.fee > 0n && (!hideCanary || win.tier !== numTiers - 1)
      )

      const tiers = new Set(wins.map((win) => win.tier))
      tiers.forEach(
        (tier) => (rollingTierValues[tier] = { sumClaimFeeAmount: 0n, sumPrizeAmount: 0n })
      )

      for (let i = 0; i < chartTimestamps.length - 1; i++) {
        const checkpointWins = wins.filter(
          (win) => win.timestamp >= chartTimestamps[i] && win.timestamp < chartTimestamps[i + 1]
        )

        checkpointWins.forEach((win) => {
          rollingTierValues[win.tier].sumClaimFeeAmount += win.fee
          rollingTierValues[win.tier].sumPrizeAmount += win.payout
        })

        const checkpointData = Object.assign(
          {},
          ...Object.entries(rollingTierValues).map(([tier, values]) => ({
            [parseInt(tier)]:
              divideBigInts(
                values.sumClaimFeeAmount,
                values.sumPrizeAmount + values.sumClaimFeeAmount
              ) * 100
          }))
        )

        data.push({ name: chartTimestamps[i + 1], ...checkpointData })
      }

      return data
    }
  }, [draw, numTiers, chartTimestamps])

  if (!!chartData?.length && !!numTiers) {
    const lines: LineChartProps['lines'] = Object.keys(chartData[0])
      .filter((key) => key !== 'name')
      .map((key) => ({ id: parseInt(key) }))

    return (
      <div className={classNames('w-full flex flex-col gap-2', className)}>
        <span className='ml-2 md:ml-6'>Average Claim Fee Percentages (Rolling Average)</span>
        <LineChart
          data={chartData}
          lines={lines}
          tooltip={{
            show: true,
            formatter: (value, tier) => [
              `${formatNumberForDisplay(value, { maximumFractionDigits: 2 })}%`,
              tier === 0 ? 'GP' : tier === numTiers - 1 ? 'Canary' : `Tier ${tier}`
            ],
            labelFormatter: (label) => getSimpleTime(Number(label))
          }}
          xAxis={{
            interval: 3,
            tickFormatter: (tick) => getSimpleTime(Number(tick))
          }}
          yAxis={{ tickFormatter: (tick) => `${tick}%` }}
        />
      </div>
    )
  }

  return <></>
}
