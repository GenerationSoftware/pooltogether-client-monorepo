import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { usePrizeDrawWinners } from '@generationsoftware/hyperstructure-react-hooks'
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
import { useDrawAwardedEvents } from '@hooks/useDrawAwardedEvents'
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

  const { closedAt, awardedAt, finalizedAt } = useDrawStatus(prizePool, drawId)

  const { data: drawAwardedEvents } = useDrawAwardedEvents(prizePool)
  const numTiers = drawAwardedEvents?.find((e) => e.args.drawId === drawId)?.args.numTiers

  const currentTimestamp = useAtomValue(currentTimestampAtom)

  const chartTimestamps = useMemo(() => {
    const timestamps: number[] = []

    if (!!closedAt && !!awardedAt && !!finalizedAt) {
      const startTimestamp = awardedAt
      const endTimestamp = Math.min(finalizedAt, currentTimestamp)
      const checkpointSize = SECONDS_PER_HOUR

      for (let i = startTimestamp; i <= endTimestamp; i += checkpointSize) {
        timestamps.push(i)
      }
      timestamps.push(endTimestamp)
    }

    return timestamps
  }, [closedAt, awardedAt, currentTimestamp])

  const chartData = useMemo(() => {
    if (!!draw && !!numTiers) {
      const data: { name: number; [tier: number]: number }[] = []

      const cumTierValues: {
        [tier: number]: { sumClaimFeeAmount: bigint; sumPrizeAmount: bigint }
      } = {}

      const wins = draw.prizeClaims.filter(
        (win) => win.fee > 0n && (!hideCanary || win.tier !== numTiers - 1)
      )

      const tiers = new Set(wins.map((win) => win.tier))
      tiers.forEach(
        (tier) => (cumTierValues[tier] = { sumClaimFeeAmount: 0n, sumPrizeAmount: 0n })
      )

      for (let i = 0; i < chartTimestamps.length - 1; i++) {
        const checkpointWins = wins.filter(
          (win) => win.timestamp >= chartTimestamps[i] && win.timestamp < chartTimestamps[i + 1]
        )

        checkpointWins.forEach((win) => {
          cumTierValues[win.tier].sumClaimFeeAmount += win.fee
          cumTierValues[win.tier].sumPrizeAmount += win.payout
        })

        const checkpointData = Object.assign(
          {},
          ...Object.entries(cumTierValues).map(([tier, values]) => ({
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
        <span className='ml-2 md:ml-6'>Average Claim Fee Percentages (Cumulative Avgs)</span>
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
