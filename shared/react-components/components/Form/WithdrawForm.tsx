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

export const withdrawFormShareAmountAtom = atom<string>('')
export const withdrawFormTokenAmountAtom = atom<string>('')

export interface WithdrawFormProps {
  vault: Vault
  showInputInfoRows?: boolean
  intl?: {
    base?: Intl<'balance' | 'max'>
    formErrors?: Intl<'notEnoughTokens' | 'invalidNumber' | 'negativeNumber' | 'tooManyDecimals'>
  }
}

export const WithdrawForm = (props: WithdrawFormProps) => {
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
    defaultValues: { shareAmount: '', tokenAmount: '' }
  })

  const setFormShareAmount = useSetAtom(withdrawFormShareAmountAtom)
  const setFormTokenAmount = useSetAtom(withdrawFormTokenAmountAtom)

  useEffect(() => {
    setFormShareAmount('')
    setFormTokenAmount('')
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
    setFormShareAmount('0')
  }

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

  return (
    <div className='flex flex-col'>
      {!!shareInputData && !!tokenInputData && decimals !== undefined && (
        <>
          <FormProvider {...formMethods}>
            <TxFormInput
              token={shareInputData}
              formKey='shareAmount'
              validate={{
                isNotGreaterThanShareBalance: (v) =>
                  parseFloat(formatUnits(shareBalance, decimals)) >= parseFloat(v) ||
                  !isFetchedVaultBalance ||
                  !vaultBalance ||
                  (intl?.formErrors?.('notEnoughTokens', { symbol: shareData?.symbol ?? '?' }) ??
                    `Not enough ${shareData?.symbol ?? '?'} in wallet`)
              }}
              onChange={handleShareAmountChange}
              showInfoRow={showInputInfoRows}
              showMaxButton={true}
              intl={intl}
              className='mb-0.5'
            />
            <TxFormInput
              token={tokenInputData}
              formKey='tokenAmount'
              onChange={handleTokenAmountChange}
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
