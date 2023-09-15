import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { usePrizeTokenData } from '@generationsoftware/hyperstructure-react-hooks'
import { Token } from '@shared/types'
import { Spinner } from '@shared/ui'
import { formatBigIntForDisplay, SECONDS_PER_DAY } from '@shared/utilities'
import classNames from 'classnames'
import { useMemo } from 'react'
import { parseUnits } from 'viem'
import { useBlockAtTimestamp } from '@hooks/useBlockAtTimestamp'
import { useManualContributionEvents } from '@hooks/useManualContributionEvents'
import { useRngTxs } from '@hooks/useRngTxs'

interface ReserveCardProps {
  prizePool: PrizePool
  className?: string
}

export const ReserveCard = (props: ReserveCardProps) => {
  const { prizePool, className } = props

  const minTime = useMemo(() => Date.now() / 1_000 - SECONDS_PER_DAY, [])
  const { data: minBlock } = useBlockAtTimestamp(prizePool.chainId, minTime)

  // TODO: get POOL amount in liquidations in the last 24hrs
  const validLiquidations = parseUnits('0', 18)

  const { data: manualContributionEvents } = useManualContributionEvents(prizePool)
  const validManualContributions = useMemo(() => {
    if (!!manualContributionEvents && !!minBlock) {
      return manualContributionEvents.reduce(
        (a, b) => a + (b.blockNumber >= minBlock.number ? b.args.amount : 0n),
        0n
      )
    }
    return 0n
  }, [manualContributionEvents, minBlock])

  const { data: rngTxs } = useRngTxs(prizePool)
  const validRngFees = useMemo(() => {
    if (!!rngTxs && !!minBlock) {
      return rngTxs.reduce(
        (a, b) =>
          a +
          (!!b.relay && b.relay.block >= minBlock.number ? (b.rng.fee ?? 0n) + b.relay.fee : 0n),
        0n
      )
    }
    return 0n
  }, [rngTxs, minBlock])

  // TODO: get any prize backstops in the last 24hrs
  const validPrizeBackstops = parseUnits('0', 18)

  const { data: prizeToken } = usePrizeTokenData(prizePool)

  if (!prizeToken || !minBlock) {
    return <Spinner />
  }

  return (
    <div
      className={classNames(
        'w-full max-w-md flex flex-col gap-4 items-center p-5 bg-pt-purple-100/20 rounded-lg',
        className
      )}
    >
      <span className='text-center'>24hr reserve changes</span>
      <ReserveCardItem name='Liquidations' amount={validLiquidations} token={prizeToken} />
      <ReserveCardItem
        name='Manual Contributions'
        amount={validManualContributions}
        token={prizeToken}
      />
      <ReserveCardItem name='RNG Fees' amount={0n - validRngFees} token={prizeToken} />
      <ReserveCardItem
        name='Prize Backstops'
        amount={0n - validPrizeBackstops}
        token={prizeToken}
      />
      <hr className='w-full border-gray-400' />
      <ReserveCardItem
        name='24hr Change'
        amount={validLiquidations + validManualContributions - validRngFees - validPrizeBackstops}
        token={prizeToken}
        alwaysShow={true}
      />
    </div>
  )
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
            {amount > 0n && '+'}
            {formattedAmount}
          </span>
          {token.symbol}
        </span>
      </div>
    )
  }

  return <></>
}
