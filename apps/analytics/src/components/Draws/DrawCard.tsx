import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import classNames from 'classnames'
import { DrawClaimFees } from './DrawClaimFees'
import { DrawPrizes } from './DrawPrizes'
import { DrawStatus } from './DrawStatus'
import { DrawTimer } from './DrawTimer'

interface DrawCardProps {
  prizePool: PrizePool
  drawId: number
  className?: string
}

export const DrawCard = (props: DrawCardProps) => {
  const { prizePool, drawId, className } = props

  const gridColsClassName =
    'grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,2fr)_repeat(3,minmax(0,1fr))]'

  return (
    <div
      className={classNames(
        'w-full grid gap-10 p-4 bg-pt-purple-100/50 rounded-2xl',
        gridColsClassName,
        className
      )}
    >
      <DrawStatus prizePool={prizePool} drawId={drawId} />
      <DrawTimer prizePool={prizePool} drawId={drawId} />
      <DrawPrizes prizePool={prizePool} drawId={drawId} />
      <DrawClaimFees prizePool={prizePool} drawId={drawId} />
      {/* <DrawLiqEfficiency prizePool={prizePool} drawId={drawId} /> */}
      {/* <DrawRngFee prizePool={prizePool} drawId={drawId} /> */}
      {/* <DrawRelayFee prizePool={prizePool} drawId={drawId} /> */}
    </div>
  )
}
