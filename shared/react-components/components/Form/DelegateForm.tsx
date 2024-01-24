import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useTokenBalance,
  useUserVaultShareBalance,
  useVaultExchangeRate,
  useVaultSharePrice,
  useVaultTokenPrice
} from '@generationsoftware/hyperstructure-react-hooks'
import { Intl } from '@shared/types'
import { getAssetsFromShares, getSharesFromAssets } from '@shared/utilities'
import { atom, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Address, formatUnits, parseUnits } from 'viem'
import { useAccount } from 'wagmi'
import { AddressInput } from './AddressInput'
import { isValidFormInput, TxFormValues } from './TxFormInput'

export const delegateFormShareAmountAtom = atom<string>('')
export const delegateFormTokenAmountAtom = atom<string>('')

export interface DelegateFormProps {
  vault: Vault
  showInputInfoRows?: boolean
  intl?: {
    base?: Intl<'balance' | 'max'>
    errors?: Intl<
      | 'formErrors.notEnoughTokens'
      | 'formErrors.invalidNumber'
      | 'formErrors.negativeNumber'
      | 'formErrors.tooManyDecimals'
    >
  }
}

export const DelegateForm = (props: DelegateFormProps) => {
  const { vault, showInputInfoRows, intl } = props

  const { data: vaultExchangeRate } = useVaultExchangeRate(vault)

  const { address: userAddress } = useAccount()

  const { data: shareToken } = useVaultSharePrice(vault)
  const { data: vaultToken } = useVaultTokenPrice(vault)

  const decimals = vault.decimals ?? shareToken?.decimals

  const { data: tokenWithAmount, isFetched: isFetchedTokenBalance } = useTokenBalance(
    vault.chainId,
    userAddress as Address,
    vaultToken?.address as Address,
    { refetchOnWindowFocus: true }
  )
  const tokenBalance = isFetchedTokenBalance && !!tokenWithAmount ? tokenWithAmount.amount : 0n

  const { data: vaultBalance, isFetched: isFetchedVaultBalance } = useUserVaultShareBalance(
    vault,
    userAddress as Address
  )
  const shareBalance = isFetchedVaultBalance && !!vaultBalance ? vaultBalance.amount : 0n

  const formMethods = useForm<TxFormValues>({
    mode: 'onChange',
    defaultValues: { shareAmount: '', tokenAmount: '' }
  })

  const setFormShareAmount = useSetAtom(delegateFormShareAmountAtom)
  const setFormTokenAmount = useSetAtom(delegateFormTokenAmountAtom)

  useEffect(() => {
    setFormShareAmount('')
    setFormTokenAmount('')
  }, [])

  const handleTokenAmountChange = (tokenAmount: string) => {
    if (!!vaultExchangeRate && decimals !== undefined) {
      if (isValidFormInput(tokenAmount, decimals)) {
        setFormTokenAmount(tokenAmount)

        formMethods.setValue('shareAmount', slicedShares, {
          shouldValidate: true
        })
      } else {
        setFormToErroredState()
      }
    }
  }

  const handleShareAmountChange = (shareAmount: string) => {
    if (!!vaultExchangeRate && decimals !== undefined) {
      if (isValidFormInput(shareAmount, decimals)) {
        setFormShareAmount(shareAmount)

        const shares = parseUnits(shareAmount, decimals)
        const tokens = getAssetsFromShares(shares, vaultExchangeRate, decimals)
        const formattedTokens = formatUnits(tokens, decimals)
        const slicedTokens = formattedTokens.endsWith('.0')
          ? formattedTokens.slice(0, -2)
          : formattedTokens

        setFormTokenAmount(slicedTokens)

        formMethods.setValue('tokenAmount', slicedTokens, {
          shouldValidate: true
        })
      } else {
        setFormToErroredState()
      }
    }
  }

  const setFormToErroredState = () => {
    setFormChangeDelegateAddress('')
  }

  return (
    <div className='flex flex-col'>
      <FormProvider {...formMethods}>
        <AddressInput
          id='change-delegate-address'
          formKey='changeDelegateAddress'
          onChange={handleShareAmountChange}
          intl={intl}
          className='mb-0.5'
        />
      </FormProvider>
    </div>
  )
}
