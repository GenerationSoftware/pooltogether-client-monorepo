import classNames from 'classnames'
import { FormProvider, useForm } from 'react-hook-form'
import { Address, isAddress } from 'viem'
import { PurpleButton } from '@components/buttons/PurpleButton'
import { useDeployedVaults } from '@hooks/useDeployedVaults'
import { SimpleInput } from './SimpleInput'

interface AddDeployedVaultFormValues {
  deployedVaultAddress: string
}

interface AddDeployedVaultFormProps {
  className?: string
}

export const AddDeployedVaultForm = (props: AddDeployedVaultFormProps) => {
  const { className } = props

  const formMethods = useForm<AddDeployedVaultFormValues>({ mode: 'onChange' })

  const { addVaultAddress } = useDeployedVaults()

  const onSubmit = (data: AddDeployedVaultFormValues) => {
    addVaultAddress(data.deployedVaultAddress.trim() as Address)
    formMethods.reset()
  }

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className={classNames('flex flex-col gap-4 items-center text-center', className)}
      >
        <span>Add Missing Prize Vault</span>
        <span className='text-pt-purple-100'>
          Don't see your prize vault listed here? Enter its address below to add it.
        </span>
        <SimpleInput
          formKey='deployedVaultAddress'
          validate={{
            isValidAddress: (v: string) => isAddress(v?.trim()) || 'Enter a valid contract address.'
          }}
          placeholder='0x0000...'
          className='w-full'
        />
        <PurpleButton type='submit' disabled={!formMethods.formState.isValid}>
          Add Vault
        </PurpleButton>
      </form>
    </FormProvider>
  )
}
