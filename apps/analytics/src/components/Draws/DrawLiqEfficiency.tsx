import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { Spinner } from '@shared/ui'
import classNames from 'classnames'
import { useMemo } from 'react'
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

  // TODO: need to get liquidations that occured during this specific draw
  const drawLiquidations = liquidationEvents ?? []

  const liqEfficiencyStats = useMemo(() => {
    if (drawLiquidations.length > 0) {
      // TODO: calculate avg, high and low efficiency during this draw
      // ^ total value in pool swapped in / total value in tokens swapped out
      return { avg: 0, high: 0, low: 0 }
    }
  }, [drawLiquidations])

  return (
    <div className={classNames('flex flex-col gap-3', className)}>
      <DrawCardItemTitle>Liq. Efficiency</DrawCardItemTitle>
      <div className='flex flex-col gap-1 text-sm text-pt-purple-700'>
        {/* {!!liqEfficiencyStats && !!isFetchedLiquidationEvents ? (
          <>
            <LiqEffiencyStat type='avg' percentage={liqEfficiencyStats.avg} />
            <LiqEffiencyStat type='high' percentage={liqEfficiencyStats.high} />
            <LiqEffiencyStat type='low' percentage={liqEfficiencyStats.low} />
          </>
        ) : isFetchedLiquidationEvents ? (
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
