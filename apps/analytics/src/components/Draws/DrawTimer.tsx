import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { useCountup } from '@shared/generic-react-hooks'
import classNames from 'classnames'
import { useDrawStatus } from '@hooks/useDrawStatus'
import { DrawCardItemTitle } from './DrawCardItemTitle'

interface DrawTimerProps {
  prizePool: PrizePool
  drawId: number
  className?: string
}

export const DrawTimer = (props: DrawTimerProps) => {
  const { prizePool, drawId, className } = props

  const { status, openedAt, closedAt, awardedAt, finalizedAt, isSkipped } = useDrawStatus(
    prizePool,
    drawId
  )

  const timestamp =
    status === 'finalized'
      ? finalizedAt
      : status === 'awarded'
      ? awardedAt
      : status === 'closed'
      ? closedAt
      : openedAt

  const { days, hours, minutes } = useCountup(timestamp ?? 0)
  const _hours = days * 24 + hours

  return (
    <div className={classNames('flex flex-col gap-3', className)}>
      {!!status && status !== 'finalized' && !isSkipped && (
        <>
          <DrawCardItemTitle>Time since {status}</DrawCardItemTitle>
          <div className='flex gap-1 items-center text-sm text-pt-purple-200'>
            {!!_hours && (
              <span className='flex items-center'>
                <span className='text-xl font-semibold'>{_hours}</span>Hr{_hours > 1 ? 's' : ''}
              </span>
            )}
            {!!minutes && (
              <span className='flex items-center'>
                <span className='text-xl font-semibold'>{minutes}</span>Min{minutes > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  )
}
