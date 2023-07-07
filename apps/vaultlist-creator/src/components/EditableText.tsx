import classNames from 'classnames'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { SimpleInput } from './forms/SimpleInput'

interface TextFormValues {
  text: string
}

interface EditableTextProps {
  value?: string
  onSubmit: (data: TextFormValues) => void
  validate?: { [rule: string]: (v: any) => true | string }
  disabled?: boolean
  className?: string
  textClassName?: string
  actionClassName?: string
}

export const EditableText = (props: EditableTextProps) => {
  const { value, onSubmit, validate, disabled, className, textClassName, actionClassName } = props

  const formMethods = useForm<TextFormValues>({ mode: 'onSubmit' })

  const [isEditing, setIsEditing] = useState<boolean>(false)

  const _onSubmit = (data: TextFormValues) => {
    setIsEditing(false)
    onSubmit(data)
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={classNames('relative flex items-center group', className)}
    >
      {isEditing && !disabled && (
        <FormProvider {...formMethods}>
          <form
            onSubmit={formMethods.handleSubmit(_onSubmit)}
            onBlur={formMethods.handleSubmit(_onSubmit)}
            className='w-full'
          >
            <SimpleInput
              formKey='text'
              validate={validate}
              defaultValue={value}
              hideErrorMsgs={true}
              autoFocus={true}
              innerClassName={classNames(
                '!py-0 !px-3 !bg-pt-transparent !border-none !outline-none !rounded',
                textClassName
              )}
              errorClassName='!text-pt-warning-light'
            />
          </form>
        </FormProvider>
      )}
      <span
        className={classNames(
          'self-start',
          { 'invisible w-0 !line-clamp-1': isEditing && !disabled },
          textClassName
        )}
      >
        {value}
      </span>
      {!isEditing && !disabled && (
        <span
          className={classNames(
            'text-xs text-pt-purple-300 absolute right-0 cursor-pointer',
            'hidden group-hover:block',
            actionClassName
          )}
        >
          edit
        </span>
      )}
    </div>
  )
}
