import classNames from 'classnames'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { promotionEpochLengthAtom, promotionEpochsAtom } from 'src/atoms'
import { NextButton } from '@components/buttons/NextButton'
import { PrevButton } from '@components/buttons/PrevButton'
import { usePromotionCreationSteps } from '@hooks/usePromotionCreationSteps'
import { EpochLengthInput } from './EpochLengthInput'
import { SimpleInput } from './SimpleInput'

interface EpochsFormValues {
  promotionEpochs: string
  promotionEpochLength: string
}

interface EpochsFormProps {
  className?: string
}

export const EpochsForm = (props: EpochsFormProps) => {
  const { className } = props

  const formMethods = useForm<EpochsFormValues>({ mode: 'onChange' })

  const [promotionEpochs, setPromotionEpochs] = useAtom(promotionEpochsAtom)
  const [promotionEpochLength, setPromotionEpochLength] = useAtom(promotionEpochLengthAtom)

  const { nextStep } = usePromotionCreationSteps()

  useEffect(() => {
    !!promotionEpochs &&
      formMethods.setValue('promotionEpochs', promotionEpochs.toString(), {
        shouldValidate: true
      })
    !!promotionEpochLength &&
      formMethods.setValue('promotionEpochLength', promotionEpochLength.toString(), {
        shouldValidate: true
      })
  }, [])

  const onSubmit = (data: EpochsFormValues) => {
    setPromotionEpochs(parseInt(data.promotionEpochs.trim()))
    setPromotionEpochLength(parseInt(data.promotionEpochLength.trim()))
    nextStep()
  }

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className={classNames('flex flex-col grow gap-12 items-center', className)}
      >
        <SimpleInput
          formKey='promotionEpochs'
          validate={{
            isValidNumber: (v: string) => /^-?\d+\.?\d*$/.test(v) || 'Enter a valid number.',
            isValidInteger: (v: string) => v.split('.').length < 2 || 'No decimals allowed.',
            isValidNumEpochs: (v: string) =>
              (parseInt(v) >= 1 && parseInt(v) <= 255) || 'Enter a number between 1 and 255.'
          }}
          label='How many reward epochs?'
          className='w-full max-w-md'
        />
        <div className='w-full flex flex-col gap-4 items-center'>
          <span className='text-sm font-medium text-pt-purple-100'>Epoch Length</span>
          <div className='w-full flex flex-wrap justify-center gap-x-6 gap-y-4'>
            <EpochLengthInput type='hour' />
            <EpochLengthInput type='day' />
            <EpochLengthInput type='week' />
          </div>
        </div>
        {/* TODO: add custom epoch length option (multiples of 1 hour) */}
        <div className='flex gap-2 items-center'>
          <PrevButton />
          <NextButton disabled={!formMethods.formState.isValid} />
        </div>
      </form>
    </FormProvider>
  )
}
