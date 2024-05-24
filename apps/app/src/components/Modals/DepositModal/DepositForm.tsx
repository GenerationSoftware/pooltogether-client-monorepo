import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useToken,
  useTokenBalance,
  useTokenPrices,
  useUserVaultShareBalance,
  useVaultExchangeRate,
  useVaultSharePrice,
  useVaultTokenPrice
} from '@generationsoftware/hyperstructure-react-hooks'
import { CurrencyValue, TokenIcon } from '@shared/react-components'
import { Token, TokenWithAmount, TokenWithPrice, TokenWithSupply } from '@shared/types'
import { DropdownItem } from '@shared/ui'
import {
  formatBigIntForDisplay,
  getAssetsFromShares,
  getSharesFromAssets,
  lower
} from '@shared/utilities'
import classNames from 'classnames'
import { atom, useAtom, useSetAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Address, formatUnits, parseUnits } from 'viem'
import { useAccount } from 'wagmi'
import { ZAP_SETTINGS } from '@constants/config'
import { useSendDepositZapTransaction } from '@hooks/useSendDepositZapTransaction'
import { useZapTokenOptions } from '@hooks/useZapTokenOptions'
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
  const { data: vaultToken } = useVaultTokenPrice(vault)
  const { data: vaultTokenWithAmount } = useTokenBalance(
    vault.chainId,
    userAddress as Address,
    vaultToken?.address as Address,
    { refetchOnWindowFocus: true }
  )

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

  const [cachedZapAmountOut, setCachedZapAmountOut] =
    useState<ReturnType<typeof useSendDepositZapTransaction>['amountOut']>()

  useEffect(() => {
    setFormTokenAddress(undefined)
    setFormTokenAmount('')
    setFormShareAmount('')
    setCachedZapAmountOut(undefined)
    formMethods.reset()
  }, [])

  const depositAmount = useMemo(() => {
    return !!formTokenAmount && !!token && token.decimals !== undefined
      ? parseUnits(formTokenAmount, token?.decimals as number)
      : 0n
  }, [formTokenAmount, token])

  const { amountOut: zapAmountOut, isFetchingSwapTx } = useSendDepositZapTransaction(
    {
      address: token?.address as Address,
      decimals: token?.decimals as number,
      amount: depositAmount
    },
    vault
  )

  const isZapping =
    !!vaultToken && !!formTokenAddress && lower(vaultToken.address) !== lower(formTokenAddress)

  // TODO: display min amount out (zapAmountOut.min)
  useEffect(() => {
    if (
      isZapping &&
      share?.decimals !== undefined &&
      !!zapAmountOut &&
      (cachedZapAmountOut?.expected !== zapAmountOut.expected ||
        cachedZapAmountOut?.min !== zapAmountOut.min)
    ) {
      setCachedZapAmountOut(zapAmountOut)

      const formattedShares = formatUnits(zapAmountOut.expected, share.decimals)
      const slicedShares = formattedShares.endsWith('.0')
        ? formattedShares.slice(0, -2)
        : formattedShares

      setFormShareAmount(slicedShares)

      formMethods.setValue('shareAmount', slicedShares, {
        shouldValidate: true
      })
    }
  }, [isZapping, share, zapAmountOut])

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

  const zapTokenOptions = useZapTokenOptions(vault.chainId)

  const tokenPickerOptions = useMemo(() => {
    const getOptionId = (option: Token) => `zapToken-${option.chainId}-${option.address}`

    let options = zapTokenOptions.map(
      (tokenOption): DropdownItem => ({
        id: getOptionId(tokenOption),
        content: <TokenPickerOption token={tokenOption} />,
        onClick: () => setFormTokenAddress(tokenOption.address)
      })
    )

    if (!!vaultToken) {
      const isVaultToken = (id: string) => lower(id.split('-')[2]) === lower(vaultToken.address)

      const vaultTokenOption = options.find((option) => isVaultToken(option.id))

      if (!!vaultTokenOption) {
        options = options.filter((option) => !isVaultToken(option.id))
        options.unshift(vaultTokenOption)
      } else {
        const amount = vaultTokenWithAmount?.amount ?? 0n
        const price = vaultToken.price ?? 0
        const value = parseFloat(formatUnits(amount, vaultToken.decimals)) * price

        options.unshift({
          id: getOptionId(vaultToken),
          content: <TokenPickerOption token={{ ...vaultToken, amount, price, value }} />,
          onClick: () => setFormTokenAddress(vaultToken.address)
        })
      }
    }

    return options
  }, [zapTokenOptions, vaultToken, vaultTokenWithAmount])

  return (
    <div className='flex flex-col isolate'>
      {!!tokenInputData &&
        !!shareInputData &&
        tokenInputData.decimals !== undefined &&
        shareInputData.decimals !== undefined && (
          <>
            <FormProvider {...formMethods}>
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
                showTokenPicker={!!ZAP_SETTINGS[vault.chainId]}
                tokenPickerOptions={tokenPickerOptions}
                className='mb-0.5 z-20'
              />
              <TxFormInput
                token={shareInputData}
                formKey='shareAmount'
                onChange={handleShareAmountChange}
                showInfoRow={showInputInfoRows}
                className='my-0.5 z-10'
                disabled={isZapping}
                isLoading={isFetchingSwapTx}
              />
            </FormProvider>
          </>
        )}
    </div>
  )
}

interface TokenPickerOptionProps {
  token: TokenWithAmount & Required<TokenWithPrice> & { value: number }
  className?: string
}

const TokenPickerOption = (props: TokenPickerOptionProps) => {
  const { token, className } = props

  return (
    <div
      className={classNames(
        'w-full min-w-[10rem]',
        'flex items-center justify-between gap-4',
        'px-2 py-1 rounded-lg',
        'text-pt-purple-50 md:text-pt-purple-600',
        'hover:bg-pt-purple-200',
        className
      )}
    >
      <span className='flex items-center gap-1'>
        <TokenIcon token={token} />
        <span>{token.symbol}</span>
      </span>
      <span className='flex items-center gap-1'>
        <span>{formatBigIntForDisplay(token.amount, token.decimals)}</span>

        {!!token.value && (
          <span>
            (<CurrencyValue baseValue={token.value} hideZeroes={true} />)
          </span>
        )}
      </span>
    </div>
  )
}
