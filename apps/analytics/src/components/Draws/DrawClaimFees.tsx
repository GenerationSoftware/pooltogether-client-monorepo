import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import classNames from 'classnames'
import { ClaimFees } from '@components/ClaimFees'
import { DrawCardItemTitle } from './DrawCardItemTitle'

interface DrawClaimFeesProps {
  prizePool: PrizePool
  drawId: number
  className?: string
}

export const DrawClaimFees = (props: DrawClaimFeesProps) => {
  const { prizePool, drawId, className } = props

  return (
    <div className={classNames('flex flex-col gap-3', className)}>
      <DrawCardItemTitle>Claim Fees</DrawCardItemTitle>
      <ClaimFees prizePool={prizePool} drawId={drawId} hideCanary={true} />
    </div>
  )
}
