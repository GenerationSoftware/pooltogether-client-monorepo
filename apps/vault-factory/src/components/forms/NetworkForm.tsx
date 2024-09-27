import classNames from 'classnames'
import { useAtom, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import {
  contributionAmountAtom,
  isUsingCustomYieldSourceAtom,
  liquidationPairAddressAtom,
  liquidationPairSmoothingFactorAtom,
  liquidationPairTargetAuctionPeriodAtom,
  liquidationPairTargetAuctionPriceAtom,
  vaultAddressAtom,
  vaultChainIdAtom,
  vaultClaimerAddressAtom,
  vaultFeePercentageAtom,
  vaultFeeRecipientAddressAtom,
  vaultNameAtom,
  vaultOwnerAddressAtom,
  vaultSymbolAtom,
  vaultYieldBufferAtom,
  vaultYieldSourceAddressAtom,
  vaultYieldSourceIdAtom,
  vaultYieldSourceNameAtom
} from 'src/atoms'
import { NextButton } from '@components/buttons/NextButton'
import { SUPPORTED_NETWORKS } from '@constants/config'
import { useVaultCreationSteps } from '@hooks/useVaultCreationSteps'
import { NetworkInput } from './NetworkInput'

interface NetworkFormValues {
  vaultChainId: string
}

interface NetworkFormProps {
  className?: string
}

export const NetworkForm = (props: NetworkFormProps) => {
  const { className } = props

  const formMethods = useForm<NetworkFormValues>({ mode: 'onChange' })

  const [vaultChainId, setVaultChainId] = useAtom(vaultChainIdAtom)

  const { nextStep } = useVaultCreationSteps()

  const setVaultYieldSourceId = useSetAtom(vaultYieldSourceIdAtom)
  const setVaultYieldSourceName = useSetAtom(vaultYieldSourceNameAtom)
  const setVaultYieldSourceAddress = useSetAtom(vaultYieldSourceAddressAtom)
  const setIsUsingCustomYieldSource = useSetAtom(isUsingCustomYieldSourceAtom)
  const setVaultFeePercentage = useSetAtom(vaultFeePercentageAtom)
  const setVaultFeeRecipientAddress = useSetAtom(vaultFeeRecipientAddressAtom)
  const setVaultOwnerAddress = useSetAtom(vaultOwnerAddressAtom)
  const setVaultName = useSetAtom(vaultNameAtom)
  const setVaultSymbol = useSetAtom(vaultSymbolAtom)
  const setVaultClaimerAddress = useSetAtom(vaultClaimerAddressAtom)
  const setVaultYieldBuffer = useSetAtom(vaultYieldBufferAtom)
  const setVaultAddress = useSetAtom(vaultAddressAtom)
  const setLiquidationPairTargetAuctionPeriod = useSetAtom(liquidationPairTargetAuctionPeriodAtom)
  const setLiquidationPairTargetAuctionPrice = useSetAtom(liquidationPairTargetAuctionPriceAtom)
  const setLiquidationPairSmoothingFactor = useSetAtom(liquidationPairSmoothingFactorAtom)
  const setLiquidationPairAddress = useSetAtom(liquidationPairAddressAtom)
  const setContributionAmount = useSetAtom(contributionAmountAtom)

  const resetAllFormAtoms = () => {
    setVaultYieldSourceId('')
    setVaultYieldSourceName('')
    setVaultYieldSourceAddress(undefined)
    setIsUsingCustomYieldSource(false)
    setVaultFeePercentage(undefined)
    setVaultFeeRecipientAddress(undefined)
    setVaultOwnerAddress(undefined)
    setVaultName(undefined)
    setVaultSymbol(undefined)
    setVaultClaimerAddress(undefined)
    setVaultYieldBuffer(undefined)
    setVaultAddress(undefined)
    setLiquidationPairTargetAuctionPeriod(undefined)
    setLiquidationPairTargetAuctionPrice(undefined)
    setLiquidationPairSmoothingFactor(0.5)
    setLiquidationPairAddress(undefined)
    setContributionAmount(undefined)
  }

  useEffect(() => {
    !!vaultChainId &&
      formMethods.setValue('vaultChainId', vaultChainId.toString(), { shouldValidate: true })
  }, [])

  const onSubmit = (data: NetworkFormValues) => {
    const selectedChainId = parseInt(data.vaultChainId)

    if (selectedChainId !== vaultChainId) resetAllFormAtoms()

    setVaultChainId(selectedChainId)
    nextStep()
  }

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className={classNames('flex flex-col grow gap-12 items-center', className)}
      >
        <div className='w-full flex flex-col gap-4 items-center'>
          <span className='text-sm font-medium text-pt-purple-100'>Select Network</span>
          <div className='w-full flex flex-wrap justify-center gap-x-6 gap-y-4'>
            {SUPPORTED_NETWORKS.map((chainId) => (
              <NetworkInput key={`chain-${chainId}`} chainId={chainId} />
            ))}
          </div>
        </div>
        <NextButton disabled={!formMethods.formState.isValid} />
      </form>
    </FormProvider>
  )
}
