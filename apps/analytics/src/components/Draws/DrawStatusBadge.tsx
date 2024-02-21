import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { Spinner } from '@shared/ui'
import classNames from 'classnames'
import { useDrawStatus } from '@hooks/useDrawStatus'

interface DrawStatusBadgeProps {
  prizePool: PrizePool
  drawId: number
  className?: string
}

export const DrawStatusBadge = (props: DrawStatusBadgeProps) => {
  const { prizePool, drawId, className } = props

  const { status, isSkipped, isFetched } = useDrawStatus(prizePool, drawId)

  return !isFetched ? (
    <Spinner className='after:border-y-pt-purple-300' />
  ) : (
    <div
      className={classNames(
        'w-full px-2 py-1 text-center text-xl rounded whitespace-nowrap',
        {
          'bg-blue-100 text-blue-600': status === 'open',
          'bg-yellow-100 text-yellow-500': status === 'closed' && !isSkipped,
          'bg-pt-warning-light text-pt-warning-dark': isSkipped,
          'bg-pt-purple-200 text-pt-purple-600': status === 'awarded',
          'bg-green-100 text-green-600': status === 'finalized'
        },
        className
      )}
    >
      <span>#{drawId}:</span> <span className='capitalize'>{isSkipped ? 'skipped' : status}</span>
    </div>
  )
}
