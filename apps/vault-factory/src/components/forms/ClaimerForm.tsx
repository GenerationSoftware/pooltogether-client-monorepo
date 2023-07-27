import classNames from 'classnames'
import { useAtomValue, useSetAtom } from 'jotai'
import { FormProvider, useForm } from 'react-hook-form'
import { vaultChainIdAtom, vaultClaimerAddressAtom } from 'src/atoms'
import { Address, isAddress } from 'viem'
import { NextButton } from '@components/buttons/NextButton'
import { PrevButton } from '@components/buttons/PrevButton'
import { CONTRACTS } from '@constants/config'
import { useSteps } from '@hooks/useSteps'
import { SimpleInput } from './SimpleInput'

export interface ClaimerFormValues {
  vaultClaimer: string
}

interface ClaimerFormProps {
  className?: string
}

// TODO: form should auto-fill with existing data in case of returning from other step
export const ClaimerForm = (props: ClaimerFormProps) => {
  const { className } = props

  const formMethods = useForm<ClaimerFormValues>({ mode: 'onChange' })

  const setVaultClaimer = useSetAtom(vaultClaimerAddressAtom)

  const vaultChainId = useAtomValue(vaultChainIdAtom)

  const { nextStep } = useSteps()

  const onSubmit = (data: ClaimerFormValues) => {
    setVaultClaimer(data.vaultClaimer.trim() as Address)
    nextStep()
  }

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className={classNames('flex flex-col grow gap-12 items-center', className)}
      >
        <SimpleInput
          formKey='vaultClaimer'
          validate={{
            isValidAddress: (v: string) => isAddress(v?.trim()) || 'Enter a valid contract address.'
          }}
          defaultValue={!!vaultChainId ? CONTRACTS[vaultChainId].claimer : undefined}
          label='Claimer Contract'
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
