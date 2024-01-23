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

  const { setValue } = useFormContext<EpochLengthInputFormValues>()
  const { promotionEpochLength } = useWatch<EpochLengthInputFormValues>()

  const isSelected = !!promotionEpochLength && lengthTypes[type] === parseInt(promotionEpochLength)

  return (
    <Button
      onClick={() =>
        setValue('promotionEpochLength', lengthTypes[type].toString(), { shouldValidate: true })
      }
      color='transparent'
      className={classNames(
        'capitalize focus:ring-transparent',
        { '!border-pt-teal-dark': isSelected },
        className
      )}
    >
      1 {type}
    </Button>
  )
}

interface CustomEpochLengthInputProps {
  className?: string
}

export const CustomEpochLengthInput = (props: CustomEpochLengthInputProps) => {
  const { className } = props

  const { register } = useFormContext<EpochLengthInputFormValues>()
  const { promotionEpochLength } = useWatch<EpochLengthInputFormValues>()

  return (
    <div className={classNames('flex flex-col gap-1', className)}>
      <input
        id='customEpochLengthInput'
        {...register('promotionEpochLength', {
          validate: {
            isSelected: (v: string) => (!!v && !!parseInt(v)) || 'Select an epoch length!'
          }
        })}
        type='range'
        min={!!promotionEpochLength ? SECONDS_PER_HOUR : 0}
        max={SECONDS_PER_WEEK}
        step={SECONDS_PER_HOUR}
        value={promotionEpochLength ?? 0}
      />
      <span
        className={classNames('opacity-0', {
          'opacity-100':
            !!promotionEpochLength &&
            !!parseInt(promotionEpochLength) &&
            !Object.values(lengthTypes).includes(parseInt(promotionEpochLength))
        })}
      >
        Custom: {parseInt(promotionEpochLength ?? '0') / SECONDS_PER_HOUR} Hours
      </span>
    </div>
  )
}
