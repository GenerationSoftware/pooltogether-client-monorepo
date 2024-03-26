import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { liquidationPairSmoothingFactorAtom } from 'src/atoms'
import { DeployLiquidationPairFormValues } from './DeployLiquidationPairForm'
import { SimpleInput } from './SimpleInput'

interface SmoothingFactorInputProps {
  className?: string
}

// TODO: add tooltip explaining this value (0.8 = 20% of yield liquidated per auction, etc.)
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
      label='Smoothing Factor'
      defaultValue={'0'}
      needsOverride={true}
      keepValueOnOverride={true}
      className={className}
    />
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
