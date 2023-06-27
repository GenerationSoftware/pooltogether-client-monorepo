import { TimeUnit } from '@pooltogether/hyperstructure-client-js'

export interface TimeDigitsProps {
  value: number | null
  type: TimeUnit.day | TimeUnit.hour | TimeUnit.minute | TimeUnit.second
}

export const TimeDigits = (props: TimeDigitsProps) => {
  const { value, type } = props

  return (
    <div className='flex flex-col items-center gap-2 text-xs text-gray-300 uppercase md:text-sm'>
      <div className='flex items-center justify-center w-12 h-10 text-base font-semibold bg-pt-purple-100 text-pt-pink-dark rounded-lg md:h-12 md:text-2xl'>
        {value?.toLocaleString(undefined, { minimumIntegerDigits: 2 }) ?? '00'}
      </div>
      {type === TimeUnit.day && <span>Days</span>}
      {type === TimeUnit.hour && <span>Hrs</span>}
      {type === TimeUnit.minute && <span>Mins</span>}
      {type === TimeUnit.second && <span>Secs</span>}
    </div>
  )
}
