import { Token } from '@shared/types'
import classNames from 'classnames'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { liquidationPairMinimumAuctionAmountAtom } from 'src/atoms'
import { Address, formatUnits, parseUnits } from 'viem'
import { useLiquidationPairMinimumAuctionAmount } from '@hooks/useLiquidationPairMinimumAuctionAmount'
import { DeployLiquidationPairFormValues } from './DeployLiquidationPairForm'
import { SimpleInput } from './SimpleInput'

interface MinimumAuctionAmountInputProps {
  shareToken: Token
  vaultAddress: Address
  className?: string
  inputClassName?: string
}

export const MinimumAuctionAmountInput = (props: MinimumAuctionAmountInputProps) => {
  const { shareToken, vaultAddress, className, inputClassName } = props

  const [minimumAuctionAmount, setMinimumAuctionAmount] = useAtom(
    liquidationPairMinimumAuctionAmountAtom
  )

  const { minimumAuctionAmount: _minimumAuctionAmount } =
    useWatch<DeployLiquidationPairFormValues>()

  const { setValue } = useFormContext<DeployLiquidationPairFormValues>()

  const { data: defaultMinimumAuctionAmount } = useLiquidationPairMinimumAuctionAmount(
    shareToken.chainId,
    vaultAddress
  )

  useEffect(() => {
    setValue(
      'minimumAuctionAmount',
      formatUnits(minimumAuctionAmount ?? defaultMinimumAuctionAmount ?? 0n, shareToken.decimals),
      { shouldValidate: true }
    )
    if (!minimumAuctionAmount) {
      setMinimumAuctionAmount(defaultMinimumAuctionAmount)
    }
  }, [])

  useEffect(() => {
    if (
      !!_minimumAuctionAmount &&
      isValidMinimumAuctionAmount(_minimumAuctionAmount, shareToken.decimals)
    ) {
      const parsedMinimumAuctionAmount = parseUnits(_minimumAuctionAmount, shareToken.decimals)
      setMinimumAuctionAmount(parsedMinimumAuctionAmount)
    }
  }, [_minimumAuctionAmount])

  return (
    <div className={classNames('w-full flex flex-col items-center', className)}>
      <SimpleInput
        formKey='minimumAuctionAmount'
        validate={{
          isValidNumber: (v: string) => !isNaN(parseFloat(v)) || 'Enter a valid number.',
          isPositiveNumber: (v: string) => parseFloat(v) > 0 || 'Enter a number larger than 0.',
          isNotTooPrecise: (v) =>
            v.split('.').length < 2 ||
            v.split('.')[1].length <= shareToken.decimals ||
            'Too many decimals'
        }}
        label='Minimum Auction Amount'
        defaultValue={
          !!defaultMinimumAuctionAmount
            ? formatUnits(defaultMinimumAuctionAmount, shareToken.decimals)
            : undefined
        }
        needsOverride={true}
        className={classNames('w-full max-w-md', inputClassName)}
      />
      <span>{shareToken.symbol}</span>
    </div>
  )
}

const isValidMinimumAuctionAmount = (val: string, maxDecimals: number) => {
  return (
    !!val &&
    !isNaN(parseFloat(val)) &&
    parseFloat(val) > 0 &&
    (val.split('.').length < 2 || val.split('.')[1].length <= maxDecimals)
  )
}
