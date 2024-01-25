import classNames from 'classnames'
import { ReactNode, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
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
  disabled?: boolean
  needsOverride?: boolean
  overrideLabel?: string
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
    validate,
    placeholder,
    defaultValue,
    label,
    hideErrorMsgs,
    autoFocus,
    disabled,
    needsOverride,
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

  const [isActiveOverride, setIsActiveOverride] = useState<boolean>(false)

  const handleOverride = () => {
    !keepValueOnOverride && setValue(formKey, '')
    setIsActiveOverride(true)
    onOverride?.(true)
  }

  const handleBlur = () => {
    if ((needsOverride && !formValues[formKey]) || formValues[formKey] === defaultValue) {
      setValue(formKey, defaultValue, { shouldValidate: true })
      setIsActiveOverride(false)
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
          <span onClick={handleOverride} className='text-pt-teal-dark cursor-pointer underline'>
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
        disabled={disabled || (needsOverride && !isActiveOverride)}
        onBlur={handleBlur}
        className={classNames(
          'px-3 py-2 text-sm leading-tight rounded-lg border outline outline-1',
          'md:px-4 md:py-3',
          {
            'bg-pt-purple-50 text-gray-700 border-gray-300':
              !needsOverride || (needsOverride && isActiveOverride),
            'bg-transparent text-pt-teal-dark border-pt-teal': needsOverride && !isActiveOverride,
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
