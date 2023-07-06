import { PencilIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { SimpleInput } from './forms/SimpleInput'

interface TextFormValues {
  text: string
}

interface EditableTextProps {
  value: string
  onSubmit: (data: TextFormValues) => void
  validate?: { [rule: string]: (v: any) => true | string }
  className?: string
  textClassName?: string
  iconClassName?: string
}

export const EditableText = (props: EditableTextProps) => {
  const { value, onSubmit, validate, className, textClassName, iconClassName } = props

  const formMethods = useForm<TextFormValues>({ mode: 'onSubmit' })

  const [isEditing, setIsEditing] = useState<boolean>(false)

  const _onSubmit = (data: TextFormValues) => {
    setIsEditing(false)
    onSubmit(data)
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={classNames('relative flex gap-2 items-center group', className)}
    >
      {isEditing && (
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
                '!p-0 !bg-transparent border-current border-x-transparent border-t-transparent !outline-none !rounded-none',
                textClassName
              )}
              errorClassName='!text-pt-warning-light'
            />
          </form>
        </FormProvider>
      )}
      <span
        className={classNames(
          'self-start border-b-2 border-transparent',
          { 'invisible w-0 line-clamp-1': isEditing },
          textClassName
        )}
      >
        {value}
      </span>
      {!isEditing && (
        <PencilIcon
          className={classNames('w-5 h-5 absolute right-0 hidden group-hover:block', iconClassName)}
        />
      )}
    </div>
  )
}
