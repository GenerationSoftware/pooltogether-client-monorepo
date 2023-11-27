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
}

export const EpochLengthInput = (props: EpochLengthInputProps) => {
  const { type, className } = props

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
        value={lengthTypes[type].toString()}
        className='hidden'
      />
      <label htmlFor={id}>
        <Button
          color='transparent'
          className={classNames('capitalize', { 'border-pt-teal-dark': isSelected })}
        >
          1 {type}
        </Button>
      </label>
    </div>
  )
}
