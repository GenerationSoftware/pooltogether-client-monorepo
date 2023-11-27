import classNames from 'classnames'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { promotionChainIdAtom, promotionVaultAddressAtom } from 'src/atoms'
import { Address, isAddress } from 'viem'
import { NextButton } from '@components/buttons/NextButton'
import { SUPPORTED_NETWORKS } from '@constants/config'
import { usePromotionCreationSteps } from '@hooks/usePromotionCreationSteps'
import { NetworkInput } from './NetworkInput'
import { SimpleInput } from './SimpleInput'

interface VaultFormValues {
  promotionChainId: string
  promotionVaultAddress: string
}

interface VaultFormProps {
  className?: string
}

export const VaultForm = (props: VaultFormProps) => {
  const { className } = props

  const formMethods = useForm<VaultFormValues>({ mode: 'onChange' })

  const [promotionChainId, setPromotionChainId] = useAtom(promotionChainIdAtom)
  const [promotionVaultAddress, setPromotionVaultAddress] = useAtom(promotionVaultAddressAtom)

  const { nextStep } = usePromotionCreationSteps()

  useEffect(() => {
    !!promotionChainId &&
      formMethods.setValue('promotionChainId', promotionChainId.toString(), {
        shouldValidate: true
      })
    !!promotionVaultAddress &&
      formMethods.setValue('promotionVaultAddress', promotionVaultAddress, {
        shouldValidate: true
      })
  }, [])

  const onSubmit = (data: VaultFormValues) => {
    setPromotionChainId(parseInt(data.promotionChainId))
    setPromotionVaultAddress(data.promotionVaultAddress.trim() as Address)
    nextStep()
  }

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className={classNames('flex flex-col grow gap-12 items-center', className)}
      >
        <div className='w-full max-w-md flex flex-col gap-4'>
          <span className='text-sm font-medium text-pt-purple-100'>Select Network</span>
          <div className='w-full flex flex-wrap gap-3'>
            {SUPPORTED_NETWORKS.map((chainId) => (
              <NetworkInput key={`chain-${chainId}`} chainId={chainId} />
            ))}
          </div>
        </div>
        <SimpleInput
          formKey='promotionVaultAddress'
          validate={{
            isValidAddress: (v: string) => isAddress(v?.trim()) || 'Enter a valid contract address.'
          }}
          placeholder='0x0000...'
          label='Prize Vault Address'
          className='w-full max-w-md'
        />
        <NextButton disabled={!formMethods.formState.isValid} />
      </form>
    </FormProvider>
  )
}
