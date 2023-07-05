import { NetworkBadge } from '@shared/react-components'
import { VaultInfo } from '@shared/types'
import { NETWORK } from '@shared/utilities'
import classNames from 'classnames'
import { useAtom } from 'jotai'
import { FormProvider, useForm, useFormContext, useWatch } from 'react-hook-form'
import { vaultsAtom } from 'src/atoms'
import { isAddress } from 'viem'
import { PurpleButton } from '@components/PurpleButton'
import { useNetworks } from '@hooks/useNetworks'
import { SimpleInput } from './SimpleInput'

interface AddVaultFormValues {
  vaultName: string
  vaultAddress: `0x${string}`
  vaultChainId: string
}

interface AddVaultFormProps {
  className?: string
}

// TODO: better validation
// TODO: displaying errors
// TODO: need to handle invalid vaults (wrong addresses, etc.)
export const AddVaultForm = (props: AddVaultFormProps) => {
  const { className } = props

  const formMethods = useForm<AddVaultFormValues>({ mode: 'onSubmit' })

  const [vaultInfo, setVaultInfo] = useAtom(vaultsAtom)

  const networks = useNetworks()

  const onSubmit = (data: AddVaultFormValues) => {
    const newVault: VaultInfo = {
      name: data.vaultName,
      address: data.vaultAddress,
      chainId: parseInt(data.vaultChainId)
    }

    const existingVault = vaultInfo.find(
      (vault) => vault.chainId === newVault.chainId && vault.address === newVault.address
    )
    if (existingVault !== undefined) {
      formMethods.setError('root', { message: 'Vault has already been added to the list!' })
    } else {
      setVaultInfo([...vaultInfo, newVault])
      formMethods.reset()
    }
  }

  // TODO: only set this to complete if all fields are filled and/or selected
  const isFormComplete = true

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className={classNames('flex flex-col gap-8', className)}
      >
        <div className='flex gap-6'>
          <SimpleInput
            formKey='vaultName'
            validate={{ isNotFalsyString: (v) => !!v || 'Enter a valid keyword.' }}
            placeholder='Wrapped Bitcorn'
            label='Vault Name'
          />
          <SimpleInput
            formKey='vaultAddress'
            validate={{ isValidAddress: (v) => isAddress(v) || 'Enter a valid address.' }}
            placeholder='0x0000...'
            label='Vault Address'
          />
        </div>
        <div className='flex flex-col gap-2'>
          <span className='text-sm font-medium text-pt-purple-100'>Select Chain</span>
          <div className='flex flex-wrap gap-4'>
            {networks.map((chainId) => (
              <ChainInput chainId={chainId} />
            ))}
          </div>
        </div>
        <PurpleButton type='submit' disabled={!isFormComplete} className='self-start'>
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

  const { register } = useFormContext<AddVaultFormValues>()

  const { vaultChainId } = useWatch<AddVaultFormValues>()

  const id = `chain-${chainId}`

  const isSelected = !!vaultChainId && chainId === parseInt(vaultChainId)

  return (
    <div key={id}>
      <input
        id={id}
        {...register('vaultChainId', { validate: { isSelected: (v) => !!v || 'Select a chain!' } })}
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
