import classNames from 'classnames'
import { ReactNode } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

// TODO: Discuss how we can put this in apps/app/src/types (instead of shared/react-components...)
export type FormKey = 'newDelegateAddress'

interface SimpleInputProps {
  formKey: any
  id?: string
  autoComplete?: string
  validate?: { [rule: string]: (v: any) => true | string }
  placeholder?: string
  defaultValue?: string
  label?: ReactNode
  hideErrorMsgs?: boolean
  autoFocus?: boolean
  disabled?: boolean
  needsOverride?: boolean
  isActiveOverride?: boolean
  setIsActiveOverride?: (val: boolean) => void
  overrideLabel?: ReactNode | string
  keepValueOnOverride?: boolean
  onOverride?: (val: boolean) => void
  className?: string
  labelClassName?: string
  innerClassName?: string
  errorClassName?: string
}

export const SimpleInput = (props: SimpleInputProps) => {
  const {
    formKey,
    id,
    autoComplete,
    validate,
    placeholder,
    defaultValue,
    label,
    hideErrorMsgs,
    autoFocus,
    disabled,
    needsOverride,
    setIsActiveOverride,
    isActiveOverride,
    overrideLabel,
    keepValueOnOverride,
    onOverride,
    className,
    labelClassName,
    innerClassName,
    errorClassName
  } = props

  const { register, formState, setValue } = useFormContext()

  const formValues = useWatch()

  const handleOverride = () => {
    !keepValueOnOverride && setValue(formKey, '')
    setIsActiveOverride?.(true)
    onOverride?.(true)
  }

  const handleBlur = () => {
    if ((needsOverride && !formValues[formKey]) || formValues[formKey] === defaultValue) {
      setValue(formKey, defaultValue, { shouldValidate: true })
      setIsActiveOverride?.(false)
      onOverride?.(false)
    }
  }

  const error = formState.errors[formKey]?.message as string | undefined

  return (
    <div className={classNames('flex flex-col gap-2', className)}>
      <label
        htmlFor={id ?? formKey}
        className={classNames('flex items-center justify-between text-sm', labelClassName)}
      >
        <span className='font-medium text-pt-purple-100'>{label}</span>
        {needsOverride && !isActiveOverride && (
          <span onClick={handleOverride} className='text-pt-teal cursor-pointer underline'>
            {overrideLabel ?? 'override'}
          </span>
        )}
      </label>
      <input
        id={id ?? formKey}
        {...register(formKey, { validate })}
        placeholder={placeholder}
        defaultValue={defaultValue}
        autoFocus={autoFocus}
        onBlur={handleBlur}
        autoComplete={autoComplete}
        onClick={handleOverride}
        className={classNames(
          'px-3 py-2 text-sm leading-tight rounded-lg border outline outline-1',
          'md:px-4 md:py-3',
          {
            'bg-pt-purple-50 text-gray-700 border-gray-300':
              !needsOverride || (needsOverride && isActiveOverride),
            'bg-transparent text-pt-teal border-pt-teal cursor-pointer':
              needsOverride && !isActiveOverride,
            'brightness-75': disabled,
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
