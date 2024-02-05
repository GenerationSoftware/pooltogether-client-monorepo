import { msToS, SECONDS_PER_HOUR, sToMs } from '@shared/utilities'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { promotionStartTimestampAtom } from 'src/atoms'

interface StartTimestampInputFormValues {
  promotionStartTimestamp: string
}

interface StartTimestampInputProps {
  className?: string
}

export const StartTimestampInput = (props: StartTimestampInputProps) => {
  const { className } = props

  const { register, formState } = useFormContext<StartTimestampInputFormValues>()

  const startTimestamp = useAtomValue(promotionStartTimestampAtom)

  const defaultValue = useMemo(() => {
    const date = new Date(sToMs(Number(startTimestamp)))
    const offsetDate = new Date(date.getTime() - sToMs(date.getTimezoneOffset() * 60))

    return offsetDate.toISOString().slice(0, 16)
  }, [startTimestamp])

  // TODO: should not assume the period length of twab rewards is always 1 hour
  const twabRewardsPeriodLength = SECONDS_PER_HOUR

  const error = formState.errors['promotionStartTimestamp']?.message

  return (
    <div className={classNames('flex flex-col gap-2', className)}>
      <span className='text-sm font-medium text-pt-purple-100'>
        When should the first epoch begin?
      </span>
      <input
        id='promotionStartTimestampInput'
        {...register('promotionStartTimestamp', {
          validate: {
            isSelected: (v: string) => !!v || 'Select a start date/time!',
            isValid: (v: string) =>
              msToS(new Date(v).getTime()) % twabRewardsPeriodLength === 0 ||
              'The starting time needs be on an hourly interval.'
          }
        })}
        type='datetime-local'
        step={twabRewardsPeriodLength}
        defaultValue={defaultValue}
        className={classNames('px-3 py-2 text-gray-700 rounded-lg', 'outline outline-1', {
          'outline-red-600': !!error,
          'outline-transparent': !error
        })}
      />
      <span className='text-xs text-pt-warning-light'>{error}</span>
    </div>
  )
}
