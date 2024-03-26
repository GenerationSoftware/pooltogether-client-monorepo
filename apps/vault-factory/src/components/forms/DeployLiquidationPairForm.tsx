import { useToken } from '@generationsoftware/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { FormProvider, useForm } from 'react-hook-form'
import { vaultAddressAtom, vaultChainIdAtom } from 'src/atoms'
import { SupportedNetwork } from 'src/types'
import { Address } from 'viem'
import { DeployLiquidationPairButton } from '@components/buttons/DeployLiquidationPairButton'
import { useLiquidationPairMinimumAuctionAmount } from '@hooks/useLiquidationPairMinimumAuctionAmount'
import { useLiquidationPairSteps } from '@hooks/useLiquidationPairSteps'
import { useVaultCreationSteps } from '@hooks/useVaultCreationSteps'
import { MinimumAuctionAmountInput } from './MinimumAuctionAmountInput'
import { SmoothingFactorInput } from './SmoothingFactorInput'

export interface DeployLiquidationPairFormValues {
  minimumAuctionAmount: string
  smoothingFactor: string
}

interface DeployLiquidationPairFormProps {
  className?: string
}

export const DeployLiquidationPairForm = (props: DeployLiquidationPairFormProps) => {
  const { className } = props

  const formMethods = useForm<DeployLiquidationPairFormValues>({ mode: 'onChange' })

  const { nextStep: nextVaultCreationStep } = useVaultCreationSteps()
  const { nextStep: nextLpStep } = useLiquidationPairSteps()

  const chainId = useAtomValue(vaultChainIdAtom) as SupportedNetwork
  const vaultAddress = useAtomValue(vaultAddressAtom) as Address

  const { data: shareToken } = useToken(chainId, vaultAddress)

  const { data: defaultMinimumAuctionAmount } = useLiquidationPairMinimumAuctionAmount(
    chainId,
    vaultAddress
  )

  if (!shareToken || !defaultMinimumAuctionAmount) {
    return <Spinner />
  }

  const nextStep = () => {
    nextVaultCreationStep()
    nextLpStep()
  }

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(() => {})}
        className={classNames('flex flex-col grow gap-12 items-center', className)}
      >
        <MinimumAuctionAmountInput
          shareToken={shareToken}
          vaultAddress={vaultAddress}
          className='w-full max-w-md'
        />
        <SmoothingFactorInput className='w-full max-w-md' />
        <DeployLiquidationPairButton
          chainId={chainId}
          vaultAddress={vaultAddress}
          onSuccess={nextStep}
        />
      </form>
    </FormProvider>
  )
}
