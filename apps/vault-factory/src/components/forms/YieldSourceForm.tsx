import classNames from 'classnames'
import { useSetAtom } from 'jotai'
import { FormProvider, useForm } from 'react-hook-form'
import { vaultYieldSourceAddressAtom, vaultYieldSourceNameAtom } from 'src/atoms'
import { isValidChars } from 'src/utils'
import { Address, isAddress } from 'viem'
import { NextButton } from '@components/buttons/NextButton'
import { PrevButton } from '@components/buttons/PrevButton'
import { useSteps } from '@hooks/useSteps'
import { useTokenYieldSources } from '@hooks/useTokenYieldSources'
import { SimpleInput } from './SimpleInput'
import { YieldSourceInput } from './YieldSourceInput'

export interface YieldSourceFormValues {
  vaultYieldSourceName: string
  vaultYieldSourceAddress: string
}

interface YieldSourceFormProps {
  className?: string
}

// TODO: form should auto-fill with existing data in case of returning from other step
export const YieldSourceForm = (props: YieldSourceFormProps) => {
  const { className } = props

  const formMethods = useForm<YieldSourceFormValues>({ mode: 'onSubmit' })

  const setVaultYieldSourceName = useSetAtom(vaultYieldSourceNameAtom)
  const setVaultYieldSourceAddress = useSetAtom(vaultYieldSourceAddressAtom)

  const yieldSources = useTokenYieldSources()

  const { nextStep } = useSteps()

  const onSubmit = (data: YieldSourceFormValues) => {
    setVaultYieldSourceName(data.vaultYieldSourceName.trim())
    setVaultYieldSourceAddress(data.vaultYieldSourceAddress.trim() as Address)
    nextStep()
  }

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className={classNames('flex flex-col gap-12 items-center', className)}
      >
        <div className='flex flex-col gap-4 items-center'>
          <span className='text-sm font-medium text-pt-purple-100'>Select Yield Source</span>
          {!!yieldSources.length && (
            <div className='flex flex-wrap justify-center gap-x-6 gap-y-4'>
              {yieldSources.map((yieldSource) => (
                <YieldSourceInput key={`ys-${yieldSource.id}`} yieldSource={yieldSource} />
              ))}
            </div>
          )}
          {!yieldSources.length && (
            <div className='flex flex-col items-center text-center text-sm text-pt-purple-300'>
              <span>Could not find any yield sources for your vault's deposit token.</span>
              <span>Use the form below to enter a custom one.</span>
            </div>
          )}
        </div>
        <div className='flex gap-6 items-center'>
          <SimpleInput
            formKey='vaultYieldSourceName'
            validate={{
              isNotFalsyString: (v: string) => !!v || 'Enter a valid name.',
              isValidString: (v: string) =>
                isValidChars(v, { allowSpaces: true }) || 'Invalid characters in name.'
            }}
            placeholder='Aave, Yearn, etc.'
            label='Yield Source Name'
            className='w-full max-w-md'
          />
          <SimpleInput
            formKey='vaultYieldSourceAddress'
            validate={{
              isValidAddress: (v: string) =>
                isAddress(v.trim()) || 'Enter a valid contract address.'
            }}
            placeholder='0x0000...'
            label='Yield Source Address'
            className='w-full max-w-md'
          />
        </div>
        <div className='flex gap-2 items-center'>
          <PrevButton />
          <NextButton disabled={!formMethods.formState.isValid} />
        </div>
      </form>
    </FormProvider>
  )
}
