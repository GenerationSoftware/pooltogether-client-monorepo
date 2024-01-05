import classNames from 'classnames'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Address, isAddress } from 'viem'
import { useAccount } from 'wagmi'
import { SimpleInput } from './SimpleInput'

interface RecipientFormValues {
  recipientAddress: string
}

interface RecipientFormProps {
  onChange: (recipientAddress: Address | undefined) => void
  className?: string
}

export const RecipientForm = (props: RecipientFormProps) => {
  const { onChange, className } = props

  const formMethods = useForm<RecipientFormValues>({ mode: 'onChange' })

  const { recipientAddress } = formMethods.watch()

  const { address: userAddress } = useAccount()

  useEffect(() => {
    !!userAddress &&
      !recipientAddress &&
      formMethods.setValue('recipientAddress', userAddress, { shouldValidate: true })
  }, [userAddress])

  useEffect(() => {
    onChange(isAddress(recipientAddress) ? recipientAddress : undefined)
  }, [recipientAddress])

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(() => {})}
        className={classNames('flex flex-col items-center justify-center', className)}
      >
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
      </form>
    </FormProvider>
  )
}
