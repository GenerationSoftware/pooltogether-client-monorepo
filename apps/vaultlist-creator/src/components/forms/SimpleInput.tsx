import classNames from 'classnames'
import { ReactNode } from 'react'
import { useFormContext } from 'react-hook-form'
import { FormKey } from 'src/types'

interface SimpleInputProps {
  formKey: FormKey
  id?: string
  validate?: { [rule: string]: (v: any) => true | string }
  placeholder?: string
  defaultValue?: string
  label?: ReactNode
  hideErrorMsgs?: boolean
  autoFocus?: boolean
  className?: string
  innerClassName?: string
  errorClassName?: string
}

export const SimpleInput = (props: SimpleInputProps) => {
  const {
    formKey,
    id,
    validate,
    placeholder,
    defaultValue,
    label,
    hideErrorMsgs,
    autoFocus,
    className,
    innerClassName,
    errorClassName
  } = props

  const { register, formState } = useFormContext()

  const error = formState.errors[formKey]?.message as string | undefined

  return (
    <div className={classNames('flex flex-col gap-2', className)}>
      {!!label && (
        <label htmlFor={id ?? formKey} className='text-sm font-medium text-pt-purple-100'>
          {label}
        </label>
      )}
      <input
        id={id ?? formKey}
        {...register(formKey, { validate })}
        placeholder={placeholder}
        defaultValue={defaultValue}
        autoFocus={autoFocus}
        className={classNames(
          'px-4 py-3 text-sm bg-pt-purple-50 text-gray-700 rounded-lg border border-gray-300 outline outline-1',
          {
            [`outline-red-600 ${errorClassName}`]: !!error,
            'outline-transparent': !error
          },
          innerClassName
        )}
      />
      {!hideErrorMsgs && <span className='text-xs text-pt-warning-light'>{error}</span>}
    </div>
  )
}
