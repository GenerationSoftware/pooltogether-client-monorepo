import { Token } from '@shared/types'
import { formatNumberForDisplay } from '@shared/utilities'
import classNames from 'classnames'

interface BurnCardProps {
  name: string
  lp: { total: number; change: number }
  manual: { total: number; change: number }
  other: { total: number; change: number }
  prizeToken: Token
  className?: string
}

export const BurnCard = (props: BurnCardProps) => {
  const { name, lp, manual, other, prizeToken, className } = props

  return (
    <div
      className={classNames(
        'w-72 flex flex-col gap-4 p-5 text-sm bg-blue-100 rounded-lg',
        className
      )}
    >
      <span className='font-bold'>{name}</span>
      <BurnCardItem name='Prizes to LPs' total={lp.total} change={lp.change} token={prizeToken} />
      <BurnCardItem
        name='Manual Burns'
        total={manual.total}
        change={manual.change}
        token={prizeToken}
      />
      <BurnCardItem name='Other' total={other.total} change={other.change} token={prizeToken} />
      <hr className='w-full border-gray-400' />
      <BurnCardItem
        name='Total Burned'
        total={lp.total + manual.total + other.total}
        change={lp.change + manual.change + other.change}
        token={prizeToken}
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

  const formattedTotal = formatNumberForDisplay(total, { maximumFractionDigits: 0 })
  const formattedChange = formatNumberForDisplay(change, { maximumFractionDigits: 0 })

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
