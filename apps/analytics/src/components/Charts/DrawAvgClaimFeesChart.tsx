import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useDrawAwardedEvents,
  usePrizeDrawWinners
} from '@generationsoftware/hyperstructure-react-hooks'
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
import { isCanaryTier } from 'src/utils'
import { QUERY_START_BLOCK } from '@constants/config'
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

  const { data: wins } = usePrizeDrawWinners(prizePool)
  const drawWins = wins?.find((draw) => draw.id === drawId)?.prizeClaims

  const { closedAt, awardedAt, finalizedAt } = useDrawStatus(prizePool, drawId)

  const { data: drawAwardedEvents } = useDrawAwardedEvents(prizePool, {
    fromBlock: !!prizePool ? QUERY_START_BLOCK[prizePool.chainId] : undefined
  })

  const numTiers = useMemo(() => {
    const drawAwardedEvent = drawAwardedEvents?.find((e) => e.args.drawId === drawId)
    return drawAwardedEvent?.args.numTiers
  }, [drawId, drawAwardedEvents])

  const currentTimestamp = useAtomValue(currentTimestampAtom)

  const chartTimestamps = useMemo(() => {
    const timestamps: number[] = []

    if (!!closedAt && !!finalizedAt) {
      const startTimestamp = closedAt
      const endTimestamp = Math.min(finalizedAt, currentTimestamp)

      for (let i = startTimestamp; i < endTimestamp; i += SECONDS_PER_HOUR) {
        timestamps.push(i)
      }
      timestamps.push(endTimestamp)
    }

    return timestamps
  }, [closedAt, currentTimestamp])

  const chartData = useMemo(() => {
    if (!!drawWins?.length && !!numTiers) {
      const data: { name: number; [tier: number]: number }[] = []

      const cumTierValues: {
        [tier: number]: { sumClaimFeeAmount: bigint; sumPrizeAmount: bigint }
      } = {}

      const filteredWins = drawWins.filter(
        (win) =>
          win.claimReward > 0n &&
          win.claimRewardRecipient !== win.recipient &&
          (!hideCanary || !isCanaryTier(win.tier, numTiers))
      )

      const tiers = new Set(filteredWins.map((win) => win.tier))
      tiers.forEach((tier) => (cumTierValues[tier] = { sumClaimFeeAmount: 0n, sumPrizeAmount: 0n }))

      const getCheckpointData = () => {
        return Object.assign(
          {},
          ...Object.entries(cumTierValues).map(([tier, values]) => ({
            [parseInt(tier)]:
              divideBigInts(
                values.sumClaimFeeAmount,
                values.sumPrizeAmount + values.sumClaimFeeAmount
              ) * 100
          }))
        )
      }

      data.push({ name: chartTimestamps[0], ...getCheckpointData() })

      for (let i = 0; i < chartTimestamps.length - 1; i++) {
        const checkpointWins = filteredWins.filter(
          (win) => win.timestamp >= chartTimestamps[i] && win.timestamp < chartTimestamps[i + 1]
        )

        checkpointWins.forEach((win) => {
          cumTierValues[win.tier].sumClaimFeeAmount += win.claimReward
          cumTierValues[win.tier].sumPrizeAmount += win.payout
        })

        data.push({ name: chartTimestamps[i + 1], ...getCheckpointData() })
      }

      return data
    }
  }, [drawWins, numTiers, chartTimestamps])

  if (!!chartData?.length && !!numTiers) {
    const lines: LineChartProps['lines'] = Object.keys(chartData[0])
      .filter((key) => key !== 'name')
      .map((key) => ({ id: parseInt(key) }))

    const refLines: LineChartProps['refLines'] = !!awardedAt
      ? [{ id: 'awardedAt', x: awardedAt, label: { value: 'Awarded', fill: '#8050E3' } }]
      : []

    return (
      <div
        className={classNames(
          'w-full flex flex-col gap-2 text-pt-purple-700 font-medium',
          className
        )}
      >
        <span className='ml-2 text-pt-purple-200 md:ml-6'>
          Cumulative Average Claim Fee Percentages
        </span>
        <LineChart
          data={chartData}
          lines={lines}
          refLines={refLines}
          tooltip={{
            show: true,
            formatter: (value, tier) => [
              `${formatNumberForDisplay(value, { maximumFractionDigits: 2 })}%`,
              tier === 0 ? 'GP' : isCanaryTier(Number(tier), numTiers) ? 'Canary' : `Tier ${tier}`
            ],
            labelFormatter: (label) => getSimpleTime(Number(label))
          }}
          xAxis={{
            type: 'number',
            domain: ['dataMin', 'dataMax'],
            ticks: chartTimestamps,
            interval: 'preserveStart',
            minTickGap: 50,
            tickFormatter: (tick) => getSimpleTime(Number(tick))
          }}
          yAxis={{ tickFormatter: (tick) => `${tick}%` }}
        />
      </div>
    )
  }

  return <></>
}
