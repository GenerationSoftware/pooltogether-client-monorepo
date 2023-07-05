import classNames from 'classnames'
import { ReactNode } from 'react'
import { useFormContext } from 'react-hook-form'

interface SimpleInputProps {
  formKey: string
  id?: string
  validate?: { [rule: string]: (v: any) => true | string }
  placeholder?: string
  label?: ReactNode
  className?: string
}

export const SimpleInput = (props: SimpleInputProps) => {
  const { formKey, id, validate, placeholder, label, className } = props

  const { register } = useFormContext()

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
        className='px-4 py-3 text-sm bg-pt-purple-50 text-gray-700 rounded-lg border border-gray-300 focus:outline-none'
      />
    </div>
  )
}
