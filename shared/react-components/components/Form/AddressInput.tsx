import { Intl } from '@shared/types'
import classNames from 'classnames'
import { useFormContext, useWatch } from 'react-hook-form'
import { isAddress } from 'viem'

interface AddressInputFormValues {
  address: string
}

interface AddressInputProps {
  id: string
  className?: string
  intl?: {
    errors?: Intl<'formErrors.invalidAddress'>
  }
}

export const AddressInput = (props: AddressInputProps) => {
  const { className, id, intl } = props

  const { register } = useFormContext<AddressInputFormValues>()
  const { address } = useWatch<AddressInputFormValues>()
  console.log(address)

  return (
    <div className={className}>
      {/* <label htmlFor={id}>
        <NetworkBadge
          chainId={chainId}
          onClick={() => {}}
          className={classNames({ '!border-pt-teal-dark': isSelected })}
        />
      </label> */}
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
      />
    </div>
  )
}
