import { PrizePool, TimeUnit } from '@pooltogether/hyperstructure-client-js'
import { useNextDrawTimestamps } from '@pooltogether/hyperstructure-react-hooks'
import { useCountdown } from '@shared/generic-react-hooks'
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

  const { hours, minutes, seconds } = useCountdown(nextDraw?.start ?? 0)

  return (
    <div className={classNames('flex flex-col items-center gap-4', className)}>
      <span className='text-xs text-gray-200 font-semibold uppercase md:text-base'>
        {intl?.title ?? 'Next Draw In'}
      </span>
      {!!nextDraw ? (
        <div className='flex gap-4'>
          <TimeDigits value={hours} type={TimeUnit.hour} intl={intl?.abbreviations} />
          <TimeDigits value={minutes} type={TimeUnit.minute} intl={intl?.abbreviations} />
          <TimeDigits value={seconds} type={TimeUnit.second} intl={intl?.abbreviations} />
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  )
}
