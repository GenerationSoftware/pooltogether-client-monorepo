import classNames from 'classnames'
import { useAtom, useAtomValue } from 'jotai'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { vaultAddressAtom, vaultChainIdAtom, vaultClaimerAddressAtom } from 'src/atoms'
import { Address, isAddress } from 'viem'
import { BackButton } from '@components/buttons/BackButton'
import { NextButton } from '@components/buttons/NextButton'
import { PrevButton } from '@components/buttons/PrevButton'
import { SetClaimerButton } from '@components/buttons/SetClaimerButton'
import { NETWORK_CONFIG } from '@constants/config'
import { useVaultCreationSteps } from '@hooks/useVaultCreationSteps'
import { SimpleInput } from './SimpleInput'

export interface SetClaimerFormValues {
  vaultClaimer: string
}

interface SetClaimerFormProps {
  isOnlyStep?: boolean
  className?: string
}

export const SetClaimerForm = (props: SetClaimerFormProps) => {
  const { isOnlyStep, className } = props

  const router = useRouter()

  const formMethods = useForm<SetClaimerFormValues>({ mode: 'onChange' })

  const [vaultClaimer, setVaultClaimer] = useAtom(vaultClaimerAddressAtom)

  const vaultChainId = useAtomValue(vaultChainIdAtom)
  const vaultAddress = useAtomValue(vaultAddressAtom)

  const { nextStep } = useVaultCreationSteps()

  useEffect(() => {
    !!vaultChainId &&
      formMethods.setValue('vaultClaimer', vaultClaimer ?? NETWORK_CONFIG[vaultChainId].claimer, {
        shouldValidate: true
      })
  }, [])

  const onSubmit = (data: SetClaimerFormValues) => {
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
          defaultValue={!!vaultChainId ? NETWORK_CONFIG[vaultChainId].claimer : undefined}
          label='Claimer Contract'
          needsOverride={true}
          className='w-full max-w-md'
        />
        {!isOnlyStep ? (
          <div className='flex gap-2 items-center'>
            <PrevButton />
            <NextButton disabled={!formMethods.formState.isValid} />
          </div>
        ) : (
          !!vaultChainId &&
          !!vaultAddress && (
            <div className='flex gap-2 items-center'>
              <BackButton />
              <SetClaimerButton
                chainId={vaultChainId}
                vaultAddress={vaultAddress}
                onSuccess={() => router.push('/')}
              />
            </div>
          )
        )}
      </form>
    </FormProvider>
  )
}
