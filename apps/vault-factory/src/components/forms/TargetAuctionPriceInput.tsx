import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { Token } from '@shared/types'
import { Tooltip } from '@shared/ui'
import classNames from 'classnames'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { liquidationPairTargetAuctionPriceAtom } from 'src/atoms'
import { formatUnits, parseUnits } from 'viem'
import { DeployLiquidationPairFormValues } from './DeployLiquidationPairForm'
import { SimpleInput } from './SimpleInput'

interface TargetAuctionPriceInputProps {
  prizeToken: Token
  defaultPrice?: bigint
  className?: string
  inputClassName?: string
}

export const TargetAuctionPriceInput = (props: TargetAuctionPriceInputProps) => {
  const { prizeToken, defaultPrice, className, inputClassName } = props

  const [targetAuctionPrice, setTargetAuctionPrice] = useAtom(liquidationPairTargetAuctionPriceAtom)

  const { targetAuctionPrice: _targetAuctionPrice } = useWatch<DeployLiquidationPairFormValues>()

  const { setValue } = useFormContext<DeployLiquidationPairFormValues>()

  const [isOverriden, setIsOverriden] = useState<boolean>(false)

  useEffect(() => {
    setValue(
      'targetAuctionPrice',
      formatUnits(targetAuctionPrice ?? defaultPrice ?? 0n, prizeToken.decimals),
      { shouldValidate: true }
    )
    if (!targetAuctionPrice) {
      setTargetAuctionPrice(defaultPrice)
    }
  }, [])

  useEffect(() => {
    if (
      !!_targetAuctionPrice &&
      isValidTargetAuctionPrice(_targetAuctionPrice, prizeToken.decimals)
    ) {
      setTargetAuctionPrice(parseUnits(_targetAuctionPrice, prizeToken.decimals))
    }
  }, [_targetAuctionPrice])

  return (
    <div className={classNames('relative', className)}>
      <SimpleInput
        formKey='targetAuctionPrice'
        validate={{
          isValidNumber: (v: string) => /^-?\d+\.?\d*$/.test(v) || 'Enter a valid number.',
          isPositiveNumber: (v: string) => parseFloat(v) > 0 || 'Enter a number larger than 0.',
          isNotTooPrecise: (v) =>
            v.split('.').length < 2 ||
            v.split('.')[1].length <= prizeToken.decimals ||
            'Too many decimals'
        }}
        label={<TargetAuctionPriceInputLabel />}
        defaultValue={!!defaultPrice ? formatUnits(defaultPrice, prizeToken.decimals) : undefined}
        needsOverride={true}
        keepValueOnOverride={true}
        onOverride={setIsOverriden}
        className={classNames('w-full', inputClassName)}
      />
      <span
        className={classNames(
          'absolute top-9 right-3 pt-[1px] text-sm leading-tight pointer-events-none md:top-10',
          { 'text-gray-400': isOverriden, 'text-pt-teal-dark': !isOverriden }
        )}
      >
        {prizeToken.symbol}
      </span>
    </div>
  )
}

const TargetAuctionPriceInputLabel = () => {
  return (
    <div className='flex gap-1 items-center whitespace-nowrap'>
      <span>First Auction Price</span>
      <Tooltip
        content={
          <div className='max-w-[32ch] flex flex-col gap-2 text-center whitespace-normal'>
            <span>
              This is the price to be paid to liquidate the yield available on the first auction.
            </span>
            <span>
              If you believe the first auction will have a lot more yield that this value, increase
              this.
            </span>
            <span>Regardless, future auctions will self-adjust over time.</span>
          </div>
        }
      >
        <InformationCircleIcon className='h-4 w-4' />
      </Tooltip>
    </div>
  )
}

const isValidTargetAuctionPrice = (val: string, maxDecimals: number) => {
  return (
    !!val &&
    /^-?\d+\.?\d*$/.test(val) &&
    parseFloat(val) > 0 &&
    (val.split('.').length < 2 || val.split('.')[1].length <= maxDecimals)
  )
}
