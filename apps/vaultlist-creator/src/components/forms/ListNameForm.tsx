import classNames from 'classnames'
import { useSetAtom } from 'jotai'
import { FormProvider, useForm } from 'react-hook-form'
import { appViewAtom, listNameAtom } from 'src/atoms'
import { PurpleButton } from '@components/PurpleButton'
import { SimpleInput } from './SimpleInput'

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
          <SimpleInput
            formKey='name'
            validate={{
              isNotFalsyString: (v) => !!v || 'Enter a name here!'
            }}
            placeholder='My Very Cool List'
          />
          <PurpleButton type='submit' className='mt-8 self-center'>
            <span className='text-base'>Create Vault List</span>
          </PurpleButton>
        </form>
      </div>
    </FormProvider>
  )
}
