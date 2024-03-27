import { useToken } from '@generationsoftware/hyperstructure-react-hooks'
import { Token } from '@shared/types'
import { Spinner } from '@shared/ui'
import { PRIZE_POOLS } from '@shared/utilities'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { FormProvider, useForm } from 'react-hook-form'
import { vaultAddressAtom, vaultChainIdAtom } from 'src/atoms'
import { SupportedNetwork } from 'src/types'
import { Address } from 'viem'
import { DeployLiquidationPairButton } from '@components/buttons/DeployLiquidationPairButton'
import { NETWORK_CONFIG } from '@constants/config'
import { useLiquidationPairSteps } from '@hooks/useLiquidationPairSteps'
import { useLiquidationPairTargetAuctionPrice } from '@hooks/useLiquidationPairTargetAuctionPrice'
import { useVaultCreationSteps } from '@hooks/useVaultCreationSteps'
import { SmoothingFactorInput } from './SmoothingFactorInput'
import { TargetAuctionPeriodInput } from './TargetAuctionPeriodInput'
import { TargetAuctionPriceInput } from './TargetAuctionPriceInput'

export interface DeployLiquidationPairFormValues {
  targetAuctionPeriod: string
  targetAuctionPrice: string
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

  const prizeTokenAddress = PRIZE_POOLS.find(
    (pool) => pool.chainId === chainId
  )?.options.prizeTokenAddress.toLowerCase() as Address

  const { data: prizeToken } = useToken(chainId, prizeTokenAddress)

  const { data: defaultTargetAuctionPrice } = useLiquidationPairTargetAuctionPrice(
    prizeToken as Token
  )

  if (!prizeToken || !defaultTargetAuctionPrice) {
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
        <TargetAuctionPeriodInput
          defaultPeriod={NETWORK_CONFIG[chainId].lp.targetAuctionPeriod}
          className='w-full max-w-md'
        />
        <SmoothingFactorInput className='w-full max-w-md' />
        <TargetAuctionPriceInput
          prizeToken={prizeToken}
          defaultPrice={defaultTargetAuctionPrice}
          className='w-full max-w-md'
        />
        {/* TODO: add option to skip deploying an lp and just set one */}
        <DeployLiquidationPairButton
          chainId={chainId}
          vaultAddress={vaultAddress}
          onSuccess={nextStep}
        />
      </form>
    </FormProvider>
  )
}
