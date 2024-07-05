import { useTokenBalance } from '@generationsoftware/hyperstructure-react-hooks'
import { Token } from '@shared/types'
import { formatBigIntForDisplay } from '@shared/utilities'
import classNames from 'classnames'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { contributionAmountAtom } from 'src/atoms'
import { formatUnits, parseUnits } from 'viem'
import { useAccount } from 'wagmi'
import { BackButton } from '@components/buttons/BackButton'
import { ContributeButton } from '@components/buttons/ContributeButton'
import { Vault } from '../../../../../packages/hyperstructure-client-js/dist'
import { SimpleInput } from './SimpleInput'

export interface ContributionAmountFormValues {
  contributionAmount: string
}

interface ContributionAmountFormProps {
  vault: Vault
  prizeToken: Token
  className?: string
}

export const ContributionAmountForm = (props: ContributionAmountFormProps) => {
  const { vault, prizeToken, className } = props

  const { address: userAddress } = useAccount()

  const formMethods = useForm<ContributionAmountFormValues>({ mode: 'onChange' })

  const [contributionAmount, setContributionAmount] = useAtom(contributionAmountAtom)

  const { data: token } = useTokenBalance(prizeToken.chainId, userAddress!, prizeToken.address)

  useEffect(() => {
    if (!!contributionAmount) {
      formMethods.setValue(
        'contributionAmount',
        formatUnits(contributionAmount, prizeToken.decimals),
        { shouldValidate: true }
      )
    }
  }, [])

  const formContributionAmount = formMethods.watch('contributionAmount')

  useEffect(() => {
    if (!!formContributionAmount && !!formMethods.formState.isValid) {
      setContributionAmount(parseUnits(formContributionAmount, prizeToken.decimals))
    }
  }, [formContributionAmount, formMethods.formState.isValid])

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(() => {})}
        className={classNames('flex flex-col grow gap-12 items-center', className)}
      >
        {/* TODO: round down to last decimal on available balance in wallet */}
        <SimpleInput
          formKey='contributionAmount'
          validate={{
            isValidNumber: (v: string) => /^-?\d+\.?\d*$/.test(v) || 'Enter a valid number.',
            isPositiveNumber: (v: string) =>
              parseFloat(v) > 0 || 'Enter a positive, non-zero number.',
            isValidAmount: (v: string) =>
              !token ||
              parseUnits(v, token.decimals) <= token.amount ||
              `Not enough ${token.symbol} in wallet (${formatBigIntForDisplay(
                token.amount,
                token.decimals,
                { maximumFractionDigits: 6 }
              )} available)`
          }}
          label='Contribution Amount'
          placeholder={`0${!!token ? ` ${token.symbol}` : ''}`}
          className='w-full max-w-md'
        />
        <div className='flex gap-2 items-center'>
          <BackButton />
          <ContributeButton vault={vault} prizeToken={prizeToken} />
        </div>
      </form>
    </FormProvider>
  )
}
