import classNames from 'classnames'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { vaultChainIdAtom, vaultClaimerAddressAtom } from 'src/atoms'
import { Address, isAddress } from 'viem'
import { NextButton } from '@components/buttons/NextButton'
import { PrevButton } from '@components/buttons/PrevButton'
import { CONTRACTS } from '@constants/config'
import { useVaultCreationSteps } from '@hooks/useVaultCreationSteps'
import { SimpleInput } from './SimpleInput'

export interface ClaimerFormValues {
  vaultClaimer: string
}

interface ClaimerFormProps {
  className?: string
}

export const ClaimerForm = (props: ClaimerFormProps) => {
  const { className } = props

  const formMethods = useForm<ClaimerFormValues>({ mode: 'onChange' })

  const [vaultClaimer, setVaultClaimer] = useAtom(vaultClaimerAddressAtom)

  const vaultChainId = useAtomValue(vaultChainIdAtom)

  const { nextStep } = useVaultCreationSteps()

  useEffect(() => {
    !!vaultChainId &&
      formMethods.setValue('vaultClaimer', vaultClaimer ?? CONTRACTS[vaultChainId].claimer, {
        shouldValidate: true
      })
  }, [])

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
