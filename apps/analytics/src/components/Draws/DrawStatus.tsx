import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import classNames from 'classnames'
import { useDrawStatus } from '@hooks/useDrawStatus'
import { DrawCardItemTitle } from './DrawCardItemTitle'

interface DrawStatusProps {
  prizePool: PrizePool
  drawId: number
  className?: string
}

export const DrawStatus = (props: DrawStatusProps) => {
  const { prizePool, drawId, className } = props

  return (
    <div className={classNames('flex flex-col gap-3', className)}>
      <DrawCardItemTitle>Draw Status</DrawCardItemTitle>
      <DrawStatusBadge prizePool={prizePool} drawId={drawId} />
      <DrawPeriodsSkipped prizePool={prizePool} drawId={drawId} />
    </div>
  )
}

interface DrawStatusBadgeProps {
  prizePool: PrizePool
  drawId: number
  className?: string
}

const DrawStatusBadge = (props: DrawStatusBadgeProps) => {
  const { prizePool, drawId, className } = props

  const { status } = useDrawStatus(prizePool, drawId)

  return (
    <div
      className={classNames(
        'w-full px-2 py-1 text-center text-xl rounded',
        {
          'bg-blue-100 text-blue-600': status === 'open',
          'bg-yellow-100 text-yellow-500': status === 'closed',
          'bg-green-100 text-green-600': status === 'finalized'
        },
        className
      )}
    >
      <span>#{drawId}:</span> <span className='capitalize'>{status}</span>
    </div>
  )
}

interface DrawPeriodsSkippedProps {
  prizePool: PrizePool
  drawId: number
  className?: string
}

const DrawPeriodsSkipped = (props: DrawPeriodsSkippedProps) => {
  const { prizePool, drawId, className } = props

  const { periodsSkipped } = useDrawStatus(prizePool, drawId)

  if (!!periodsSkipped) {
    return (
      <span className={classNames('text-sm text-red-600', className)}>
        Periods Skipped: {periodsSkipped}
      </span>
    )
  }

  return <></>
}
