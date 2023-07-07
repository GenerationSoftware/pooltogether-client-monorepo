import classNames from 'classnames'
import { useAtom } from 'jotai'
import { FormProvider, useForm } from 'react-hook-form'
import { listImageAtom } from 'src/atoms'
import { SimpleInput } from './SimpleInput'

interface ListImageFormValues {
  vaultListImage: string
}

interface ListImageFormProps {
  className?: string
}

export const ListImageForm = (props: ListImageFormProps) => {
  const { className } = props

  const formMethods = useForm<ListImageFormValues>({ mode: 'onSubmit' })

  const [listImage, setListImage] = useAtom(listImageAtom)

  const onSubmit = (data: ListImageFormValues) => {
    setListImage(!!data.vaultListImage ? data.vaultListImage.trim() : '')
  }

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onSubmit)}
        onBlur={formMethods.handleSubmit(onSubmit)}
        className={classNames('w-full', className)}
      >
        <SimpleInput
          formKey='vaultListImage'
          validate={{
            isValidURI: (v: string) =>
              !v ||
              v.startsWith('http://') ||
              v.startsWith('https://') ||
              v.startsWith('ipfs://') ||
              v.startsWith('ipns://') ||
              'Not a valid URL.'
          }}
          placeholder='https:// or ipfs://'
          defaultValue={listImage}
          label='Logo (optional)'
        />
      </form>
    </FormProvider>
  )
}
