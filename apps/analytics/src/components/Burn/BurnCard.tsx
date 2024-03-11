import { Token } from '@shared/types'
import { formatNumberForDisplay } from '@shared/utilities'
import classNames from 'classnames'

interface BurnCardProps {
  name: string
  buyback: { total: number; change: number }
  manual: { total: number; change: number }
  other: { total: number; change: number }
  burnToken: Token
  className?: string
}

export const BurnCard = (props: BurnCardProps) => {
  const { name, buyback, manual, other, burnToken, className } = props

  return (
    <div
      className={classNames(
        'w-80 flex flex-col gap-4 p-5 text-sm bg-blue-100 rounded-lg',
        className
      )}
    >
      <span className='font-bold'>{name}</span>
      <BurnCardItem
        name='Buyback'
        total={buyback.total}
        change={buyback.change}
        token={burnToken}
      />
      <BurnCardItem name='Manual' total={manual.total} change={manual.change} token={burnToken} />
      <BurnCardItem name='Other' total={other.total} change={other.change} token={burnToken} />
      <hr className='w-full border-gray-400' />
      <BurnCardItem
        name='Total Burned'
        total={buyback.total + manual.total + other.total}
        change={buyback.change + manual.change + other.change}
        token={burnToken}
        alwaysShow={true}
        nameClassName='font-bold'
      />
    </div>
  )
}

interface BurnCardItemProps {
  name: string
  total: number
  change: number
  token: Token
  alwaysShow?: boolean
  className?: string
  nameClassName?: string
  valueClassName?: string
}

const BurnCardItem = (props: BurnCardItemProps) => {
  const { name, total, change, token, alwaysShow, className, nameClassName, valueClassName } = props

  const formattedTotal = formatNumberForDisplay(total, { maximumFractionDigits: 2 })
  const formattedChange = formatNumberForDisplay(change, { maximumFractionDigits: 2 })

  if (!!total || alwaysShow) {
    return (
      <div className={classNames('w-full flex justify-between whitespace-nowrap', className)}>
        <span className={nameClassName}>{name}</span>
        <span className={classNames('flex gap-1 items-center', valueClassName)}>
          {!!change && formattedChange !== '0' && (
            <span className='text-green-500'>(+{formattedChange})</span>
          )}
          <span>{formattedTotal}</span>
          <span>{token.symbol}</span>
          <span>🔥</span>
        </span>
      </div>
    )
  }

  return <></>
}
