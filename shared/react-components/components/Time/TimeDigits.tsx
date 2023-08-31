import { TimeUnit } from '@shared/types'

export interface TimeDigitsProps {
  value: number | null
  type: TimeUnit.day | TimeUnit.hour | TimeUnit.minute | TimeUnit.second
  intl?: { days?: string; hours?: string; minutes?: string; seconds?: string }
}

export const TimeDigits = (props: TimeDigitsProps) => {
  const { value, type, intl } = props

  const labels: Partial<Record<TimeUnit, string>> = {
    day: intl?.days ?? 'days',
    hour: intl?.hours ?? 'hrs',
    minute: intl?.minutes ?? 'mins',
    second: intl?.seconds ?? 'secs'
  }

  return (
    <div className='flex flex-col items-center gap-2 text-xs text-gray-300 uppercase md:text-sm'>
      <div className='flex items-center justify-center w-12 h-10 text-base font-semibold bg-pt-purple-100 text-pt-pink-dark rounded-lg md:h-12 md:text-2xl'>
        {value?.toLocaleString(undefined, { minimumIntegerDigits: 2 }) ?? '00'}
      </div>
      <span>{labels[type]}</span>
    </div>
  )
}
