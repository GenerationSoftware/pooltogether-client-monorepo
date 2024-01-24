import { Intl } from '@shared/types'
import classNames from 'classnames'
import { ReactNode, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { isAddress } from 'viem'

export interface AddressInputFormValues {
  address: string
}

interface AddressInputProps {
  formKey: keyof AddressInputFormValues
  id: string
  label?: ReactNode
  placeholder?: string
  defaultValue?: string
  disabled?: boolean
  needsOverride?: boolean
  className?: string
  hideErrorMsgs?: boolean
  labelClassName?: string
  innerClassName?: string
  errorClassName?: string
  intl?: {
    errors?: Intl<'formErrors.invalidAddress'>
  }
}

export const AddressInput = (props: AddressInputProps) => {
  const {
    formKey,
    id,
    label,
    placeholder,
    defaultValue,
    disabled,
    needsOverride,
    className,
    hideErrorMsgs,
    labelClassName,
    innerClassName,
    errorClassName,
    intl
  } = props

  const { register, formState, setValue } = useFormContext<AddressInputFormValues>()
  const { address } = useWatch<AddressInputFormValues>()

  const error = formState.errors[formKey]?.message as string | undefined

  const [isActiveOverride, setIsActiveOverride] = useState<boolean>(false)

  return (
    <div className={className}>
      <label
        htmlFor={id ?? formKey}
        className={classNames('flex items-center justify-between text-sm mb-3', labelClassName)}
      >
        <span className='font-medium text-pt-purple-100'>{label}</span>
        {needsOverride && !isActiveOverride && (
          <span onClick={handleOverride} className='text-pt-teal-dark cursor-pointer underline'>
            override
          </span>
        )}
      </label>
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
            disabled={disabled || (needsOverride && !isActiveOverride)}
            placeholder={placeholder}
            defaultValue={defaultValue}
            value={address ?? ''}
            // className='min-w-0 flex-grow bg-transparent text-pt-purple-900 focus:outline-none text-sm'
            className={classNames(
              'px-3 py-2 text-sm leading-tight rounded-lg border outline outline-1',
              'md:px-4 md:py-3',
              {
                'bg-pt-purple-50 text-gray-700 border-gray-300':
                  !needsOverride || (needsOverride && isActiveOverride),
                'bg-transparent text-pt-teal-dark border-pt-teal':
                  needsOverride && !isActiveOverride,
                'brightness-75': disabled,
                [`outline-red-600 ${errorClassName}`]: !!error,
                'outline-transparent': !error
              },
              innerClassName
            )}
          />
        </div>
      </div>

      {!hideErrorMsgs && <span className='text-xs text-pt-warning-light'>{error}</span>}
    </div>
  )
}
