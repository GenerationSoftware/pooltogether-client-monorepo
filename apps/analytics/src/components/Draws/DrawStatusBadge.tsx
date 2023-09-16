import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import classNames from 'classnames'
import { useDrawStatus } from '@hooks/useDrawStatus'

interface DrawStatusBadgeProps {
  prizePool: PrizePool
  drawId: number
  className?: string
}

export const DrawStatusBadge = (props: DrawStatusBadgeProps) => {
  const { prizePool, drawId, className } = props

  const { status } = useDrawStatus(prizePool, drawId)

  return (
    <div
      className={classNames(
        'w-full px-2 py-1 text-center text-xl rounded whitespace-nowrap',
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
