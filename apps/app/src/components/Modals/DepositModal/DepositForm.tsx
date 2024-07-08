import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useCachedVaultLists,
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
  lower
} from '@shared/utilities'
import classNames from 'classnames'
import { atom, useAtom, useSetAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Address, formatUnits, parseUnits } from 'viem'
import { useAccount, usePublicClient } from 'wagmi'
import { ZAP_SETTINGS } from '@constants/config'
import { useSendDepositZapTransaction } from '@hooks/zaps/useSendDepositZapTransaction'
import { useZapTokenOptions } from '@hooks/zaps/useZapTokenOptions'
import { isValidFormInput, TxFormInput, TxFormValues } from '../TxFormInput'

export const depositFormTokenAddressAtom = atom<Address | undefined>(undefined)
export const depositFormTokenAmountAtom = atom<string>('')
export const depositFormShareAmountAtom = atom<string>('')

export const depositZapPriceImpactAtom = atom<number | undefined>(undefined)
export const depositZapMinReceivedAtom = atom<bigint | undefined>(undefined)

export interface DepositFormProps {
  vault: Vault
  showInputInfoRows?: boolean
}

export const DepositForm = (props: DepositFormProps) => {
  const { vault, showInputInfoRows } = props

  const t_txModals = useTranslations('TxModals')
  const t_errors = useTranslations('Error.formErrors')

  const { address: userAddress } = useAccount()

  const publicClient = usePublicClient({ chainId: vault.chainId })

  const { data: vaultExchangeRate } = useVaultExchangeRate(vault)
  const { data: vaultToken } = useVaultTokenPrice(vault)
  const { data: vaultTokenWithAmount } = useTokenBalance(
    vault.chainId,
    userAddress!,
    vaultToken?.address!,
    { refetchOnWindowFocus: true }
  )

  const { data: share } = useVaultSharePrice(vault)

  const [formTokenAddress, setFormTokenAddress] = useAtom(depositFormTokenAddressAtom)

  const tokenAddress = formTokenAddress ?? vaultToken?.address

  const { cachedVaultLists } = useCachedVaultLists()

  const inputVault = useMemo(() => {
    if (!!vault && !!publicClient && !!tokenAddress) {
      const vaultId = getVaultId({ chainId: vault.chainId, address: tokenAddress })
      const vaults = cachedVaultLists['default']?.tokens ?? []
      const vaultInfo = vaults.find((v) => getVaultId(v) === vaultId)

      if (!!vaultInfo) {
        return new Vault(vaultInfo.chainId, vaultInfo.address, publicClient, {
          decimals: vaultInfo.decimals,
          name: vaultInfo.name,
          logoURI: vaultInfo.logoURI
        })
      }
    }
  }, [vault, publicClient, tokenAddress, cachedVaultLists])

  const shareLogoURI = useMemo(() => {
    if (!!vault) {
      const defaultVaults = cachedVaultLists['default']?.tokens ?? []
      const cachedLogoURI = defaultVaults.find((v) => getVaultId(v) === vault.id)?.logoURI
      return vault.logoURI ?? cachedLogoURI
    }
  }, [vault, cachedVaultLists])

  const { data: tokenData } = useToken(vault.chainId, tokenAddress!)
  const { data: tokenPrices } = useTokenPrices(vault.chainId, !!tokenAddress ? [tokenAddress] : [])
  const { data: inputVaultWithPrice } = useVaultSharePrice(inputVault!)
  const token: (TokenWithSupply & TokenWithPrice & Partial<TokenWithLogo>) | undefined =
    !!tokenAddress && (!!tokenData || !!inputVaultWithPrice)
      ? {
          logoURI:
            !!vaultToken && lower(tokenAddress) === lower(vaultToken.address)
              ? vault.tokenLogoURI
              : inputVault?.logoURI,
          ...tokenData!,
          ...inputVaultWithPrice!,
          price: tokenPrices?.[lower(tokenAddress)] ?? inputVaultWithPrice?.price
        }
      : undefined

  const { data: tokenWithAmount, isFetched: isFetchedTokenBalance } = useTokenBalance(
    vault.chainId,
    userAddress!,
    tokenAddress!,
    { refetchOnWindowFocus: true }
  )
  const tokenBalance = isFetchedTokenBalance && !!tokenWithAmount ? tokenWithAmount.amount : 0n

  const { data: shareWithAmount, isFetched: isFetchedShareWithAmount } = useUserVaultShareBalance(
    vault,
    userAddress!
  )
  const shareBalance = isFetchedShareWithAmount && !!shareWithAmount ? shareWithAmount.amount : 0n

  const formMethods = useForm<TxFormValues>({
    mode: 'onChange',
    defaultValues: { tokenAmount: '', shareAmount: '' }
  })

  const [formTokenAmount, setFormTokenAmount] = useAtom(depositFormTokenAmountAtom)
  const setFormShareAmount = useSetAtom(depositFormShareAmountAtom)

  const [priceImpact, setPriceImpact] = useAtom(depositZapPriceImpactAtom)
  const setMinReceived = useSetAtom(depositZapMinReceivedAtom)

  const [cachedZapAmountOut, setCachedZapAmountOut] =
    useState<ReturnType<typeof useSendDepositZapTransaction>['amountOut']>()

  useEffect(() => {
    setFormTokenAddress(undefined)
    setFormTokenAmount('')
    setFormShareAmount('')
    setPriceImpact(undefined)
    setMinReceived(undefined)
    setCachedZapAmountOut(undefined)
    formMethods.reset()
  }, [])

  const depositAmount = useMemo(() => {
    return !!formTokenAmount && token?.decimals !== undefined
      ? parseUnits(formTokenAmount, token.decimals)
      : 0n
  }, [formTokenAmount, token])

  const { amountOut: zapAmountOut, isFetchingZapArgs } = useSendDepositZapTransaction(
    { address: token?.address!, decimals: token?.decimals!, amount: depositAmount },
    vault
  )

  const isZapping =
    !!vaultToken && !!formTokenAddress && lower(vaultToken.address) !== lower(formTokenAddress)
  const isZappingAndSwapping =
    isZapping && !!cachedZapAmountOut && cachedZapAmountOut.expected !== cachedZapAmountOut.min

  const vaultDecimals =
    vault.decimals ??
    vaultToken?.decimals ??
    vaultTokenWithAmount?.decimals ??
    share?.decimals ??
    shareWithAmount?.decimals

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
    if (isZapping && !!cachedZapAmountOut && vaultDecimals !== undefined) {
      const formattedShares = formatUnits(cachedZapAmountOut.expected, vaultDecimals)
      const slicedShares = formattedShares.endsWith('.0')
        ? formattedShares.slice(0, -2)
        : formattedShares

      setFormShareAmount(slicedShares)

      formMethods.setValue('shareAmount', slicedShares, {
        shouldValidate: true
      })
    }
  }, [cachedZapAmountOut])

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
        price: token.price ?? 0
      }
    }
  }, [token, tokenBalance])

  const shareInputData = useMemo(() => {
    if (!!share) {
      return {
        ...share,
        amount: shareBalance,
        price: share.price ?? 0,
        logoURI: shareLogoURI ?? vault.tokenLogoURI
      }
    }
  }, [vault, share, shareBalance, shareLogoURI])

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

  useEffect(() => {
    if (
      isZappingAndSwapping &&
      !!zapAmountOut &&
      tokenInputData?.decimals !== undefined &&
      shareInputData?.decimals !== undefined
    ) {
      const inputValue =
        parseFloat(formatUnits(depositAmount, tokenInputData.decimals)) * tokenInputData.price
      const outputValue =
        parseFloat(formatUnits(zapAmountOut.expected, shareInputData.decimals)) *
        shareInputData.price

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
  }, [depositAmount, zapAmountOut, tokenInputData, shareInputData])

  return (
    <div className='flex flex-col isolate'>
      <FormProvider {...formMethods}>
        <TxFormInput
          token={tokenInputData}
          formKey='tokenAmount'
          validate={{
            isNotGreaterThanBalance: (v) =>
              (!!tokenInputData &&
                parseFloat(formatUnits(tokenInputData.amount, tokenInputData.decimals)) >=
                  parseFloat(v)) ||
              !isFetchedTokenBalance ||
              !tokenWithAmount ||
              t_errors('notEnoughTokens', { symbol: tokenInputData?.symbol ?? '?' })
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
          priceImpact={priceImpact}
          disabled={isZapping}
          isLoading={isFetchingZapArgs}
          fallbackLogoToken={vaultToken}
          className='my-0.5 z-10'
          inputClassName={classNames({ '!text-pt-purple-200': isZapping })}
          disabledCoverClassName={classNames({ '!backdrop-brightness-100': isZapping })}
        />
        {isZappingAndSwapping && !!depositAmount && (
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
              {!!zapAmountOut && !!shareInputData ? (
                <span>
                  {formatBigIntForDisplay(zapAmountOut.min, shareInputData.decimals, {
                    maximumFractionDigits: 5
                  })}{' '}
                  {shareInputData.symbol}
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

  const { cachedVaultLists } = useCachedVaultLists()

  const tokenInVaultList = useMemo(() => {
    const vaultId = getVaultId(token)
    const vaults = cachedVaultLists['default']?.tokens ?? []

    return vaults.find((v) => getVaultId(v) === vaultId)
  }, [token, cachedVaultLists])

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
        <TokenIcon token={{ logoURI: tokenInVaultList?.logoURI, ...token }} />
        <span className='text-lg text-pt-purple-50 md:text-2xl md:text-pt-purple-600'>
          {token.symbol}
        </span>
      </span>
      <span className='text-sm text-gray-300 md:text-lg md:text-gray-700'>
        {formatBigIntForDisplay(token.amount, token.decimals)}
      </span>
    </div>
  )
}
