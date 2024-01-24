import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useUserVaultDelegate } from '@generationsoftware/hyperstructure-react-hooks'
import { Intl } from '@shared/types'
import { Spinner } from '@shared/ui'
import { atom, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { AddressInput, AddressInputFormValues } from './AddressInput'

// import { isValidFormInput } from './TxFormInput'

export const delegateFormNewDelegateAddressAtom = atom<Address>('0x')

interface DelegateFormValues {
  newDelegateAddress: Address
}

export interface DelegateFormProps {
  vault: Vault
  intl?: {
    base?: Intl<'balance'>
    errors?: Intl<'formErrors.invalidAddress'>
  }
}

export const DelegateForm = (props: DelegateFormProps) => {
  const { vault, intl } = props

  const { address: userAddress } = useAccount()

  const { data: delegate, isFetched: isFetchedDelegate } = useUserVaultDelegate(
    vault,
    userAddress as Address,
    { refetchOnWindowFocus: true }
  )
  console.log('delegate')
  console.log(delegate)

  if (!isFetchedDelegate) {
    return <Spinner />
  }

  const onSubmit = async (data: DelegateFormValues) => {
    const twabController = await vault.getTWABController()
  }

  const formMethods = useForm<AddressInputFormValues>({
    mode: 'onChange',
    defaultValues: { address: '' }
  })

  const setFormNewDelegateAddress = useSetAtom(delegateFormNewDelegateAddressAtom)

  useEffect(() => {
    setFormNewDelegateAddress('')
  }, [])

  const handleNewDelegateAddressChange = (newDelegateAddress: Address) => {
    if (isValidFormInput(newDelegateAddress)) {
      // prob don't need both of these:
      setFormNewDelegateAddress(newDelegateAddress)

      // prob don't need both of these:
      formMethods.setValue('newDelegateAddress', newDelegateAddress, {
        shouldValidate: true
      })
    } else {
      setFormToErroredState()
    }
  }

  const setFormToErroredState = () => {
    setFormNewDelegateAddress('')
  }

  return (
    <div className='flex flex-col'>
      <FormProvider {...formMethods}>
        <AddressInput
          id='change-delegate-address'
          formKey='address'
          // onChange={handleAddressChange}
          intl={intl}
          className='mb-0.5'
        />
      </FormProvider>
    </div>
  )
}
