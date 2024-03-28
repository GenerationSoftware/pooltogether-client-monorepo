import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { useRouter } from 'next/router'
import { FormProvider, useForm } from 'react-hook-form'
import { vaultAddressAtom, vaultChainIdAtom } from 'src/atoms'
import { SupportedNetwork } from 'src/types'
import { Address } from 'viem'
import { PrevButton } from '@components/buttons/PrevButton'
import { SetLiquidationPairButton } from '@components/buttons/SetLiquidationPairButton'
import { useLiquidationPairSteps } from '@hooks/useLiquidationPairSteps'
import { useVaultCreationSteps } from '@hooks/useVaultCreationSteps'
import { LiquidationPairAddressInput } from './LiquidationPairAddressInput'

export interface SetLiquidationPairFormValues {
  lpAddress: string
}

interface SetLiquidationPairFormProps {
  className?: string
}

export const SetLiquidationPairForm = (props: SetLiquidationPairFormProps) => {
  const { className } = props

  const router = useRouter()

  const formMethods = useForm<SetLiquidationPairFormValues>({ mode: 'onChange' })

  const { prevStep: prevVaultCreationStep } = useVaultCreationSteps()
  const { prevStep: prevLpStep } = useLiquidationPairSteps()

  const chainId = useAtomValue(vaultChainIdAtom) as SupportedNetwork
  const vaultAddress = useAtomValue(vaultAddressAtom) as Address

  const prevStep = () => {
    prevVaultCreationStep()
    prevLpStep()
  }

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(() => {})}
        className={classNames('flex flex-col grow gap-12 items-center', className)}
      >
        <LiquidationPairAddressInput className='w-full max-w-md' />
        <div className='flex gap-2 items-center'>
          <PrevButton onClick={prevStep} />
          <SetLiquidationPairButton
            chainId={chainId}
            vaultAddress={vaultAddress}
            onSuccess={() => router.push('/')}
          />
        </div>
      </form>
    </FormProvider>
  )
}
