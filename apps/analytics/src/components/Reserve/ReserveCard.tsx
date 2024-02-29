import { Token } from '@shared/types'
import { formatNumberForDisplay } from '@shared/utilities'
import classNames from 'classnames'

interface ReserveCardProps {
  name: string
  reserve: number
  liquidations: number
  manual: number
  rewards: number
  prizeBackstops: number
  buyback: number
  prizeToken: Token
  burnToken: Token
  className?: string
}

export const ReserveCard = (props: ReserveCardProps) => {
  const {
    name,
    reserve,
    liquidations,
    manual,
    rewards,
    prizeBackstops,
    buyback,
    prizeToken,
    burnToken,
    className
  } = props

  return (
    <div
      className={classNames(
        'w-80 flex flex-col gap-4 p-5 text-sm bg-blue-100 rounded-lg',
        className
      )}
    >
      <span className='font-bold'>{name}</span>
      <ReserveCardItem name='Vault Contributions' amount={liquidations} token={prizeToken} />
      <ReserveCardItem name='Manual Contributions' amount={manual} token={prizeToken} />
      <ReserveCardItem name='RNG Awards' amount={0 - rewards} token={prizeToken} />
      <ReserveCardItem name='Prize Backstops' amount={0 - prizeBackstops} token={prizeToken} />
      <ReserveCardItem
        name={`${burnToken.symbol} Buyback & Burn`}
        amount={0 - buyback}
        token={prizeToken}
      />
      <hr className='w-full border-gray-400' />
      <ReserveCardItem
        name='Changes'
        amount={liquidations + manual - rewards - prizeBackstops - buyback}
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

  const formattedAmount = formatNumberForDisplay(amount, { maximumFractionDigits: 5 })

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
