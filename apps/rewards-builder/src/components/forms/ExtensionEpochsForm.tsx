import classNames from 'classnames'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { SimpleInput } from './SimpleInput'

interface ExtensionEpochsFormValues {
  numExtensionEpochs: string
}

interface ExtensionEpochsFormProps {
  numPromotionEpochs: number
  onChange: (numEpochs: number) => void
  className?: string
}

export const ExtensionEpochsForm = (props: ExtensionEpochsFormProps) => {
  const { numPromotionEpochs, onChange, className } = props

  const formMethods = useForm<ExtensionEpochsFormValues>({ mode: 'onChange' })

  const { numExtensionEpochs } = formMethods.watch()

  const maxNumExtensionEpochs = 255 - numPromotionEpochs

  useEffect(() => {
    const num = parseInt(numExtensionEpochs)
    onChange(num >= 1 && num <= maxNumExtensionEpochs ? num : 0)
  }, [numExtensionEpochs])

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(() => {})}
        className={classNames('flex flex-col items-center justify-center', className)}
      >
        <SimpleInput
          formKey='numExtensionEpochs'
          validate={{
            isValidNumber: (v: string) => /^-?\d+\.?\d*$/.test(v) || 'Enter a valid number.',
            isValidInteger: (v: string) => v.split('.').length < 2 || 'No decimals allowed.',
            isValidNumEpochs: (v: string) =>
              (parseInt(v) >= 1 && parseInt(v) <= maxNumExtensionEpochs) ||
              `Enter a number between 1 and ${maxNumExtensionEpochs}.`
          }}
          placeholder={`1-${maxNumExtensionEpochs}`}
          label='How many reward epochs to extend by?'
          className='w-full max-w-md'
        />
      </form>
    </FormProvider>
  )
}
