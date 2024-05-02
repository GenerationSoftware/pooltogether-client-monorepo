import { MAX_UINT_256 } from '@shared/utilities'
import classNames from 'classnames'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { vaultYieldBufferAtom } from 'src/atoms'
import { NextButton } from '@components/buttons/NextButton'
import { PrevButton } from '@components/buttons/PrevButton'
import { useVaultCreationSteps } from '@hooks/useVaultCreationSteps'
import { SimpleInput } from './SimpleInput'

export interface YieldBufferFormValues {
  vaultYieldBuffer: string
}

interface YieldBufferFormProps {
  className?: string
}

export const YieldBufferForm = (props: YieldBufferFormProps) => {
  const { className } = props

  const formMethods = useForm<YieldBufferFormValues>({ mode: 'onChange' })

  const [yieldBuffer, setYieldBuffer] = useAtom(vaultYieldBufferAtom)

  const { nextStep } = useVaultCreationSteps()

  useEffect(() => {
    formMethods.setValue(
      'vaultYieldBuffer',
      yieldBuffer !== undefined ? yieldBuffer.toString() : '100000',
      { shouldValidate: true }
    )
  }, [])

  const onSubmit = (data: YieldBufferFormValues) => {
    setYieldBuffer(BigInt(data.vaultYieldBuffer))
    nextStep()
  }

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className={classNames('flex flex-col grow gap-12 items-center', className)}
      >
        <SimpleInput
          formKey='vaultYieldBuffer'
          validate={{
            isValidNumber: (v: string) => /^-?\d+\.?\d*$/.test(v) || 'Enter a valid number.',
            isValidRange: (v: string) =>
              (parseFloat(v) >= 0 && BigInt(v) < MAX_UINT_256) ||
              "Enter a number between 0 (inclusive) and 2^256 (just don't).",
            isNotTooPrecise: (v) => v.split('.').length < 2 || 'No decimals allowed'
          }}
          defaultValue='100000'
          label='Yield Buffer'
          needsOverride={true}
          className='w-full max-w-md'
        />
        <div className='flex gap-2 items-center'>
          <PrevButton />
          <NextButton disabled={!formMethods.formState.isValid} />
        </div>
      </form>
    </FormProvider>
  )
}
