import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useUserVaultDelegate } from '@generationsoftware/hyperstructure-react-hooks'
import { Intl } from '@shared/types'
import { Spinner } from '@shared/ui'
import { atom, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Address, isAddress } from 'viem'
import { useAccount } from 'wagmi'
import { DelegateModalView } from '../Modals/DelegateModal'
import { SimpleInput } from './SimpleInput'

export const delegateFormNewDelegateAddressAtom = atom<Address>('0x')

interface DelegateFormValues {
  newDelegateAddress: Address
}

export interface DelegateFormProps {
  vault: Vault
  modalView: DelegateModalView
  intl?: {
    base?: Intl<'changeDelegateAddress' | 'delegatedAddress'>
    errors?: Intl<'formErrors.invalidAddress' | 'formErrors.sameAsDelegate'>
  }
}

export const DelegateForm = (props: DelegateFormProps) => {
  const { vault, modalView, intl } = props

  const { address: userAddress } = useAccount()

  const { data: delegate, isFetched: isFetchedDelegate } = useUserVaultDelegate(
    vault,
    userAddress as Address,
    { refetchOnWindowFocus: true }
  )

  if (!isFetchedDelegate) {
    return <Spinner />
  }

  const formMethods = useForm<DelegateFormValues>({ mode: 'onChange' })
  const { newDelegateAddress } = formMethods.watch()

  const setFormNewDelegateAddressAtom = useSetAtom(delegateFormNewDelegateAddressAtom)

  useEffect(() => {
    setFormNewDelegateAddressAtom(newDelegateAddress)
  }, [newDelegateAddress])

  const disabled = modalView === 'confirming' || modalView === 'waiting'

  // TODO: Put override state here so when the tx completes we can disable isActiveOverride

  return (
    <div className='flex flex-col'>
      <FormProvider {...formMethods}>
        <SimpleInput
          formKey='newDelegateAddress'
          autoComplete='off'
          disabled={disabled}
          validate={{
            isValidAddress: (v: string) =>
              isAddress(v?.trim()) ||
              (intl?.errors?.('formErrors.invalidAddress') ?? `Enter a valid EVM address`),
            isSameAsDelegate: (v: string) =>
              v?.trim() !== delegate ||
              (intl?.errors?.('formErrors.sameAsDelegate') ??
                `Address entered is same as current delegate`)
          }}
          placeholder={delegate}
          label={intl?.base?.('delegatedAddress') ?? `Delegated Address`}
          needsOverride={true}
          overrideLabel={intl?.base?.('changeDelegateAddress') ?? `Change Delegate Address`}
          keepValueOnOverride={true}
          className='w-full max-w-md'
        />
      </FormProvider>
    </div>
  )
}
