import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { usePrizeDrawWinners } from '@generationsoftware/hyperstructure-react-hooks'
import { divideBigInts, formatNumberForDisplay } from '@shared/utilities'
import classNames from 'classnames'
import { useMemo } from 'react'
import { useDrawAwardedEvents } from '@hooks/useDrawAwardedEvents'
import { LineChart } from './LineChart'

interface DrawsAvgClaimFeesChartProps {
  prizePool: PrizePool
  hideCanary?: boolean
  className?: string
}

export const DrawsAvgClaimFeesChart = (props: DrawsAvgClaimFeesChartProps) => {
  const { prizePool, hideCanary, className } = props

  const { data: allDraws } = usePrizeDrawWinners(prizePool)

  const { data: drawAwardedEvents } = useDrawAwardedEvents(prizePool)

  const chartData = useMemo(() => {
    if (!!allDraws && !!drawAwardedEvents) {
      const data: { name: string; percentage: number }[] = []

      allDraws.forEach((draw) => {
        const numTiers = drawAwardedEvents?.find((e) => e.args.drawId === draw.id)?.args.numTiers
        if (!!numTiers) {
          const wins = draw.prizeClaims.filter(
            (win) => win.fee > 0n && (!hideCanary || win.tier !== numTiers - 1)
          )

          const sumClaimFeeAmount = wins.reduce((a, b) => a + b.fee, 0n)
          const sumPrizeAmount = wins.reduce((a, b) => a + b.payout, 0n)

          data.push({
            name: `#${draw.id}`,
            percentage: divideBigInts(sumClaimFeeAmount, sumPrizeAmount + sumClaimFeeAmount) * 100
          })
        }
      })

      return data
    }
  }, [allDraws, drawAwardedEvents])

  if (!!chartData?.length) {
    return (
      <div className={classNames('w-full flex flex-col gap-2', className)}>
        <span className='ml-2 md:ml-6'>Average Claim Fee Percentages</span>
        <LineChart
          data={chartData}
          lines={[{ id: 'percentage' }]}
          tooltip={{
            show: true,
            formatter: (value) => [
              `${formatNumberForDisplay(value, { maximumFractionDigits: 2 })}%`,
              'Avg Claim Fee'
            ],
            labelFormatter: (label) => `Draw ${label}`
          }}
          xAxis={{ interval: 2 }}
          yAxis={{ tickFormatter: (tick) => `${tick}%` }}
        />
      </div>
    )
  }

  return <></>
}
