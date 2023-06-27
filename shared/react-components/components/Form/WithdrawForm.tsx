import {
  getAssetsFromShares,
  getSharesFromAssets,
  Vault
} from '@pooltogether/hyperstructure-client-js'
import {
  useTokenBalance,
  useUserVaultShareBalance,
  useVaultExchangeRate,
  useVaultSharePrice,
  useVaultTokenPrice
} from '@pooltogether/hyperstructure-react-hooks'
import { atom, useSetAtom } from 'jotai'
import { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { formatUnits, parseUnits } from 'viem'
import { useAccount } from 'wagmi'
import { isValidFormInput, TxFormInput, TxFormValues } from './TxFormInput'

export const withdrawFormShareAmountAtom = atom<string>('')
export const withdrawFormTokenAmountAtom = atom<string>('')

export interface WithdrawFormProps {
  vault: Vault
  showInputInfoRows?: boolean
}

export const WithdrawForm = (props: WithdrawFormProps) => {
  const { vault, showInputInfoRows } = props

  const { data: vaultExchangeRate } = useVaultExchangeRate(vault)

  const { address: userAddress } = useAccount()

  const { data: tokenWithAmount, isFetched: isFetchedTokenBalance } = useTokenBalance(
    vault.chainId,
    userAddress as `0x${string}`,
    vault.tokenData?.address as `0x${string}`
  )
  const tokenBalance = isFetchedTokenBalance && !!tokenWithAmount ? tokenWithAmount.amount : 0n

  const { data: vaultBalance, isFetched: isFetchedVaultBalance } = useUserVaultShareBalance(
    vault,
    userAddress as `0x${string}`
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
    if (
      !!vaultExchangeRate &&
      vault.decimals !== undefined &&
      isValidFormInput(tokenAmount, vault.decimals)
    ) {
      setFormTokenAmount(tokenAmount)

      const tokens = parseUnits(`${parseFloat(tokenAmount)}`, vault.decimals)
      const shares = getSharesFromAssets(tokens, vaultExchangeRate, vault.decimals)
      const formattedShares = formatUnits(shares, vault.decimals)
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
    if (
      !!vaultExchangeRate &&
      vault.decimals !== undefined &&
      isValidFormInput(shareAmount, vault.decimals)
    ) {
      setFormShareAmount(shareAmount)

      const shares = parseUnits(`${parseFloat(shareAmount)}`, vault.decimals)
      const tokens = getAssetsFromShares(shares, vaultExchangeRate, vault.decimals)
      const formattedTokens = formatUnits(tokens, vault.decimals)
      const slicedTokens = formattedTokens.endsWith('.0')
        ? formattedTokens.slice(0, -2)
        : formattedTokens

      setFormTokenAmount(slicedTokens)

      formMethods.setValue('tokenAmount', slicedTokens, {
        shouldValidate: true
      })
    }
  }

  const shareInputData = useMemo(() => {
    if (vault.shareData) {
      return {
        ...vault.shareData,
        amount: shareBalance,
        price: shareWithPrice?.price ?? 0,
        logoURI: vault.logoURI
      }
    }
  }, [vault, shareBalance, shareWithPrice])

  const tokenInputData = useMemo(() => {
    if (vault.tokenData) {
      return {
        ...vault.tokenData,
        amount: tokenBalance,
        price: tokenWithPrice?.price ?? 0,
        logoURI: vault.tokenLogoURI
      }
    }
  }, [vault, tokenBalance, tokenWithPrice])

  return (
    <div className='flex flex-col'>
      {!!shareInputData && !!tokenInputData && vault.decimals !== undefined && (
        <>
          <FormProvider {...formMethods}>
            <TxFormInput
              token={shareInputData}
              formKey='shareAmount'
              validate={{
                isNotGreaterThanShareBalance: (v) =>
                  parseFloat(formatUnits(shareBalance, vault.decimals as number)) >=
                    parseFloat(v) ||
                  !isFetchedVaultBalance ||
                  !vaultBalance ||
                  `Not enough ${vault.shareData?.symbol} in wallet`
              }}
              onChange={handleShareAmountChange}
              showInfoRow={showInputInfoRows}
              showMaxButton={true}
              className='mb-0.5'
            />
            <TxFormInput
              token={tokenInputData}
              formKey='tokenAmount'
              onChange={handleTokenAmountChange}
              showInfoRow={showInputInfoRows}
              className='my-0.5'
            />
          </FormProvider>
        </>
      )}
    </div>
  )
}
