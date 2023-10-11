import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import classNames from 'classnames'
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
    </div>
  )
}
