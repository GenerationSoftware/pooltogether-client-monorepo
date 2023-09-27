import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import classNames from 'classnames'
import { useDrawStatus } from '@hooks/useDrawStatus'
import { DrawClaimFees } from './DrawClaimFees'
import { DrawLiqEfficiency } from './DrawLiqEfficiency'
import { DrawPrizes } from './DrawPrizes'
import { DrawRelayFee } from './DrawRelayFee'
import { DrawRngFee } from './DrawRngFee'
import { DrawStatus } from './DrawStatus'
import { DrawTimer } from './DrawTimer'

interface DrawCardProps {
  prizePool: PrizePool
  drawId: number
  className?: string
}

export const DrawCard = (props: DrawCardProps) => {
  const { prizePool, drawId, className } = props

  const { status } = useDrawStatus(prizePool, drawId)

  const gridColsClassName =
    'md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,1.8fr)_minmax(0,1fr)_minmax(0,1.3fr)_minmax(0,1.3fr)]'

  const shouldDisplayTimer = !!status && status !== 'finalized'

  return (
    <div
      className={classNames(
        'w-full flex flex-wrap gap-y-6 p-4 bg-pt-purple-100/50 rounded-2xl md:grid md:gap-x-12',
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
      <DrawRngFee prizePool={prizePool} drawId={drawId} className='w-1/2 md:w-auto' />
      <DrawRelayFee prizePool={prizePool} drawId={drawId} className='w-1/2 md:w-auto' />
    </div>
  )
}
