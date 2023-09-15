import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { usePrizeTokenData } from '@generationsoftware/hyperstructure-react-hooks'
import { Token } from '@shared/types'
import { formatBigIntForDisplay } from '@shared/utilities'
import classNames from 'classnames'
import { parseUnits } from 'viem'

interface ReserveCardProps {
  prizePool: PrizePool
  className?: string
}

export const ReserveCard = (props: ReserveCardProps) => {
  const { prizePool, className } = props

  // TODO: get POOL amount in liquidations in the last 24hrs
  const liquidationsToday = parseUnits('0', 18)

  // TODO: get manual contributions in the last 24hrs
  const manualContributionsToday = parseUnits('0', 18)

  // TODO: get RNG fees in the last 24hrs
  const rngFeesToday = parseUnits('0', 18)

  // TODO: get any prize backstops in the last 24hrs
  const prizeBackstopsToday = parseUnits('0', 18)

  const { data: prizeToken } = usePrizeTokenData(prizePool)

  if (!!prizeToken) {
    return (
      <div
        className={classNames(
          'w-full max-w-md flex flex-col gap-4 items-center p-5 bg-pt-purple-100/20 rounded-lg',
          className
        )}
      >
        <span className='text-center'>24hr reserve changes</span>
        <ReserveCardItem name='Liquidations' amount={liquidationsToday} token={prizeToken} />
        <ReserveCardItem
          name='Manual Contributions'
          amount={manualContributionsToday}
          token={prizeToken}
        />
        <ReserveCardItem name='RNG Fees' amount={0n - rngFeesToday} token={prizeToken} />
        <ReserveCardItem
          name='Prize Backstops'
          amount={0n - prizeBackstopsToday}
          token={prizeToken}
        />
        <hr className='w-full border-gray-400' />
        <ReserveCardItem
          name='24hr Change'
          amount={liquidationsToday + manualContributionsToday - rngFeesToday - prizeBackstopsToday}
          token={prizeToken}
          alwaysShow={true}
        />
      </div>
    )
  }
}

interface ReserveCardItemProps {
  name: string
  amount: bigint
  token: Token
  alwaysShow?: boolean
}

const ReserveCardItem = (props: ReserveCardItemProps) => {
  const { name, amount, token, alwaysShow } = props

  const formattedAmount = formatBigIntForDisplay(amount, token.decimals, {
    maximumFractionDigits: 0
  })

  if (!!amount || alwaysShow) {
    return (
      <div className='w-full flex justify-between whitespace-nowrap'>
        <span className='text-2xl'>{name}</span>
        <span
          className={classNames('flex gap-1 items-center', {
            'text-green-600': amount > 0n,
            'text-red-600': amount < 0n
          })}
        >
          <span className='text-2xl'>
            {amount >= 0n && '+'}
            {formattedAmount}
          </span>
          {token.symbol}
        </span>
      </div>
    )
  }

  return <></>
}
