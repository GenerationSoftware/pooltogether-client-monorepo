import { useToken } from '@generationsoftware/hyperstructure-react-hooks'
import classNames from 'classnames'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import {
  promotionChainIdAtom,
  promotionTokenAddressAtom,
  promotionTokenAmountAtom
} from 'src/atoms'
import { SupportedNetwork } from 'src/types'
import { Address, formatUnits, isAddress, parseUnits } from 'viem'
import { NextButton } from '@components/buttons/NextButton'
import { PrevButton } from '@components/buttons/PrevButton'
import { usePromotionCreationSteps } from '@hooks/usePromotionCreationSteps'
import { SimpleInput } from './SimpleInput'

interface TokenFormValues {
  promotionTokenAddress: string
  promotionTokenAmount: string
}

interface TokenFormProps {
  className?: string
}

export const TokenForm = (props: TokenFormProps) => {
  const { className } = props

  const formMethods = useForm<TokenFormValues>({ mode: 'onChange' })

  const [promotionTokenAddress, setPromotionTokenAddress] = useAtom(promotionTokenAddressAtom)
  const [promotionTokenAmount, setPromotionTokenAmount] = useAtom(promotionTokenAmountAtom)
  const promotionChainId = useAtomValue(promotionChainIdAtom)

  const { nextStep } = usePromotionCreationSteps()

  const { promotionTokenAddress: formRewardTokenAddress } = formMethods.watch()

  const rewardTokenAddress = isAddress(formRewardTokenAddress)
    ? formRewardTokenAddress
    : promotionTokenAddress
  const { data: rewardToken } = useToken(
    promotionChainId as SupportedNetwork,
    rewardTokenAddress as Address
  )

  useEffect(() => {
    !!promotionTokenAddress &&
      formMethods.setValue('promotionTokenAddress', promotionTokenAddress, {
        shouldValidate: true
      })
    !!promotionTokenAmount &&
      !!rewardToken &&
      formMethods.setValue(
        'promotionTokenAmount',
        formatUnits(promotionTokenAmount, rewardToken.decimals),
        { shouldValidate: true }
      )
  }, [])

  const onSubmit = (data: TokenFormValues) => {
    setPromotionTokenAddress(data.promotionTokenAddress.trim() as Address)
    !!rewardToken &&
      setPromotionTokenAmount(parseUnits(data.promotionTokenAmount.trim(), rewardToken.decimals))
    nextStep()
  }

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className={classNames('flex flex-col grow gap-12 items-center', className)}
      >
        <SimpleInput
          formKey='promotionTokenAddress'
          validate={{
            isValidAddress: (v: string) => isAddress(v?.trim()) || 'Enter a valid contract address.'
          }}
          placeholder='0x0000...'
          label='Reward Token Address'
          className='w-full max-w-md'
        />
        <SimpleInput
          formKey='promotionTokenAmount'
          validate={{
            isValidNumber: (v: string) => /^-?\d+\.?\d*$/.test(v) || 'Enter a valid number.',
            isPositiveNumber: (v: string) => parseFloat(v) > 0 || 'Enter a number larger than 0.',
            isNotTooPrecise: (v) =>
              v.split('.').length < 2 ||
              v.split('.')[1].length <= (rewardToken?.decimals ?? 18) ||
              'Too many decimals'
          }}
          placeholder='Enter a token amount'
          label='Total Rewards Amount'
          className='w-full max-w-md'
        />
        <div className='flex gap-2 items-center'>
          <PrevButton />
          <NextButton disabled={!formMethods.formState.isValid || !rewardToken} />
        </div>
      </form>
    </FormProvider>
  )
}
