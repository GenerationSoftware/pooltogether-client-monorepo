import { Intl } from '@shared/types'
import classNames from 'classnames'
import { useFormContext, useWatch } from 'react-hook-form'
import { isAddress } from 'viem'

export interface AddressInputFormValues {
  address: string
}

interface AddressInputProps {
  id: string
  className?: string
  formKey: keyof AddressInputFormValues
  intl?: {
    errors?: Intl<'formErrors.invalidAddress'>
  }
}

export const AddressInput = (props: AddressInputProps) => {
  const { className, id, intl } = props

  const { register } = useFormContext<AddressInputFormValues>()
  const { address } = useWatch<AddressInputFormValues>()

  return (
    <div className={className}>
      {/* <label htmlFor={id}>
        <NetworkBadge
          chainId={chainId}
          onClick={() => {}}
          className={classNames({ '!border-pt-teal-dark': isSelected })}
        />
      </label> */}
      <div
        className={classNames(
          'relative bg-white p-3 rounded-lg',
          'border border-transparent focus-within:border-pt-transparent',
          className
        )}
      >
        <div className='flex justify-between gap-6'>
          <input
            id={id}
            {...register('address', {
              validate: {
                isValidAddress: (v: string) =>
                  !!v ||
                  !isAddress(v) ||
                  (intl?.errors?.('formErrors.invalidAddress') ?? `Enter a valid EVM address`)
              }
            })}
            type='input'
            value={address ?? ''}
            className='min-w-0 flex-grow bg-transparent text-pt-purple-900 focus:outline-none text-sm'
          />
        </div>
      </div>
    </div>
  )
}
