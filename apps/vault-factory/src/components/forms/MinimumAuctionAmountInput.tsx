import { Token } from '@shared/types'
import classNames from 'classnames'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
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

  const [isOverriden, setIsOverriden] = useState<boolean>(false)

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
    <div className={classNames('relative flex flex-col items-center overflow-hidden', className)}>
      <SimpleInput
        formKey='minimumAuctionAmount'
        validate={{
          isValidNumber: (v: string) => /^-?\d+\.?\d*$/.test(v) || 'Enter a valid number.',
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
        keepValueOnOverride={true}
        onOverride={setIsOverriden}
        className={classNames('w-full', inputClassName)}
      />
      <span
        className={classNames(
          'absolute top-9 pt-[1px] pl-3 text-sm leading-tight pointer-events-none md:top-10 md:pl-4',
          { 'text-gray-400': isOverriden, 'text-pt-teal-dark': !isOverriden }
        )}
        style={{ left: `${(_minimumAuctionAmount?.length ?? 0) + 0.5}ch` }}
      >
        {shareToken.symbol}
      </span>
    </div>
  )
}

const isValidMinimumAuctionAmount = (val: string, maxDecimals: number) => {
  return (
    !!val &&
    /^-?\d+\.?\d*$/.test(val) &&
    parseFloat(val) > 0 &&
    (val.split('.').length < 2 || val.split('.')[1].length <= maxDecimals)
  )
}
