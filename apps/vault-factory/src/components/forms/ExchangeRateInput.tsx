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
      <SimpleInput
        formKey='initialExchangeRate'
        validate={{
          isValidNumber: (v: string) => !isNaN(parseFloat(v)) || 'Enter a valid number.',
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
        className={classNames('w-full max-w-md', inputClassName)}
      />
      <span>{prizeToken.symbol}</span>
      <span>
        ≈ <CurrencyValue baseValue={parseFloat(initialExchangeRate ?? '0') * prizeToken.price} />
      </span>
    </div>
  )
}

const isValidExchangeRate = (val: string, maxDecimals: number) => {
  return (
    !!val &&
    !isNaN(parseFloat(val)) &&
    parseFloat(val) > 0 &&
    (val.split('.').length < 2 || val.split('.')[1].length <= maxDecimals)
  )
}
