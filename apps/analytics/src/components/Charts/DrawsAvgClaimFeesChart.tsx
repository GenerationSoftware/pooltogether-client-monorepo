import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useDrawAwardedEvents,
  usePrizeDrawWinners
} from '@generationsoftware/hyperstructure-react-hooks'
import { divideBigInts, formatNumberForDisplay } from '@shared/utilities'
import classNames from 'classnames'
import { useMemo } from 'react'
import { QUERY_START_BLOCK } from '@constants/config'
import { LineChart } from './LineChart'

interface DrawsAvgClaimFeesChartProps {
  prizePool: PrizePool
  hideCanary?: boolean
  className?: string
}

export const DrawsAvgClaimFeesChart = (props: DrawsAvgClaimFeesChartProps) => {
  const { prizePool, hideCanary, className } = props

  const { data: allDraws } = usePrizeDrawWinners(prizePool)

  const { data: drawAwardedEvents } = useDrawAwardedEvents(prizePool, {
    fromBlock: !!prizePool ? QUERY_START_BLOCK[prizePool.chainId] : undefined
  })

  const chartData = useMemo(() => {
    if (!!allDraws && !!drawAwardedEvents) {
      const data: { name: string; percentage: number; cumAvg: number }[] = []

      let numValues = 0
      let sumValues = 0

      allDraws.forEach((draw) => {
        const numTiers = drawAwardedEvents?.find((e) => e.args.drawId === draw.id)?.args.numTiers
        if (!!numTiers) {
          const wins = draw.prizeClaims.filter(
            (win) =>
              win.fee > 0n &&
              win.feeRecipient !== win.recipient &&
              (!hideCanary || win.tier !== numTiers - 1)
          )

          if (!!wins.length) {
            const sumClaimFeeAmount = wins.reduce((a, b) => a + b.fee, 0n)
            const sumPrizeAmount = wins.reduce((a, b) => a + b.payout, 0n)
            const percentage =
              divideBigInts(sumClaimFeeAmount, sumPrizeAmount + sumClaimFeeAmount) * 100

            numValues++
            sumValues += percentage
            const cumAvg = sumValues / numValues

            data.push({ name: `#${draw.id}`, percentage, cumAvg })
          }
        }
      })

      return data
    }
  }, [allDraws, drawAwardedEvents])

  if (!!chartData?.length) {
    return (
      <div
        className={classNames(
          'w-full flex flex-col gap-2 font-medium text-pt-purple-800',
          className
        )}
      >
        <span className='ml-2 md:ml-6 text-pt-purple-200'>Average Claim Fee Percentages</span>
        <LineChart
          data={chartData}
          lines={[{ id: 'percentage' }, { id: 'cumAvg', strokeDashArray: 5 }]}
          tooltip={{
            show: true,
            formatter: (value, name) => [
              `${formatNumberForDisplay(value, { maximumFractionDigits: 2 })}%`,
              name === 'percentage' ? 'Avg Claim Fee' : 'Cumulative Avg'
            ],
            labelFormatter: (label) => `Draw ${label}`
          }}
          xAxis={{ interval: 'preserveStart', minTickGap: 50 }}
          yAxis={{
            domain: ([dataMin, dataMax]) => [
              Math.floor(dataMin / 2) * 2,
              Math.ceil(dataMax / 2) * 2
            ],
            tickFormatter: (tick) => `${tick}%`
          }}
        />
      </div>
    )
  }

  return <></>
}
