import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useUserVaultDelegate } from '@generationsoftware/hyperstructure-react-hooks'
import { PencilIcon } from '@heroicons/react/24/outline'
import { Intl } from '@shared/types'
import { Spinner } from '@shared/ui'
import { atom, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Address, isAddress } from 'viem'
import { useAccount } from 'wagmi'
import { DelegateModalView } from '../Modals/DelegateModal'
import { DelegationDescriptionTooltip } from '../Tooltips/DelegationDescriptionTooltip'
import { SimpleInput } from './SimpleInput'

export const delegateFormNewDelegateAddressAtom = atom<Address | undefined>('0x')

interface DelegateFormValues {
  newDelegateAddress: Address | undefined
}

export interface DelegateFormProps {
  vault: Vault
  modalView: DelegateModalView
  intl?: {
    tooltip?: Intl<'delegateDescription'>
    common?: Intl<'learnMore'>
    base?: Intl<'changeDelegateAddress' | 'changeDelegateAddressShort' | 'delegatedAddress'>
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

  const formMethods = useForm<DelegateFormValues>({ mode: 'onChange' })
  const { newDelegateAddress } = formMethods.watch()
  const { setValue } = formMethods

  const setFormNewDelegateAddressAtom = useSetAtom(delegateFormNewDelegateAddressAtom)

  const disabled = modalView === 'confirming' || modalView === 'waiting'

  const [isActiveOverride, setIsActiveOverride] = useState<boolean>(false)

  useEffect(() => {
    setIsActiveOverride(false)
    setValue('newDelegateAddress', undefined)
  }, [delegate])

  useEffect(() => {
    setFormNewDelegateAddressAtom(newDelegateAddress)
  }, [newDelegateAddress])

  if (!isFetchedDelegate) {
    return <Spinner />
  }

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
          label={
            <div className='flex items-center text-xs sm:text-sm'>
              <span className='mr-1'>
                {intl?.base?.('delegatedAddress') ?? `Delegated Address`}
              </span>
              <DelegationDescriptionTooltip intl={intl} className='whitespace-normal' />
            </div>
          }
          isActiveOverride={isActiveOverride}
          setIsActiveOverride={setIsActiveOverride}
          needsOverride={true}
          overrideLabel={
            <div className='flex items-center text-xs sm:text-sm'>
              <PencilIcon className='w-3 h-3 sm:w-4 sm:h-4 mr-1' />
              <span className='hidden sm:inline-block'>
                {intl?.base?.('changeDelegateAddress') ?? `Change Delegate Address`}
              </span>
              <span className='sm:hidden'>
                {intl?.base?.('changeDelegateAddressShort') ?? `Edit Delegate`}
              </span>
            </div>
          }
          keepValueOnOverride={true}
          className='w-full max-w-md'
        />
      </FormProvider>
    </div>
  )
}
