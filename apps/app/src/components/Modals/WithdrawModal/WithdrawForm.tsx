import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useSelectedVaults,
  useSendWithdrawZapTransaction,
  useToken,
  useTokenBalance,
  useTokenPrices,
  useUserVaultShareBalance,
  useVaultExchangeRate,
  useVaultSharePrice,
  useVaultTokenPrice
} from '@generationsoftware/hyperstructure-react-hooks'
import { TokenIcon } from '@shared/react-components'
import {
  Token,
  TokenWithAmount,
  TokenWithLogo,
  TokenWithPrice,
  TokenWithSupply
} from '@shared/types'
import { DropdownItem, Spinner } from '@shared/ui'
import {
  formatBigIntForDisplay,
  formatNumberForDisplay,
  getAssetsFromShares,
  getSharesFromAssets,
  getVaultId,
  lower,
  ZAP_SETTINGS
} from '@shared/utilities'
import classNames from 'classnames'
import { atom, useAtom, useSetAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { getRoundedDownFormattedTokenAmount } from 'src/utils'
import { Address, formatUnits, parseUnits } from 'viem'
import { useAccount } from 'wagmi'
import { ZAP_PRIORITIES } from '@constants/config'
import { useZapTokenOptions } from '@hooks/useZapTokenOptions'
import { isValidFormInput, TxFormInput, TxFormValues } from '../TxFormInput'

export const withdrawFormShareAmountAtom = atom<string>('')

export const withdrawFormTokenAddressAtom = atom<Address | undefined>(undefined)
export const withdrawFormTokenAmountAtom = atom<string>('')

export const withdrawZapPriceImpactAtom = atom<number | undefined>(undefined)
export const withdrawZapMinReceivedAtom = atom<bigint | undefined>(undefined)

export interface WithdrawFormProps {
  vault: Vault
  showInputInfoRows?: boolean
}

export const WithdrawForm = (props: WithdrawFormProps) => {
  const { vault, showInputInfoRows } = props

  const t_txModals = useTranslations('TxModals')
  const t_errors = useTranslations('Error.formErrors')

  const { address: userAddress } = useAccount()

  const { data: vaultExchangeRate } = useVaultExchangeRate(vault)

  const { data: share } = useVaultSharePrice(vault)
  const { data: vaultToken } = useVaultTokenPrice(vault)

  const { data: vaultTokenWithAmount } = useTokenBalance(
    vault.chainId,
    userAddress!,
    vaultToken?.address!
  )

  const [formTokenAddress, setFormTokenAddress] = useAtom(withdrawFormTokenAddressAtom)

  const tokenAddress = formTokenAddress ?? vaultToken?.address

  const { data: tokenData } = useToken(vault.chainId, tokenAddress!)
  const { data: tokenPrices } = useTokenPrices(vault.chainId, !!tokenAddress ? [tokenAddress] : [])
  const token: (TokenWithSupply & TokenWithPrice & Partial<TokenWithLogo>) | undefined =
    !!tokenAddress && !!tokenData
      ? {
          logoURI:
            !!vaultToken && lower(tokenAddress) === lower(vaultToken.address)
              ? vault.tokenLogoURI
              : undefined,
          ...tokenData,
          price: tokenPrices?.[lower(tokenAddress)]
        }
      : undefined

  const { data: tokenWithAmount, isFetched: isFetchedTokenBalance } = useTokenBalance(
    vault.chainId,
    userAddress!,
    tokenAddress!,
    { refetchOnWindowFocus: true }
  )
  const tokenBalance = isFetchedTokenBalance && !!tokenWithAmount ? tokenWithAmount.amount : 0n

  const { data: vaultBalance, isFetched: isFetchedVaultBalance } = useUserVaultShareBalance(
    vault,
    userAddress!
  )
  const shareBalance = isFetchedVaultBalance && !!vaultBalance ? vaultBalance.amount : 0n

  const { vaults } = useSelectedVaults()

  const shareLogoURI = useMemo(() => {
    if (!!vault) {
      return vault.logoURI ?? vaults.allVaultInfo.find((v) => getVaultId(v) === vault.id)?.logoURI
    }
  }, [vault, vaults])

  const formMethods = useForm<TxFormValues>({
    mode: 'onChange',
    defaultValues: { shareAmount: '', tokenAmount: '' }
  })

  const [formShareAmount, setFormShareAmount] = useAtom(withdrawFormShareAmountAtom)
  const setFormTokenAmount = useSetAtom(withdrawFormTokenAmountAtom)

  const [priceImpact, setPriceImpact] = useAtom(withdrawZapPriceImpactAtom)
  const setMinReceived = useSetAtom(withdrawZapMinReceivedAtom)

  const [cachedZapAmountOut, setCachedZapAmountOut] =
    useState<ReturnType<typeof useSendWithdrawZapTransaction>['amountOut']>()

  useEffect(() => {
    setFormTokenAddress(ZAP_PRIORITIES[vault.chainId]?.[lower(vault.address)])
    setFormShareAmount('')
    setFormTokenAmount('')
    setPriceImpact(undefined)
    setMinReceived(undefined)
    setCachedZapAmountOut(undefined)
    formMethods.reset()
  }, [])

  const vaultDecimals =
    vault.decimals ?? vaultToken?.decimals ?? share?.decimals ?? vaultBalance?.decimals

  const withdrawAmount = useMemo(() => {
    return !!formShareAmount && vaultDecimals !== undefined
      ? parseUnits(formShareAmount, vaultDecimals)
      : 0n
  }, [formShareAmount, vaultDecimals])

  const { amountOut: zapAmountOut, isFetchingZapArgs } = useSendWithdrawZapTransaction(
    { address: token?.address!, decimals: token?.decimals! },
    vault,
    withdrawAmount
  )

  const isZapping =
    !!vaultToken && !!formTokenAddress && lower(vaultToken.address) !== lower(formTokenAddress)
  const isZappingAndSwapping =
    isZapping && !!cachedZapAmountOut && cachedZapAmountOut.expected !== cachedZapAmountOut.min

  useEffect(() => {
    if (
      isZapping &&
      !!zapAmountOut?.expected &&
      !!zapAmountOut.min &&
      (cachedZapAmountOut?.expected !== zapAmountOut.expected ||
        cachedZapAmountOut?.min !== zapAmountOut.min)
    ) {
      setCachedZapAmountOut(zapAmountOut)
    }
  }, [isZapping, zapAmountOut])

  useEffect(() => {
    if (isZapping && !!cachedZapAmountOut && token?.decimals !== undefined) {
      const formattedTokens = formatUnits(cachedZapAmountOut.expected, token.decimals)
      const slicedTokens = formattedTokens.endsWith('.0')
        ? formattedTokens.slice(0, -2)
        : formattedTokens

      setFormTokenAmount(slicedTokens)

      formMethods.setValue('tokenAmount', slicedTokens, { shouldValidate: true })
    }
  }, [cachedZapAmountOut])

  const handleShareAmountChange = (shareAmount: string) => {
    if (!!vaultExchangeRate && token?.decimals !== undefined && share?.decimals !== undefined) {
      if (isValidFormInput(shareAmount, share.decimals)) {
        setFormShareAmount(shareAmount)

        if (!isZapping) {
          const shares = parseUnits(shareAmount, share.decimals)
          const tokens = getAssetsFromShares(shares, vaultExchangeRate, share.decimals)
          const formattedTokens = formatUnits(tokens, token.decimals)
          const slicedTokens = formattedTokens.endsWith('.0')
            ? formattedTokens.slice(0, -2)
            : formattedTokens

          setFormTokenAmount(slicedTokens)

          formMethods.setValue('tokenAmount', slicedTokens, { shouldValidate: true })
        }
      } else {
        setFormTokenAmount('0')
      }
    }
  }

  useEffect(() => {
    if (!!share && !!tokenData && isValidFormInput(formShareAmount, share.decimals)) {
      handleShareAmountChange(formShareAmount)
      formMethods.trigger('shareAmount')
    }
  }, [tokenData])

  const handleTokenAmountChange = (tokenAmount: string) => {
    if (
      !isZapping &&
      !!vaultExchangeRate &&
      token?.decimals !== undefined &&
      share?.decimals !== undefined
    ) {
      if (isValidFormInput(tokenAmount, token.decimals)) {
        setFormTokenAmount(tokenAmount)

        const tokens = parseUnits(tokenAmount, token.decimals)
        const shares = getSharesFromAssets(tokens, vaultExchangeRate, share.decimals)
        const formattedShares = formatUnits(shares, share.decimals)
        const slicedShares = formattedShares.endsWith('.0')
          ? formattedShares.slice(0, -2)
          : formattedShares

        setFormShareAmount(slicedShares)

        formMethods.setValue('shareAmount', slicedShares, { shouldValidate: true })
      } else {
        setFormTokenAmount('0')
      }
    }
  }

  const shareInputData = useMemo(() => {
    if (!!share) {
      return {
        ...share,
        amount: shareBalance,
        price: share?.price ?? 0,
        logoURI: shareLogoURI ?? vault.tokenLogoURI
      }
    }
  }, [vault, share, shareBalance, shareLogoURI])

  const tokenInputData = useMemo(() => {
    if (!!token) {
      return {
        ...token,
        amount: tokenBalance,
        price: token?.price ?? 0
      }
    }
  }, [token, tokenBalance])

  const zapTokenOptions = useZapTokenOptions(vault.chainId, { includeNativeAsset: true })

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

  useEffect(() => {
    if (
      isZappingAndSwapping &&
      !!zapAmountOut &&
      shareInputData?.decimals !== undefined &&
      tokenInputData?.decimals !== undefined
    ) {
      const inputValue =
        parseFloat(formatUnits(withdrawAmount, shareInputData.decimals)) * shareInputData.price
      const outputValue =
        parseFloat(formatUnits(zapAmountOut.expected, tokenInputData.decimals)) *
        tokenInputData.price

      if (!!inputValue && !!outputValue) {
        setPriceImpact((1 - inputValue / outputValue) * 100)
      } else {
        setPriceImpact(undefined)
      }

      setMinReceived(zapAmountOut.min)
    } else {
      setPriceImpact(undefined)
      setMinReceived(undefined)
    }
  }, [withdrawAmount, zapAmountOut, shareInputData, tokenInputData])

  return (
    <div className='flex flex-col isolate'>
      <FormProvider {...formMethods}>
        <TxFormInput
          token={shareInputData}
          formKey='shareAmount'
          validate={{
            isNotGreaterThanShareBalance: (v) =>
              (!!shareInputData &&
                parseFloat(formatUnits(shareInputData.amount, shareInputData.decimals)) >=
                  parseFloat(v)) ||
              !isFetchedVaultBalance ||
              !vaultBalance ||
              t_errors('notEnoughTokens', { symbol: shareInputData?.symbol ?? '?' })
          }}
          onChange={handleShareAmountChange}
          showInfoRow={showInputInfoRows}
          showMaxButton={true}
          fallbackLogoToken={vaultToken}
          className='mb-0.5 z-10'
        />
        <TxFormInput
          token={tokenInputData}
          formKey='tokenAmount'
          onChange={handleTokenAmountChange}
          showInfoRow={showInputInfoRows}
          showTokenPicker={!!ZAP_SETTINGS[vault.chainId]}
          tokenPickerOptions={tokenPickerOptions}
          priceImpact={priceImpact}
          disabled={isZapping}
          isLoading={isFetchingZapArgs}
          className='my-0.5 z-20'
          inputClassName={classNames({ '!text-pt-purple-200': isZapping })}
          disabledCoverClassName={classNames({ '!backdrop-brightness-100': isZapping })}
        />
        {isZappingAndSwapping && !!withdrawAmount && (
          <div className='flex flex-col p-2 text-xs text-pt-purple-100'>
            <div className='flex gap-2 items-center'>
              <span className='font-semibold'>{t_txModals('priceImpact')}</span>
              <span className='h-3 grow border-b border-dashed border-pt-purple-50/30' />
              {priceImpact !== undefined ? (
                <span>{`${priceImpact > 0 ? '+' : ''}${formatNumberForDisplay(priceImpact, {
                  maximumFractionDigits: 2
                })}%`}</span>
              ) : (
                <Spinner />
              )}
            </div>
            <div className='flex gap-2 items-center'>
              <span className='font-semibold'>{t_txModals('minimumReceived')}</span>
              <span className='h-3 grow border-b border-dashed border-pt-purple-50/30' />
              {!!zapAmountOut && !!tokenInputData ? (
                <span>
                  {formatBigIntForDisplay(zapAmountOut.min, tokenInputData.decimals, {
                    maximumFractionDigits: 5
                  })}{' '}
                  {tokenInputData.symbol}
                </span>
              ) : (
                <Spinner />
              )}
            </div>
          </div>
        )}
      </FormProvider>
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
        'flex items-center justify-between gap-8',
        'px-2 py-1 font-semibold rounded-lg',
        'hover:bg-pt-purple-200',
        className
      )}
    >
      <span className='flex items-center gap-1'>
        <TokenIcon token={token} />
        <span className='text-lg text-pt-purple-50 md:text-2xl md:text-pt-purple-600'>
          {token.symbol}
        </span>
      </span>
      <span className='text-sm text-gray-300 md:text-lg md:text-gray-700'>
        {getRoundedDownFormattedTokenAmount(token.amount, token.decimals)}
      </span>
    </div>
  )
}
