import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { Tooltip } from '@shared/ui'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { liquidationPairSmoothingFactorAtom } from 'src/atoms'
import { DeployLiquidationPairFormValues } from './DeployLiquidationPairForm'
import { SimpleInput } from './SimpleInput'

interface SmoothingFactorInputProps {
  className?: string
}

export const SmoothingFactorInput = (props: SmoothingFactorInputProps) => {
  const { className } = props

  const [smoothingFactor, setSmoothingFactor] = useAtom(liquidationPairSmoothingFactorAtom)

  const { smoothingFactor: _smoothingFactor } = useWatch<DeployLiquidationPairFormValues>()

  const { setValue } = useFormContext<DeployLiquidationPairFormValues>()

  useEffect(() => {
    setValue('smoothingFactor', smoothingFactor.toString(), { shouldValidate: true })
  }, [])

  useEffect(() => {
    if (!!_smoothingFactor && isValidSmoothingFactor(_smoothingFactor)) {
      setSmoothingFactor(parseFloat(_smoothingFactor))
    }
  }, [_smoothingFactor])

  return (
    <SimpleInput
      formKey='smoothingFactor'
      validate={{
        isValidNumber: (v: string) => /^-?\d+\.?\d*$/.test(v) || 'Enter a valid number.',
        isValidRange: (v: string) =>
          (parseFloat(v) >= 0 && parseFloat(v) < 1) ||
          'Enter a number between 0 (inclusive) and 1 (exclusive).',
        isNotTooPrecise: (v) =>
          v.split('.').length < 2 || v.split('.')[1].length <= 18 || 'Too many decimals'
      }}
      label={<SmoothingFactorInputLabel />}
      defaultValue={'0'}
      needsOverride={true}
      keepValueOnOverride={true}
      className={className}
    />
  )
}

const SmoothingFactorInputLabel = () => {
  return (
    <div className='flex gap-1 items-center whitespace-nowrap'>
      <span>Smoothing Factor</span>
      <Tooltip
        content={
          <div className='max-w-[32ch] flex flex-col gap-2 text-center whitespace-normal'>
            <span>
              The higher the smoothing factor, the lesser % of the available yield will be
              liquidated every auction.
            </span>
            <span>Example: At 0.1, 90% of yield is liquidated.</span>
            <span>Higher smoothing is recommended for prize vaults with infrequent yield.</span>
          </div>
        }
      >
        <InformationCircleIcon className='h-4 w-4' />
      </Tooltip>
    </div>
  )
}

const isValidSmoothingFactor = (val: string) => {
  return (
    !!val &&
    /^-?\d+\.?\d*$/.test(val) &&
    parseFloat(val) >= 0 &&
    parseFloat(val) < 1 &&
    (val.split('.').length < 2 || val.split('.')[1].length <= 18)
  )
}
