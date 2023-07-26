import { Card } from '@shared/ui'
import { shorten } from '@shared/utilities'
import classNames from 'classnames'
import { useFormContext, useWatch } from 'react-hook-form'
import { YieldSourceId } from 'src/types'
import { Address } from 'viem'
import { YIELD_SOURCE_DESCRIPTIONS } from '@constants/yieldSources'
import { YieldSourceFormValues } from './YieldSourceForm'

interface YieldSourceInputProps {
  yieldSource: { id: YieldSourceId; address: Address }
  className?: string
}

export const YieldSourceInput = (props: YieldSourceInputProps) => {
  const { yieldSource, className } = props

  return (
    <div className={classNames('max-w-[25%] max-h-[25vh]', className)}>
      <YieldSourceCard yieldSource={yieldSource} />
    </div>
  )
}

interface YieldSourceCardProps {
  yieldSource: { id: YieldSourceId; address: Address }
}

const YieldSourceCard = (props: YieldSourceCardProps) => {
  const { yieldSource } = props

  const { setValue } = useFormContext<YieldSourceFormValues>()

  const { vaultYieldSourceAddress } = useWatch<YieldSourceFormValues>()

  const { name, href, description } = YIELD_SOURCE_DESCRIPTIONS[yieldSource.id]

  const handleClick = () => {
    setValue('vaultYieldSourceName', name)
    setValue('vaultYieldSourceAddress', yieldSource.address)
  }

  const isSelected =
    !!vaultYieldSourceAddress &&
    yieldSource.address.toLowerCase() === vaultYieldSourceAddress.toLowerCase().trim()

  return (
    <Card
      onClick={handleClick}
      wrapperClassName={classNames(
        'w-full h-full border cursor-pointer overflow-hidden hover:bg-pt-purple-50/20',
        {
          'border-pt-teal-dark': isSelected,
          'border-transparent': !isSelected
        }
      )}
      className='gap-3'
    >
      <span className='font-semibold text-blue-500'>{shorten(yieldSource.address)}</span>
      <span className='text-lg font-bold text-pt-purple-100'>{name}</span>
      <span className='text-blue-500'>{href}</span>
      <span className='line-clamp-3'>{description}</span>
    </Card>
  )
}
