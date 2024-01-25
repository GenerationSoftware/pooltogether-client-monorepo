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
    base?: Intl<'changeDelegateAddress'>
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

  const formMethods = useForm<DelegateFormValues>({ mode: 'onChange' })

  const setFormNewDelegateAddress = useSetAtom(delegateFormNewDelegateAddressAtom)

  const { newDelegateAddress } = formMethods.watch()

  useEffect(() => {
    !!delegate &&
      !newDelegateAddress &&
      formMethods.setValue('newDelegateAddress', delegate, { shouldValidate: true })

    // setFormNewDelegateAddress('0x')
  }, [delegate])

  useEffect(() => {
    // onChange(isAddress(recipientAddress) ? recipientAddress : undefined)
    if (isAddress(newDelegateAddress?.trim())) {
      setFormNewDelegateAddress('0x')
    }
  }, [newDelegateAddress])

  const handleNewDelegateAddress = (newDelegateAddress: Address) => {
    if (isAddress(newDelegateAddress?.trim())) {
      console.log('in here')
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
    console.log('setting form to error state')
    setFormNewDelegateAddress('0x')
  }

  return (
    <div className='flex flex-col'>
      <FormProvider {...formMethods}>
        <SimpleInput
          formKey='recipientAddress'
          validate={{
            isValidAddress: (v: string) =>
              isAddress(v?.trim()) ||
              (intl?.errors?.('formErrors.invalidAddress') ?? `Enter a valid EVM address`)
          }}
          placeholder={delegate}
          label='Delegated Address'
          needsOverride={true}
          overrideLabel={intl?.base?.('changeDelegateAddress') ?? `Change Delegate Address`}
          keepValueOnOverride={true}
          className='w-full max-w-md'
        />

        {/* <AddressInput
          label={<></>}
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
