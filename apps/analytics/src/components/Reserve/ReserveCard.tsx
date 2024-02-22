import { Token } from '@shared/types'
import { formatNumberForDisplay } from '@shared/utilities'
import classNames from 'classnames'

interface ReserveCardProps {
  name: string
  reserve: number
  liquidations: number
  manual: number
  rngFees: number
  prizeBackstops: number
  prizeToken: Token
  className?: string
}

export const ReserveCard = (props: ReserveCardProps) => {
  const { name, reserve, liquidations, manual, rngFees, prizeBackstops, prizeToken, className } =
    props

  return (
    <div
      className={classNames(
        'w-72 flex flex-col gap-4 p-5 text-sm bg-blue-100 rounded-lg',
        className
      )}
    >
      <span className='font-bold'>{name}</span>
      <ReserveCardItem
        name='Vault Contributions'
        amount={liquidations > 0 ? liquidations : 0}
        token={prizeToken}
      />
      <ReserveCardItem name='Manual Contributions' amount={manual} token={prizeToken} />
      <ReserveCardItem name='RNG Fees' amount={0 - rngFees} token={prizeToken} />
      <ReserveCardItem name='Prize Backstops' amount={0 - prizeBackstops} token={prizeToken} />
      <hr className='w-full border-gray-400' />
      <ReserveCardItem
        name='Changes'
        amount={liquidations + manual - rngFees - prizeBackstops}
        token={prizeToken}
        alwaysShow={true}
      />
      <ReserveCardItem
        name='Total Reserve'
        amount={reserve}
        token={prizeToken}
        alwaysShow={true}
        hidePosNegSymbol={true}
        nameClassName='font-bold'
      />
    </div>
  )
}

interface ReserveCardItemProps {
  name: string
  amount: number
  token: Token
  alwaysShow?: boolean
  hidePosNegSymbol?: boolean
  className?: string
  nameClassName?: string
  amountClassName?: string
}

const ReserveCardItem = (props: ReserveCardItemProps) => {
  const {
    name,
    amount,
    token,
    alwaysShow,
    hidePosNegSymbol,
    className,
    nameClassName,
    amountClassName
  } = props

  const formattedAmount = formatNumberForDisplay(amount, {
    maximumFractionDigits: 2
  })

  if (!!amount || alwaysShow) {
    return (
      <div className={classNames('w-full flex justify-between whitespace-nowrap', className)}>
        <span className={nameClassName}>{name}</span>
        <span
          className={classNames(
            'flex gap-1 items-center',
            {
              'text-green-500': amount > 0 && formattedAmount !== '0',
              'text-red-500': amount < 0 && formattedAmount !== '-0'
            },
            amountClassName
          )}
        >
          {!hidePosNegSymbol &&
            amount > 0 &&
            formattedAmount !== '0' &&
            formattedAmount !== '-0' &&
            '+'}
          {formattedAmount === '-0' ? '0' : formattedAmount} {token.symbol}
        </span>
      </div>
    )
  }

  return <></>
}
