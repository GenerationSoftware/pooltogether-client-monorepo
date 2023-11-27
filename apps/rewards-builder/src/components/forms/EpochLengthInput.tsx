import { Button } from '@shared/ui'
import { SECONDS_PER_DAY, SECONDS_PER_HOUR, SECONDS_PER_WEEK } from '@shared/utilities'
import classNames from 'classnames'
import { useFormContext, useWatch } from 'react-hook-form'

type LengthType = 'hour' | 'day' | 'week'
const lengthTypes: Record<LengthType, number> = {
  hour: SECONDS_PER_HOUR,
  day: SECONDS_PER_DAY,
  week: SECONDS_PER_WEEK
}

interface EpochLengthInputFormValues {
  promotionEpochLength: string
}

interface EpochLengthInputProps {
  type: LengthType
  className?: string
  labelClassName?: string
}

export const EpochLengthInput = (props: EpochLengthInputProps) => {
  const { type, className, labelClassName } = props

  const { register } = useFormContext<EpochLengthInputFormValues>()
  const { promotionEpochLength } = useWatch<EpochLengthInputFormValues>()

  const id = `epochLength-${type}`
  const isSelected = !!promotionEpochLength && lengthTypes[type] === parseInt(promotionEpochLength)

  return (
    <div className={className}>
      <input
        id={id}
        {...register('promotionEpochLength', {
          validate: { isSelected: (v: string) => !!v || 'Select an epoch length!' }
        })}
        type='radio'
        value={lengthTypes[type]}
        className='hidden'
      />
      <label htmlFor={id}>
        <span
          className={classNames(
            'inline-flex items-center justify-center gap-1 px-3 py-2 text-sm rounded-lg capitalize',
            'border border-pt-transparent bg-pt-transparent',
            'cursor-pointer select-none hover:bg-pt-purple-50/20',
            { '!border-pt-teal-dark': isSelected },
            labelClassName
          )}
        >
          1 {type}
        </span>
      </label>
    </div>
  )
}
