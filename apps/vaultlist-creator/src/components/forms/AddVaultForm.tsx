import { NetworkBadge } from '@shared/react-components'
import { VaultInfo } from '@shared/types'
import { NETWORK } from '@shared/utilities'
import classNames from 'classnames'
import { useAtom } from 'jotai'
import { FormProvider, useForm, useFormContext, useWatch } from 'react-hook-form'
import { vaultsAtom } from 'src/atoms'
import { isValidChars } from 'src/utils'
import { Address, isAddress } from 'viem'
import { PurpleButton } from '@components/buttons/PurpleButton'
import { useNetworks } from '@hooks/useNetworks'
import { SimpleInput } from './SimpleInput'

interface AddVaultFormValues {
  vaultName: string
  vaultAddress: Address
  vaultChainId: string
}

interface AddVaultFormProps {
  className?: string
}

export const AddVaultForm = (props: AddVaultFormProps) => {
  const { className } = props

  const formMethods = useForm<AddVaultFormValues>({ mode: 'onSubmit' })

  const [vaultInfo, setVaultInfo] = useAtom(vaultsAtom)

  const networks = useNetworks()

  const onSubmit = (data: AddVaultFormValues) => {
    const newVault: VaultInfo = {
      name: data.vaultName.trim(),
      address: data.vaultAddress.trim() as Address,
      chainId: parseInt(data.vaultChainId)
    }

    const existingVault = vaultInfo.find(
      (vault) =>
        vault.chainId === newVault.chainId &&
        vault.address.toLowerCase() === newVault.address.toLowerCase()
    )
    if (existingVault !== undefined) {
      formMethods.setError('root', { message: 'Vault has already been added to the list!' })
    } else {
      setVaultInfo([...vaultInfo, newVault])
      formMethods.reset()
    }
  }

  const getError = () => {
    const errors = formMethods.formState.errors

    if (!!errors.vaultName?.message && !!errors.vaultAddress?.message) {
      return 'Enter a valid vault name and address.'
    }

    return (
      errors.vaultName?.message ??
      errors.vaultAddress?.message ??
      errors.vaultChainId?.message ??
      errors.root?.message
    )
  }

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className={classNames(
          'flex flex-col gap-3 rounded-2xl lg:gap-8 lg:p-8 lg:bg-pt-transparent',
          className
        )}
      >
        <div className='flex gap-3 justify-between px-6 lg:gap-6 lg:justify-start lg:px-0'>
          <SimpleInput
            formKey='vaultName'
            validate={{
              isNotFalsyString: (v: string) => !!v || 'Enter a valid vault name.',
              isValidString: (v: string) =>
                isValidChars(v, { allowSpaces: true }) || 'Invalid characters in vault name.'
            }}
            placeholder='Wrapped Bitcorn'
            label='Vault Name'
            hideErrorMsgs={true}
            className='max-w-[calc(50%-6px)] lg:max-w-none'
          />
          <SimpleInput
            formKey='vaultAddress'
            validate={{
              isValidAddress: (v: string) => isAddress(v?.trim()) || 'Enter a valid vault address.'
            }}
            placeholder='0x0000...'
            label='Vault Address'
            hideErrorMsgs={true}
            className='max-w-[calc(50%-6px)] lg:max-w-none'
          />
        </div>
        <div className='flex flex-col gap-2'>
          <span className='px-6 text-sm font-medium text-pt-purple-100 lg:px-0'>
            Select Network
          </span>
          <div className='flex gap-2 px-6 py-0.5 overflow-x-auto no-scrollbar lg:flex-wrap lg:gap-4 lg:px-0.5'>
            {networks.map((chainId) => (
              <ChainInput key={`chain-${chainId}`} chainId={chainId} />
            ))}
          </div>
        </div>
        <div className='flex flex-col items-center gap-4 justify-center mt-6 lg:flex-row lg:justify-start lg:mt-0'>
          <PurpleButton type='submit'>Add Vault</PurpleButton>
          <span className='text-sm text-pt-warning-light'>{getError()}</span>
        </div>
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
    <div>
      <input
        id={id}
        {...register('vaultChainId', {
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
