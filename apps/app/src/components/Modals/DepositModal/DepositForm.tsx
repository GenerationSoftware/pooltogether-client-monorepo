import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useToken,
  useTokenBalance,
  useTokenPrices,
  useUserVaultShareBalance,
  useVaultExchangeRate,
  useVaultSharePrice,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { TokenWithPrice, TokenWithSupply } from '@shared/types'
import { getAssetsFromShares, getSharesFromAssets, lower } from '@shared/utilities'
import { Select } from 'flowbite-react'
import { atom, useAtom, useSetAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Address, formatUnits, parseUnits } from 'viem'
import { useAccount } from 'wagmi'
import { ZAP_SETTINGS } from '@constants/config'
import { useSwapTx } from '@hooks/useSwapTx'
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

  const { address: userAddress } = useAccount()

  const { data: vaultExchangeRate } = useVaultExchangeRate(vault)
  const { data: vaultToken } = useVaultTokenData(vault)

  const { data: share } = useVaultSharePrice(vault)

  const [formTokenAddress, setFormTokenAddress] = useAtom(depositFormTokenAddressAtom)

  const tokenAddress = formTokenAddress ?? vaultToken?.address
  const { data: tokenData } = useToken(vault.chainId, tokenAddress as Address)
  const { data: tokenPrices } = useTokenPrices(vault.chainId, !!tokenAddress ? [tokenAddress] : [])
  const token: (TokenWithSupply & TokenWithPrice) | undefined =
    !!tokenAddress && !!tokenData
      ? { ...tokenData, price: tokenPrices?.[lower(tokenAddress)] }
      : undefined

  const { data: tokenWithAmount, isFetched: isFetchedTokenBalance } = useTokenBalance(
    vault.chainId,
    userAddress as Address,
    tokenAddress as Address,
    { refetchOnWindowFocus: true }
  )
  const tokenBalance = isFetchedTokenBalance && !!tokenWithAmount ? tokenWithAmount.amount : 0n

  const { data: shareWithAmount, isFetched: isFetchedShareWithAmount } = useUserVaultShareBalance(
    vault,
    userAddress as Address
  )
  const shareBalance = isFetchedShareWithAmount && !!shareWithAmount ? shareWithAmount.amount : 0n

  const formMethods = useForm<TxFormValues>({
    mode: 'onChange',
    defaultValues: { tokenAmount: '', shareAmount: '' }
  })

  const [formTokenAmount, setFormTokenAmount] = useAtom(depositFormTokenAmountAtom)
  const setFormShareAmount = useSetAtom(depositFormShareAmountAtom)

  useEffect(() => {
    setFormTokenAddress(undefined)
    setFormTokenAmount('')
    setFormShareAmount('')
    formMethods.reset()
  }, [])

  const depositAmount = useMemo(() => {
    return !!formTokenAmount && !!token && token.decimals !== undefined
      ? parseUnits(formTokenAmount, token?.decimals as number)
      : 0n
  }, [formTokenAmount, token])

  // TODO: need some sort of debounced effect here as to not spam api
  const { data: swapTx, isFetching: isFetchingSwapTx } = useSwapTx({
    chainId: vault.chainId,
    from: {
      address: token?.address as Address,
      decimals: token?.decimals as number,
      amount: depositAmount
    },
    to: { address: vaultToken?.address as Address, decimals: vaultToken?.decimals as number },
    sender: ZAP_SETTINGS[vault.chainId]?.zapRouterAddress
  })

  const isZapping =
    !!vaultToken && !!formTokenAddress && lower(vaultToken.address) !== lower(formTokenAddress)

  useEffect(() => {
    if (isZapping && !!swapTx && share?.decimals !== undefined) {
      const formattedShares = formatUnits(swapTx.minAmountOut, share.decimals)
      const slicedShares = formattedShares.endsWith('.0')
        ? formattedShares.slice(0, -2)
        : formattedShares

      setFormShareAmount(slicedShares)

      formMethods.setValue('shareAmount', slicedShares, {
        shouldValidate: true
      })
    }
  }, [swapTx])

  const handleTokenAmountChange = (tokenAmount: string) => {
    if (!!vaultExchangeRate && token?.decimals !== undefined && share?.decimals !== undefined) {
      if (isValidFormInput(tokenAmount, token.decimals)) {
        setFormTokenAmount(tokenAmount)

        if (!isZapping) {
          const tokens = parseUnits(tokenAmount, token.decimals)
          const shares = getSharesFromAssets(tokens, vaultExchangeRate, share.decimals)
          const formattedShares = formatUnits(shares, share.decimals)
          const slicedShares = formattedShares.endsWith('.0')
            ? formattedShares.slice(0, -2)
            : formattedShares

          setFormShareAmount(slicedShares)

          formMethods.setValue('shareAmount', slicedShares, {
            shouldValidate: true
          })
        }
      } else {
        setFormTokenAmount('0')
      }
    }
  }

  useEffect(() => {
    if (!!tokenData && isValidFormInput(formTokenAmount, tokenData.decimals)) {
      handleTokenAmountChange(formTokenAmount)
      formMethods.trigger('tokenAmount')
    }
  }, [tokenData])

  const handleShareAmountChange = (shareAmount: string) => {
    if (
      !isZapping &&
      !!vaultExchangeRate &&
      token?.decimals !== undefined &&
      share?.decimals !== undefined
    ) {
      if (isValidFormInput(shareAmount, share.decimals)) {
        setFormShareAmount(shareAmount)

        const shares = parseUnits(shareAmount, share.decimals)
        const tokens = getAssetsFromShares(shares, vaultExchangeRate, share.decimals)
        const formattedTokens = formatUnits(tokens, token.decimals)
        const slicedTokens = formattedTokens.endsWith('.0')
          ? formattedTokens.slice(0, -2)
          : formattedTokens

        setFormTokenAmount(slicedTokens)

        formMethods.setValue('tokenAmount', slicedTokens, {
          shouldValidate: true
        })
      } else {
        setFormTokenAmount('0')
      }
    }
  }

  const tokenInputData = useMemo(() => {
    if (!!token) {
      return {
        ...token,
        amount: tokenBalance,
        price: token.price ?? 0,
        logoURI:
          !!vaultToken && lower(token.address) === lower(vaultToken.address)
            ? vault.tokenLogoURI
            : undefined
      }
    }
  }, [vault, vaultToken, tokenBalance])

  const shareInputData = useMemo(() => {
    if (!!share) {
      return {
        ...share,
        amount: shareBalance,
        price: share.price ?? 0,
        logoURI: vault.logoURI ?? vault.tokenLogoURI
      }
    }
  }, [vault, share, shareBalance])

  return (
    <div className='flex flex-col'>
      {!!tokenInputData &&
        !!shareInputData &&
        tokenInputData.decimals !== undefined &&
        shareInputData.decimals !== undefined && (
          <>
            <FormProvider {...formMethods}>
              {/* TODO: pass token input options and enable token picker */}
              <TxFormInput
                token={tokenInputData}
                formKey='tokenAmount'
                validate={{
                  isNotGreaterThanBalance: (v) =>
                    parseFloat(formatUnits(tokenInputData.amount, tokenInputData.decimals)) >=
                      parseFloat(v) ||
                    !isFetchedTokenBalance ||
                    !tokenWithAmount ||
                    t_errors('notEnoughTokens', { symbol: tokenInputData.symbol ?? '?' })
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
                disabled={isZapping}
                isLoading={isFetchingSwapTx}
              />
            </FormProvider>
          </>
        )}
    </div>
  )
}
