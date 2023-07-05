import classNames from 'classnames'
import { useFormContext } from 'react-hook-form'

interface SimpleInputProps {
  formKey: string
  id?: string
  validate?: { [rule: string]: (v: any) => true | string }
  placeholder?: string
  className?: string
}

export const SimpleInput = (props: SimpleInputProps) => {
  const { formKey, id, validate, placeholder, className } = props

  const { register } = useFormContext()

  return (
    <input
      id={id ?? formKey}
      {...register(formKey, { validate })}
      placeholder={placeholder}
      className={classNames(
        'px-4 py-3 text-sm bg-pt-purple-50 text-gray-700 rounded-lg',
        'border border-gray-300',
        'focus:outline-none',
        className
      )}
    />
  )
}
