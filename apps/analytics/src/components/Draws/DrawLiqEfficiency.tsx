import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { Spinner } from '@shared/ui'
import classNames from 'classnames'
import { DrawCardItemTitle } from './DrawCardItemTitle'

interface DrawLiqEfficiencyProps {
  prizePool: PrizePool
  drawId: number
  className?: string
}

export const DrawLiqEfficiency = (props: DrawLiqEfficiencyProps) => {
  const { prizePool, drawId, className } = props

  // TODO: get liquidation events from subgraph
  const isFetchedLiquidations = true
  const liquidationStats = { avg: 0, high: 0, low: 0 }

  return (
    <div className={classNames('flex flex-col gap-3', className)}>
      <DrawCardItemTitle>Liq. Efficiency</DrawCardItemTitle>
      <div className='flex flex-col gap-1 text-sm text-pt-purple-700'>
        {/* {!!liquidationStats && !!isFetchedLiquidations ? (
          <>
            <LiqEffiencyStat type='avg' percentage={liquidationStats.avg} />
            <LiqEffiencyStat type='high' percentage={liquidationStats.high} />
            <LiqEffiencyStat type='low' percentage={liquidationStats.low} />
          </>
        ) : isFetchedLiquidations ? (
          <span>-</span>
        ) : (
          <Spinner className='after:border-y-pt-purple-800' />
        )} */}
        <span>-</span>
      </div>
    </div>
  )
}

interface LiqEffiencyStatProps {
  type: 'avg' | 'high' | 'low'
  percentage: number
  className?: string
}

const LiqEffiencyStat = (props: LiqEffiencyStatProps) => {
  const { type, percentage, className } = props

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
      <span className='pl-2'>
        <span className='text-xl'>
          {percentage.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </span>
        %
      </span>
    </div>
  )
}
