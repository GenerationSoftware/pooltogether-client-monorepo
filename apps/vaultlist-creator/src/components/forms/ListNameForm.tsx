import { Button } from '@shared/ui'
import classNames from 'classnames'
import { useSetAtom } from 'jotai'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { appViewAtom, listNameAtom } from 'src/atoms'

interface ListNameFormValues {
  name: string
}

interface ListNameFormProps {
  className?: string
}

// TODO: better string validation
// TODO: displaying errors
export const ListNameForm = (props: ListNameFormProps) => {
  const { className } = props

  const formMethods = useForm<ListNameFormValues>({ mode: 'onSubmit' })

  const setListName = useSetAtom(listNameAtom)

  const setAppView = useSetAtom(appViewAtom)

  const onSubmit = (data: ListNameFormValues) => {
    setListName(data.name)
    setAppView('editing')
  }

  return (
    <FormProvider {...formMethods}>
      <div className={classNames('', className)}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)}>
          <Input formKey='name' />
          <Button type='submit'>Create Vault List</Button>
        </form>
      </div>
    </FormProvider>
  )
}

interface InputProps {
  formKey: keyof ListNameFormValues
  validate?: { [rule: string]: (v: any) => true | string }
}

const Input = (props: InputProps) => {
  const { formKey, validate } = props

  const { register } = useFormContext<ListNameFormValues>()

  const basicValidation: { [rule: string]: (v: any) => true | string } = {
    isNotFalsyString: (v) => !!v || 'Enter a name here!'
  }

  return (
    <input
      id={formKey}
      {...register(formKey, {
        validate: { ...basicValidation, ...validate }
      })}
      placeholder='...'
      className='text-gray-700'
    />
  )
}
