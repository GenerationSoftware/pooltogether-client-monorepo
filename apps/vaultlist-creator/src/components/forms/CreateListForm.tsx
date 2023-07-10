import classNames from 'classnames'
import { useSetAtom } from 'jotai'
import { FormProvider, useForm } from 'react-hook-form'
import { appViewAtom, listNameAtom } from 'src/atoms'
import { isValidChars } from 'src/utils'
import { PurpleButton } from '@components/buttons/PurpleButton'
import { SimpleInput } from './SimpleInput'

interface CreateListFormValues {
  vaultListName: string
}

interface CreateListFormProps {
  className?: string
}

export const CreateListForm = (props: CreateListFormProps) => {
  const { className } = props

  const formMethods = useForm<CreateListFormValues>({ mode: 'onSubmit' })

  const setListName = useSetAtom(listNameAtom)

  const setAppView = useSetAtom(appViewAtom)

  const onSubmit = (data: CreateListFormValues) => {
    setListName(data.vaultListName.trim())
    setAppView('editing')
  }

  return (
    <FormProvider {...formMethods}>
      <div className={classNames('flex flex-col items-center', className)}>
        <h3 className='mb-4 font-semibold text-pt-purple-100 lg:mb-8 lg:text-2xl'>
          Create New Vault List
        </h3>
        <form
          onSubmit={formMethods.handleSubmit(onSubmit)}
          className='w-4/5 max-w-md flex flex-col text-pt-purple-100 lg:w-1/2'
        >
          <SimpleInput
            formKey='vaultListName'
            validate={{
              isNotFalsyString: (v: string) => !!v || 'Pick a name for your brand new vault list!',
              isValidString: (v: string) =>
                isValidChars(v, { allowSpaces: true }) || 'Invalid characters in name.'
            }}
            placeholder='My Very Cool List'
            label='Enter vault list name'
          />
          <PurpleButton type='submit' className='mt-6 self-center lg:mt-8'>
            <span className='lg:text-base'>Create Vault List</span>
          </PurpleButton>
        </form>
      </div>
    </FormProvider>
  )
}
