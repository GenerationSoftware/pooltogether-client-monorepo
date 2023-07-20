import {
  getAssetsFromShares,
  getSharesFromAssets,
  Vault
} from '@pooltogether/hyperstructure-client-js'
import {
  useTokenBalance,
  useUserVaultShareBalance,
  useVaultExchangeRate,
  useVaultShareData,
  useVaultSharePrice,
  useVaultTokenData,
  useVaultTokenPrice
} from '@pooltogether/hyperstructure-react-hooks'
import { Intl } from '@shared/types'
import { atom, useSetAtom } from 'jotai'
import { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Address, formatUnits, parseUnits } from 'viem'
import { useAccount } from 'wagmi'
import { isValidFormInput, TxFormInput, TxFormValues } from './TxFormInput'

export const depositFormTokenAmountAtom = atom<string>('')
export const depositFormShareAmountAtom = atom<string>('')

export interface DepositFormProps {
  vault: Vault
  showInputInfoRows?: boolean
  intl?: {
    base?: Intl<'balance' | 'max'>
    formErrors?: Intl<'notEnoughTokens' | 'invalidNumber' | 'negativeNumber' | 'tooManyDecimals'>
  }
}

export const DepositForm = (props: DepositFormProps) => {
  const { vault, showInputInfoRows, intl } = props

  const { data: vaultExchangeRate } = useVaultExchangeRate(vault)

  const { address: userAddress } = useAccount()

  const { data: shareData } = useVaultShareData(vault)
  const { data: tokenData } = useVaultTokenData(vault)

  const decimals = vault.decimals ?? shareData?.decimals

  const { data: tokenWithAmount, isFetched: isFetchedTokenBalance } = useTokenBalance(
    vault.chainId,
    userAddress as Address,
    tokenData?.address as Address
  )
  const tokenBalance = isFetchedTokenBalance && !!tokenWithAmount ? tokenWithAmount.amount : 0n

  const { data: vaultBalance, isFetched: isFetchedVaultBalance } = useUserVaultShareBalance(
    vault,
    userAddress as Address
  )
  const shareBalance = isFetchedVaultBalance && !!vaultBalance ? vaultBalance.amount : 0n

  const { data: tokenWithPrice } = useVaultTokenPrice(vault)
  const { data: shareWithPrice } = useVaultSharePrice(vault)

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
    if (!!vaultExchangeRate && decimals !== undefined && isValidFormInput(tokenAmount, decimals)) {
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
    }
  }

  const handleShareAmountChange = (shareAmount: string) => {
    if (!!vaultExchangeRate && decimals !== undefined && isValidFormInput(shareAmount, decimals)) {
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
    }
  }

  const tokenInputData = useMemo(() => {
    if (!!tokenData) {
      return {
        ...tokenData,
        amount: tokenBalance,
        price: tokenWithPrice?.price ?? 0,
        logoURI: vault.tokenLogoURI
      }
    }
  }, [vault, tokenData, tokenBalance, tokenWithPrice])

  const shareInputData = useMemo(() => {
    if (!!shareData) {
      return {
        ...shareData,
        amount: shareBalance,
        price: shareWithPrice?.price ?? 0,
        logoURI: vault.logoURI
      }
    }
  }, [vault, shareData, shareBalance, shareWithPrice])

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
                  (intl?.formErrors?.('notEnoughTokens', { symbol: tokenData?.symbol ?? '?' }) ??
                    `Not enough ${tokenData?.symbol ?? '?'} in wallet`)
              }}
              onChange={handleTokenAmountChange}
              showInfoRow={showInputInfoRows}
              showMaxButton={true}
              intl={intl}
              className='mb-0.5'
            />
            <TxFormInput
              token={shareInputData}
              formKey='shareAmount'
              onChange={handleShareAmountChange}
              showInfoRow={showInputInfoRows}
              intl={intl}
              className='my-0.5'
            />
          </FormProvider>
        </>
      )}
    </div>
  )
}
