import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import classNames from 'classnames'
import { useDrawStatus } from '@hooks/useDrawStatus'
import { DrawCardItemTitle } from './DrawCardItemTitle'
import { DrawStatusBadge } from './DrawStatusBadge'

interface DrawStatusProps {
  prizePool: PrizePool
  drawId: number
  className?: string
  badgeClassName?: string
}

export const DrawStatus = (props: DrawStatusProps) => {
  const { prizePool, drawId, className, badgeClassName } = props

  return (
    <div className={classNames('flex flex-col gap-3', className)}>
      <DrawCardItemTitle>Draw Status</DrawCardItemTitle>
      <DrawStatusBadge prizePool={prizePool} drawId={drawId} className={badgeClassName} />
      <DrawPeriodsSkipped prizePool={prizePool} drawId={drawId} />
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
