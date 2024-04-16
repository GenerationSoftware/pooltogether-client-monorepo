import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { usePrizeDrawWinners } from '@generationsoftware/hyperstructure-react-hooks'
import classNames from 'classnames'
import { useMemo } from 'react'
import { useDrawResults } from '@hooks/useDrawResults'
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

  const { status } = useDrawStatus(prizePool, drawId)

  const { data: prizesAvailable } = useDrawResults(prizePool, drawId)

  const { data: draws } = usePrizeDrawWinners(prizePool)
  const draw = draws?.find((d) => d.id === drawId)

  const isClaiming = useMemo(() => {
    if (!status || status !== 'awarded' || !prizesAvailable || !draw) return false
    return prizesAvailable.length > draw.prizeClaims.length
  }, [prizesAvailable, draw])

  return (
    <div className={classNames('flex flex-col gap-3', className)}>
      <DrawCardItemTitle>Draw Status</DrawCardItemTitle>
      <DrawStatusBadge prizePool={prizePool} drawId={drawId} className={badgeClassName} />
      {isClaiming && <span className='text-sm text-pt-purple-200'>Claims in progress...</span>}
    </div>
  )
}
