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
      <div className={classNames('flex flex-col items-center', className)}>
        <h3 className='mb-8 text-2xl font-semibold text-pt-purple-100'>Create New Vault List</h3>
        <form
          onSubmit={formMethods.handleSubmit(onSubmit)}
          className='w-1/2 flex flex-col text-pt-purple-100'
        >
          <label htmlFor='name' className='mb-2 text-sm font-medium'>
            Enter vault list name
          </label>
          <Input formKey='name' />
          <Button
            type='submit'
            color='purple'
            className='mt-8 self-center bg-pt-purple-400 border-pt-purple-400 hover:bg-pt-purple-500'
          >
            <span className='text-base text-pt-purple-50'>Create Vault List</span>
          </Button>
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
      className='px-4 py-3 bg-pt-purple-50 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none'
    />
  )
}
