import { CurrencyValue } from '@shared/react-components'
import { TokenWithPrice } from '@shared/types'
import classNames from 'classnames'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { liquidationPairInitialAmountInAtom } from 'src/atoms'
import { Address, formatUnits, parseUnits } from 'viem'
import { useLiquidationPairInitialAmountIn } from '@hooks/useLiquidationPairInitialAmountIn'
import { DeployLiquidationPairFormValues } from './DeployLiquidationPairForm'
import { SimpleInput } from './SimpleInput'

interface ExchangeRateInputProps {
  prizeToken: TokenWithPrice
  vaultAddress: Address
  shareSymbol: string
  className?: string
  inputClassName?: string
}

export const ExchangeRateInput = (props: ExchangeRateInputProps) => {
  const { prizeToken, vaultAddress, shareSymbol, className, inputClassName } = props

  const [initialAmountIn, setInitialAmountIn] = useAtom(liquidationPairInitialAmountInAtom)

  const { initialExchangeRate } = useWatch<DeployLiquidationPairFormValues>()

  const { setValue } = useFormContext<DeployLiquidationPairFormValues>()

  const { data: defaultInitialAmountIn } = useLiquidationPairInitialAmountIn(
    prizeToken.chainId,
    vaultAddress
  )

  useEffect(() => {
    setValue(
      'initialExchangeRate',
      formatUnits(initialAmountIn ?? defaultInitialAmountIn ?? 0n, prizeToken.decimals),
      { shouldValidate: true }
    )
    if (!initialAmountIn) {
      setInitialAmountIn(defaultInitialAmountIn)
    }
  }, [])

  useEffect(() => {
    if (!!initialExchangeRate && isValidExchangeRate(initialExchangeRate, prizeToken.decimals)) {
      const parsedExchangeRate = parseUnits(initialExchangeRate, prizeToken.decimals)
      setInitialAmountIn(parsedExchangeRate)
    }
  }, [initialExchangeRate])

  return (
    <div className={classNames('w-full flex flex-col items-center', className)}>
      <span className='text-3xl text-pt-teal-dark'>1 {shareSymbol} = </span>
      <div className='relative w-full max-w-md flex overflow-hidden'>
        <SimpleInput
          formKey='initialExchangeRate'
          validate={{
            isValidNumber: (v: string) => /^-?\d+\.?\d*$/.test(v) || 'Enter a valid number.',
            isPositiveNumber: (v: string) => parseFloat(v) > 0 || 'Enter a number larger than 0.',
            isNotTooPrecise: (v) =>
              v.split('.').length < 2 ||
              v.split('.')[1].length <= prizeToken.decimals ||
              'Too many decimals'
          }}
          defaultValue={
            !!defaultInitialAmountIn
              ? formatUnits(defaultInitialAmountIn, prizeToken.decimals)
              : undefined
          }
          className={classNames('w-full', inputClassName)}
        />
        <span
          className='absolute top-4 pt-[1px] pl-3 text-sm text-gray-400 leading-tight pointer-events-none md:top-5 md:pl-4'
          style={{ left: `${(initialExchangeRate?.length ?? 0) + 0.5}ch` }}
        >
          {prizeToken.symbol}
        </span>
        <span className='absolute top-4 right-3 pt-[1px] text-sm text-gray-400 leading-tight pointer-events-none md:top-5 md:right-4'>
          ≈{' '}
          <CurrencyValue
            baseValue={
              !!initialExchangeRate && initialExchangeRate !== ''
                ? parseFloat(initialExchangeRate) * prizeToken.price
                : 0
            }
            hideZeroes={true}
          />
        </span>
      </div>
    </div>
  )
}

const isValidExchangeRate = (val: string, maxDecimals: number) => {
  return (
    !!val &&
    /^-?\d+\.?\d*$/.test(val) &&
    parseFloat(val) > 0 &&
    (val.split('.').length < 2 || val.split('.')[1].length <= maxDecimals)
  )
}
