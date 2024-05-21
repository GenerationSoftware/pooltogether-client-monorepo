import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useTokenBalance,
  useUserVaultShareBalance,
  useVaultExchangeRate,
  useVaultSharePrice,
  useVaultTokenPrice
} from '@generationsoftware/hyperstructure-react-hooks'
import { getAssetsFromShares, getSharesFromAssets } from '@shared/utilities'
import { atom, useSetAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Address, formatUnits, parseUnits } from 'viem'
import { useAccount } from 'wagmi'
import { isValidFormInput, TxFormInput, TxFormValues } from '../TxFormInput'

export const depositFormTokenAddressAtom = atom<Address | undefined>(undefined)
export const depositFormTokenAmountAtom = atom<string>('')
export const depositFormShareAmountAtom = atom<string>('')

export interface DepositFormProps {
  vault: Vault
  showInputInfoRows?: boolean
}

export const DepositForm = (props: DepositFormProps) => {
  const { vault, showInputInfoRows } = props

  const t_errors = useTranslations('Error.formErrors')

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
    defaultValues: { tokenAmount: '', shareAmount: '' }
  })

  const setFormTokenAmount = useSetAtom(depositFormTokenAmountAtom)
  const setFormShareAmount = useSetAtom(depositFormShareAmountAtom)

  useEffect(() => {
    setFormTokenAmount('')
    setFormShareAmount('')
  }, [])

  const handleTokenAmountChange = (tokenAmount: string) => {
    if (!!vaultExchangeRate && decimals !== undefined) {
      if (isValidFormInput(tokenAmount, decimals)) {
        setFormTokenAmount(tokenAmount)

        const tokens = parseUnits(tokenAmount, decimals)
        const shares = getSharesFromAssets(tokens, vaultExchangeRate, decimals)
        const formattedShares = formatUnits(shares, decimals)
        const slicedShares = formattedShares.endsWith('.0')
          ? formattedShares.slice(0, -2)
          : formattedShares

        setFormShareAmount(slicedShares)

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
    setFormTokenAmount('0')
  }

  const tokenInputData = useMemo(() => {
    if (!!vaultToken) {
      return {
        ...vaultToken,
        amount: tokenBalance,
        price: vaultToken.price ?? 0,
        logoURI: vault.tokenLogoURI
      }
    }
  }, [vault, vaultToken, tokenBalance])

  const shareInputData = useMemo(() => {
    if (!!shareToken) {
      return {
        ...shareToken,
        amount: shareBalance,
        price: shareToken.price ?? 0,
        logoURI: vault.logoURI ?? vault.tokenLogoURI
      }
    }
  }, [vault, shareToken, shareBalance])

  return (
    <div className='flex flex-col'>
      {!!tokenInputData && !!shareInputData && decimals !== undefined && (
        <>
          <FormProvider {...formMethods}>
            <TxFormInput
              token={tokenInputData}
              formKey='tokenAmount'
              validate={{
                isNotGreaterThanBalance: (v) =>
                  parseFloat(formatUnits(tokenBalance, decimals)) >= parseFloat(v) ||
                  !isFetchedTokenBalance ||
                  !tokenWithAmount ||
                  t_errors('notEnoughTokens', { symbol: vaultToken?.symbol ?? '?' })
              }}
              onChange={handleTokenAmountChange}
              showInfoRow={showInputInfoRows}
              showMaxButton={true}
              className='mb-0.5'
            />
            <TxFormInput
              token={shareInputData}
              formKey='shareAmount'
              onChange={handleShareAmountChange}
              showInfoRow={showInputInfoRows}
              className='my-0.5'
            />
          </FormProvider>
        </>
      )}
    </div>
  )
}
