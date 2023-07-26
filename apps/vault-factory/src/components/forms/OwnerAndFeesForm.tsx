import classNames from 'classnames'
import { useSetAtom } from 'jotai'
import { FormProvider, useForm } from 'react-hook-form'
import {
  vaultFeePercentageAtom,
  vaultFeeRecipientAddressAtom,
  vaultOwnerAddressAtom
} from 'src/atoms'
import { Address, isAddress, zeroAddress } from 'viem'
import { NextButton } from '@components/buttons/NextButton'
import { PrevButton } from '@components/buttons/PrevButton'
import { useSteps } from '@hooks/useSteps'
import { SimpleInput } from './SimpleInput'

interface OwnerAndFeesFormValues {
  vaultOwner: string
  vaultFee: string
  vaultFeeRecipient: string
}

interface OwnerAndFeesFormProps {
  className?: string
}

// TODO: form should auto-fill with existing data in case of returning from other step
// TODO: owner address should pre-populate with connect wallet's address
export const OwnerAndFeesForm = (props: OwnerAndFeesFormProps) => {
  const { className } = props

  const formMethods = useForm<OwnerAndFeesFormValues>({ mode: 'onChange' })

  const setVaultOwner = useSetAtom(vaultOwnerAddressAtom)
  const setVaultFeePercentage = useSetAtom(vaultFeePercentageAtom)
  const setVaultFeeRecipient = useSetAtom(vaultFeeRecipientAddressAtom)

  const { nextStep } = useSteps()

  const onSubmit = (data: OwnerAndFeesFormValues) => {
    setVaultOwner(data.vaultOwner.trim() as Address)
    setVaultFeePercentage(parseFloat(data.vaultFee) * 1e7)
    setVaultFeeRecipient(data.vaultFeeRecipient.trim() as Address)
    nextStep()
  }

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className={classNames('flex flex-col grow gap-12 items-center', className)}
      >
        <SimpleInput
          formKey='vaultOwner'
          validate={{
            isValidAddress: (v: string) => isAddress(v?.trim()) || 'Enter a valid wallet address.'
          }}
          placeholder='0x0000...'
          label='Vault Owner'
          className='w-full max-w-md'
        />
        <SimpleInput
          formKey='vaultFee'
          validate={{
            isValidNumber: (v: string) => !isNaN(parseFloat(v)) || 'Enter a valid number.',
            isValidPercentage: (v: string) =>
              (parseFloat(v) >= 0 && parseFloat(v) <= 100) || 'Enter a number between 0 and 100.',
            isNotTooPrecise: (v) =>
              v.split('.').length < 2 || v.split('.')[1].length <= 6 || 'Too many decimals'
          }}
          defaultValue={'0'}
          label='Yield Fee %'
          needsOverride={true}
          className='w-full max-w-md'
        />
        <SimpleInput
          formKey='vaultFeeRecipient'
          validate={{
            isValidAddress: (v: string) => isAddress(v?.trim()) || 'Enter a valid wallet address.'
          }}
          defaultValue={zeroAddress}
          label='Fee Recipient'
          needsOverride={true}
          className='w-full max-w-md'
        />
        <div className='flex gap-2 items-center'>
          <PrevButton />
          <NextButton disabled={!formMethods.formState.isValid} />
        </div>
      </form>
    </FormProvider>
  )
}
