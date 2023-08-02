import { NetworkBadge } from '@shared/react-components'
import { NETWORK } from '@shared/utilities'
import classNames from 'classnames'
import { FormProvider, useForm, useFormContext, useWatch } from 'react-hook-form'
import { Address, isAddress } from 'viem'
import { PurpleButton } from '@components/buttons/PurpleButton'
import { SUPPORTED_NETWORKS } from '@constants/config'
import { useDeployedVaults } from '@hooks/useDeployedVaults'
import { SimpleInput } from './SimpleInput'

interface AddDeployedVaultFormValues {
  deployedVaultChainId: string
  deployedVaultAddress: string
}

interface AddDeployedVaultFormProps {
  className?: string
}

export const AddDeployedVaultForm = (props: AddDeployedVaultFormProps) => {
  const { className } = props

  const formMethods = useForm<AddDeployedVaultFormValues>({ mode: 'onChange' })

  const { addVault } = useDeployedVaults()

  const onSubmit = (data: AddDeployedVaultFormValues) => {
    addVault({
      chainId: parseInt(data.deployedVaultChainId),
      address: data.deployedVaultAddress.trim() as Address
    })
    formMethods.resetField('deployedVaultAddress')
  }

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className={classNames('flex flex-col gap-6 items-center text-center', className)}
      >
        <div className='flex flex-col gap-2 items-center'>
          <span className='text-xl text-pt-purple-300'>Add Prize Vault</span>
          <span className='text-sm text-pt-purple-100'>
            Don't see your prize vault listed here? Enter its network and address below to add it.
          </span>
        </div>
        <div className='flex flex-col gap-2 items-center'>
          <span className='text-sm text-pt-purple-100'>Select Network</span>
          <div className='flex flex-wrap gap-4 justify-center'>
            {SUPPORTED_NETWORKS.map((chainId) => (
              <ChainInput key={`chain-${chainId}`} chainId={chainId} />
            ))}
          </div>
        </div>
        <SimpleInput
          formKey='deployedVaultAddress'
          validate={{
            isValidAddress: (v: string) => isAddress(v?.trim()) || 'Enter a valid contract address.'
          }}
          placeholder='0x0000...'
          label='Enter Vault Address'
          className='w-full'
          labelClassName='!justify-center'
        />
        <PurpleButton type='submit' disabled={!formMethods.formState.isValid}>
          Add Vault
        </PurpleButton>
      </form>
    </FormProvider>
  )
}

interface ChainInputProps {
  chainId: NETWORK
}

const ChainInput = (props: ChainInputProps) => {
  const { chainId } = props

  const { register } = useFormContext<AddDeployedVaultFormValues>()

  const { deployedVaultChainId } = useWatch<AddDeployedVaultFormValues>()

  const id = `chain-${chainId}`

  const isSelected = !!deployedVaultChainId && chainId === parseInt(deployedVaultChainId)

  return (
    <div>
      <input
        id={id}
        {...register('deployedVaultChainId', {
          validate: { isSelected: (v: string) => !!v || 'Select a network!' }
        })}
        type='radio'
        value={chainId}
        className='hidden'
      />
      <label htmlFor={id}>
        <NetworkBadge
          chainId={chainId}
          onClick={() => {}}
          className={classNames({ 'outline outline-1 outline-pt-purple-100': isSelected })}
        />
      </label>
    </div>
  )
}
