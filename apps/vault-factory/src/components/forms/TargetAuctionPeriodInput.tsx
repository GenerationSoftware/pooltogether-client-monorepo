import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { Tooltip } from '@shared/ui'
import { SECONDS_PER_HOUR } from '@shared/utilities'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { liquidationPairTargetAuctionPeriodAtom } from 'src/atoms'
import { DeployLiquidationPairFormValues } from './DeployLiquidationPairForm'
import { SimpleInput } from './SimpleInput'

interface TargetAuctionPeriodInputProps {
  defaultPeriod?: number
  className?: string
}

export const TargetAuctionPeriodInput = (props: TargetAuctionPeriodInputProps) => {
  const { defaultPeriod, className } = props

  const [targetAuctionPeriod, setTargetAuctionPeriod] = useAtom(
    liquidationPairTargetAuctionPeriodAtom
  )

  const { targetAuctionPeriod: _targetAuctionPeriod } = useWatch<DeployLiquidationPairFormValues>()

  const { setValue } = useFormContext<DeployLiquidationPairFormValues>()

  useEffect(() => {
    setValue(
      'targetAuctionPeriod',
      (targetAuctionPeriod ?? defaultPeriod ?? SECONDS_PER_HOUR).toString(),
      { shouldValidate: true }
    )
    if (!targetAuctionPeriod) {
      setTargetAuctionPeriod(defaultPeriod)
    }
  }, [])

  useEffect(() => {
    if (!!_targetAuctionPeriod && isValidTargetAuctionPeriod(_targetAuctionPeriod)) {
      setTargetAuctionPeriod(parseInt(_targetAuctionPeriod))
    }
  }, [_targetAuctionPeriod])

  return (
    <SimpleInput
      formKey='targetAuctionPeriod'
      validate={{
        isValidNumber: (v: string) => /^-?\d+\.?\d*$/.test(v) || 'Enter a valid number.',
        isPositiveNumber: (v: string) =>
          parseInt(v) > 0 || 'Enter a number larger than 0 (decimals are ignored).'
      }}
      label={<TargetAuctionPeriodInputLabel />}
      defaultValue={defaultPeriod?.toString()}
      needsOverride={true}
      keepValueOnOverride={true}
      className={className}
    />
  )
}

const TargetAuctionPeriodInputLabel = () => {
  return (
    <div className='flex gap-1 items-center whitespace-nowrap'>
      <span>Auction Period</span>
      <Tooltip
        content={
          <div className='max-w-[32ch] flex flex-col gap-2 text-center whitespace-normal'>
            <span>
              This defines the frequency of yield auctions; they will last this amount of seconds.
            </span>
            <span>Once a yield auction is over, another one begins immediately.</span>
          </div>
        }
      >
        <InformationCircleIcon className='h-4 w-4' />
      </Tooltip>
    </div>
  )
}

const isValidTargetAuctionPeriod = (val: string) => {
  return !!val && /^-?\d+\.?\d*$/.test(val) && parseInt(val) > 0
}
