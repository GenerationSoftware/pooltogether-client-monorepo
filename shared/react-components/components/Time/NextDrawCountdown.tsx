import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { useNextDrawTimestamps } from '@generationsoftware/hyperstructure-react-hooks'
import { useCountdown } from '@shared/generic-react-hooks'
import { TimeUnit } from '@shared/types'
import { Spinner } from '@shared/ui'
import classNames from 'classnames'
import { TimeDigits } from './TimeDigits'

export interface NextDrawCountdownProps {
  prizePool: PrizePool
  intl?: { title?: string; abbreviations?: { hours?: string; minutes?: string; seconds?: string } }
  className?: string
}

export const NextDrawCountdown = (props: NextDrawCountdownProps) => {
  const { prizePool, intl, className } = props

  const { data: nextDraw } = useNextDrawTimestamps(prizePool)

  const { days, hours, minutes, seconds } = useCountdown(nextDraw?.start ?? 0)

  return (
    <div className={classNames('flex flex-col items-center gap-4', className)}>
      <span className='text-xs text-gray-200 font-semibold uppercase md:text-base'>
        {intl?.title ?? 'Next Draw In'}
      </span>
      {!!nextDraw ? (
        <div className='flex gap-4'>
          <TimeDigits value={hours + days * 24} type={TimeUnit.hour} intl={intl?.abbreviations} />
          <TimeDigits value={minutes} type={TimeUnit.minute} intl={intl?.abbreviations} />
          <TimeDigits value={seconds} type={TimeUnit.second} intl={intl?.abbreviations} />
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  )
}
