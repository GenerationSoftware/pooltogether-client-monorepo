import {
  usePrizePool,
  usePrizeTokenPrice,
  useToken
} from '@pooltogether/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { FormProvider, useForm } from 'react-hook-form'
import { vaultAddressAtom, vaultChainIdAtom } from 'src/atoms'
import { SupportedNetwork } from 'src/types'
import { Address } from 'viem'
import { DeployLiquidationPairButton } from '@components/buttons/DeployLiquidationPairButton'
import { CONTRACTS } from '@constants/config'
import { useLiquidationPairInitialAmountIn } from '@hooks/useLiquidationPairInitialAmountIn'
import { useLiquidationPairMinimumAuctionAmount } from '@hooks/useLiquidationPairMinimumAuctionAmount'
import { useLiquidationPairSteps } from '@hooks/useLiquidationPairSteps'
import { useVaultCreationSteps } from '@hooks/useVaultCreationSteps'
import { ExchangeRateInput } from './ExchangeRateInput'
import { MinimumAuctionAmountInput } from './MinimumAuctionAmountInput'

export interface DeployLiquidationPairFormValues {
  initialExchangeRate: string
  minimumAuctionAmount: string
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

  const prizePool = usePrizePool(chainId, CONTRACTS[chainId].prizePool)
  const { data: prizeToken } = usePrizeTokenPrice(prizePool)

  const { data: shareToken } = useToken(chainId, vaultAddress)

  const { data: defaultInitialAmountIn } = useLiquidationPairInitialAmountIn(chainId, vaultAddress)
  const { data: defaultMinimumAuctionAmount } = useLiquidationPairMinimumAuctionAmount(
    chainId,
    vaultAddress
  )

  if (!prizeToken || !shareToken || !defaultInitialAmountIn || !defaultMinimumAuctionAmount) {
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
        <ExchangeRateInput
          prizeToken={prizeToken}
          vaultAddress={vaultAddress}
          shareSymbol={shareToken.symbol}
        />
        <MinimumAuctionAmountInput shareToken={shareToken} vaultAddress={vaultAddress} />
        <DeployLiquidationPairButton
          chainId={chainId}
          vaultAddress={vaultAddress}
          onSuccess={nextStep}
        />
      </form>
    </FormProvider>
  )
}
