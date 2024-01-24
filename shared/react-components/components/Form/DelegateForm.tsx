import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useUserVaultDelegate } from '@generationsoftware/hyperstructure-react-hooks'
import { Intl } from '@shared/types'
import { Spinner } from '@shared/ui'
import { atom, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Address, isAddress } from 'viem'
import { useAccount } from 'wagmi'
// import { AddressInput, AddressInputFormValues } from './AddressInput'
import { SimpleInput } from './SimpleInput'

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

  if (!isFetchedDelegate) {
    return <Spinner />
  }

  const onSubmit = async (data: DelegateFormValues) => {
    const twabController = await vault.getTWABController()
  }

  const formMethods = useForm<DelegateFormValues>({
    mode: 'on',
    defaultValues: { address: '' }
  })

  const setFormNewDelegateAddress = useSetAtom(delegateFormNewDelegateAddressAtom)

  useEffect(() => {
    setFormNewDelegateAddress('0x')
  }, [])

  const handleNewDelegateAddress = (newDelegateAddress: Address) => {
    if (isValidFormInput(newDelegateAddress)) {
      // prob don't need both of these:
      setFormNewDelegateAddress(newDelegateAddress)

      // prob don't need both of these:
      // formMethods.setValue('newDelegateAddress', newDelegateAddress, {
      //   shouldValidate: true
      // })
    } else {
      setFormToErroredState()
    }
  }

  const setFormToErroredState = () => {
    setFormNewDelegateAddress('0x')
  }

  return (
    <div className='flex flex-col'>
      <FormProvider {...formMethods}>
        <SimpleInput
          formKey='recipientAddress'
          validate={{
            isValidAddress: (v: string) => isAddress(v?.trim()) || 'Enter a valid wallet address.'
          }}
          placeholder='0x0000...'
          label='Recipient Address'
          needsOverride={true}
          keepValueOnOverride={true}
          className='w-full max-w-md'
        />

        {/* <AddressInput
          label={<>Delegated address</>}
          id='change-delegate-address'
          formKey='address'
          // on={handleAddress}
          validate={{
            isValidAddress: (v: string) => isAddress(v?.trim()) || 'Enter a valid wallet address.'
          }}
          needsOverride={true}
          placeholder={delegate}
          defaultValue={delegate}
          intl={intl}
          className='mb-0.5'
        /> */}
      </FormProvider>
    </div>
  )
}
