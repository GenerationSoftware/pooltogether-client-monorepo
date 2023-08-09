import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { liquidationPairAddressAtom } from 'src/atoms'
import { isAddress } from 'viem'
import { SetLiquidationPairFormValues } from './SetLiquidationPairForm'
import { SimpleInput } from './SimpleInput'

interface LiquidationPairAddressInputProps {
  className?: string
}

export const LiquidationPairAddressInput = (props: LiquidationPairAddressInputProps) => {
  const { className } = props

  const [_lpAddress, setLpAddress] = useAtom(liquidationPairAddressAtom)

  const { lpAddress } = useWatch<SetLiquidationPairFormValues>()

  const { setValue } = useFormContext<SetLiquidationPairFormValues>()

  useEffect(() => {
    setValue('lpAddress', _lpAddress ?? '', {
      shouldValidate: true
    })
  }, [])

  useEffect(() => {
    if (!!lpAddress && isAddress(lpAddress)) {
      setLpAddress(lpAddress)
    }
  }, [lpAddress])

  return (
    <SimpleInput
      formKey='lpAddress'
      validate={{
        isValidAddress: (v: string) => isAddress(v?.trim()) || 'Enter a valid contract address.'
      }}
      placeholder='0x0000...'
      defaultValue={lpAddress ?? ''}
      label='Liquidation Pair'
      needsOverride={!!lpAddress}
      className={className}
    />
  )
}
