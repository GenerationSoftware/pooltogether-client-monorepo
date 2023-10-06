import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { usePrizeDrawWinners } from '@generationsoftware/hyperstructure-react-hooks'
import { divideBigInts, formatNumberForDisplay } from '@shared/utilities'
import classNames from 'classnames'
import { useMemo } from 'react'
import { useDrawClosedEvents } from '@hooks/useDrawClosedEvents'
import { LineChart } from './LineChart'

interface DrawsAvgClaimFeesChartProps {
  prizePool: PrizePool
  hideCanary?: boolean
  className?: string
}

export const DrawsAvgClaimFeesChart = (props: DrawsAvgClaimFeesChartProps) => {
  const { prizePool, hideCanary, className } = props

  const { data: allDraws } = usePrizeDrawWinners(prizePool)

  const { data: drawClosedEvents } = useDrawClosedEvents(prizePool)

  const chartData = useMemo(() => {
    if (!!allDraws && !!drawClosedEvents) {
      const data: { name: string; percentage: number }[] = []

      allDraws.forEach((draw) => {
        // TODO: switch to `args.numTiers` once event is fixed
        const numTiers = drawClosedEvents?.find((e) => e.args.drawId === draw.id)?.args.nextNumTiers
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
  }, [allDraws, drawClosedEvents])

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
