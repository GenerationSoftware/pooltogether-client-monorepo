import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useUserVaultDelegate } from '@generationsoftware/hyperstructure-react-hooks'
import { Intl } from '@shared/types'
import { Spinner } from '@shared/ui'
import { atom, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Address, isAddress } from 'viem'
import { useAccount } from 'wagmi'
import { SimpleInput } from './SimpleInput'

export const delegateFormNewDelegateAddressAtom = atom<Address>('0x')

interface DelegateFormValues {
  newDelegateAddress: Address
}

export interface DelegateFormProps {
  vault: Vault
  intl?: {
    base?: Intl<'changeDelegateAddress' | 'delegatedAddress'>
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

  const formMethods = useForm<DelegateFormValues>({ mode: 'onChange' })
  const { newDelegateAddress } = formMethods.watch()
  console.log(formMethods.watch())

  const setFormNewDelegateAddressAtom = useSetAtom(delegateFormNewDelegateAddressAtom)

  // console.log('newDelegateAddress')
  // console.log(newDelegateAddress)

  useEffect(() => {
    if (!!delegate && !newDelegateAddress) {
      console.log('setting default')
      console.log(delegate)
      // formMethods.setValue('newDelegateAddress', delegate, { shouldValidate: true })
    }
  }, [delegate])

  useEffect(() => {
    // console.log('newDelegateAddress changed!')
    // console.log(newDelegateAddress)
    // if (isAddress(newDelegateAddress?.trim())) {
    //   console.log('newDelegateAddress')
    //   console.log(newDelegateAddress)
    //   // setFormNewDelegateAddressAtom('0x')
    // }

    console.log('aloha')
    // if (isAddress(newDelegateAddress?.trim())) {
    console.log('in here')
    // prob don't need both of these:
    setFormNewDelegateAddressAtom(newDelegateAddress)

    // prob don't need both of these:
    // formMethods.setValue('newDelegateAddress', newDelegateAddress, {
    //   shouldValidate: true
    // })
    // } else {
    // setFormToErroredState()
    // }
  }, [newDelegateAddress])

  const setFormToErroredState = () => {
    // console.log('setting form to error state')
    // setFormNewDelegateAddressAtom('0x')
  }

  return (
    <div className='flex flex-col'>
      <FormProvider {...formMethods}>
        <SimpleInput
          formKey='newDelegateAddress'
          autoComplete='off'
          validate={{
            // isChanged: (v: string) =>
            //   v?.trim() !== delegate ||
            //   (intl?.errors?.('formErrors.unchangedDelegate') ?? ``),
            isValidAddress: (v: string) =>
              isAddress(v?.trim()) ||
              (intl?.errors?.('formErrors.invalidAddress') ?? `Enter a valid EVM address`)
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
