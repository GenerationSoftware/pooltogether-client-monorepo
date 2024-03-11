import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import classNames from 'classnames'
import { useDrawStatus } from '@hooks/useDrawStatus'
import { DrawAwardReward } from './DrawAwardReward'
import { DrawClaimFees } from './DrawClaimFees'
import { DrawLiqEfficiency } from './DrawLiqEfficiency'
import { DrawPrizes } from './DrawPrizes'
import { DrawRngReward } from './DrawRngReward'
import { DrawStatus } from './DrawStatus'
import { DrawTimer } from './DrawTimer'

interface DrawCardProps {
  prizePool: PrizePool
  drawId: number
  className?: string
}

export const DrawCard = (props: DrawCardProps) => {
  const { prizePool, drawId, className } = props

  const { status, isSkipped } = useDrawStatus(prizePool, drawId)

  const shouldDisplayTimer = !!status && status !== 'finalized' && !isSkipped

  const gridColsClassName =
    'md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.3fr)_minmax(0,1.3fr)]'

  return (
    <div
      className={classNames(
        'w-full flex flex-wrap gap-y-6 p-4 bg-pt-transparent rounded-2xl md:grid md:gap-x-12',
        gridColsClassName,
        className
      )}
    >
      <DrawStatus
        prizePool={prizePool}
        drawId={drawId}
        className='w-full md:w-auto'
        badgeClassName='max-w-[50%] md:max-w-none'
      />
      <DrawTimer
        prizePool={prizePool}
        drawId={drawId}
        className={classNames('w-1/2 md:w-auto', { 'hidden md:flex': !shouldDisplayTimer })}
      />
      <DrawPrizes
        prizePool={prizePool}
        drawId={drawId}
        className={classNames('w-1/2 md:w-auto', { 'w-full': !shouldDisplayTimer })}
      />
      <DrawClaimFees prizePool={prizePool} drawId={drawId} className='w-1/2 md:w-auto' />
      <DrawLiqEfficiency prizePool={prizePool} drawId={drawId} className='w-1/2 md:w-auto' />
      <DrawRngReward prizePool={prizePool} drawId={drawId} className='w-1/2 md:w-auto' />
      <DrawAwardReward prizePool={prizePool} drawId={drawId} className='w-1/2 md:w-auto' />
    </div>
  )
}
