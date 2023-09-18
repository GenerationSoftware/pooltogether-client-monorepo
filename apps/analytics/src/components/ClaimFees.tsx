import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  usePrizeDrawWinners,
  usePrizeTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { Token } from '@shared/types'
import { Spinner } from '@shared/ui'
import { divideBigInts, formatBigIntForDisplay, MAX_UINT_256 } from '@shared/utilities'
import classNames from 'classnames'
import { useMemo } from 'react'

interface ClaimFeesProps {
  prizePool: PrizePool
  drawId: number
  tier?: number
  hideCanary?: boolean
  className?: string
}

export const ClaimFees = (props: ClaimFeesProps) => {
  const { prizePool, drawId, tier, hideCanary, className } = props

  const { data: allDraws, isFetched: isFetchedAllDraws } = usePrizeDrawWinners(prizePool)

  const { data: prizeToken, isFetched: isFetchedPrizeToken } = usePrizeTokenData(prizePool)

  // TODO: hide canary tiers once numTiers is available on subgraph (if `hideCanary` is enabled)
  const wins =
    allDraws
      ?.find((d) => d.id === drawId)
      ?.prizeClaims.filter(
        (prize) => prize.fee > 0n && (tier === undefined || prize.tier === tier)
      ) ?? []

  const claimFeeStats = useMemo(() => {
    if (wins.length > 0) {
      const sumClaimFeeAmount = wins.reduce((a, b) => a + b.fee, 0n)
      const sumPrizeAmount = wins.reduce((a, b) => a + b.payout, 0n)

      const maxClaimFee = wins.reduce(
        (a, b) => {
          const percentage = divideBigInts(b.fee, b.payout + b.fee) * 100
          return a.percentage < percentage ? { amount: b.fee, percentage } : a
        },
        { amount: 0n, percentage: 0 }
      )

      const minClaimFee = wins.reduce(
        (a, b) => {
          const percentage = divideBigInts(b.fee, b.payout + b.fee) * 100
          return a.percentage > percentage ? { amount: b.fee, percentage } : a
        },
        { amount: MAX_UINT_256, percentage: 100 }
      )

      const avg = {
        amount: BigInt(Math.floor(divideBigInts(sumClaimFeeAmount, BigInt(wins.length)))),
        percentage: divideBigInts(sumClaimFeeAmount, sumPrizeAmount + sumClaimFeeAmount) * 100
      }
      const high = {
        amount: maxClaimFee.amount,
        percentage: maxClaimFee.percentage
      }
      const low = {
        amount: minClaimFee.amount,
        percentage: minClaimFee.percentage
      }

      return { avg, high, low }
    }
  }, [wins])

  return (
    <div className={classNames('flex flex-col gap-1 text-sm text-pt-purple-700', className)}>
      {!!claimFeeStats && !!prizeToken ? (
        <>
          <ClaimFeeStat type='avg' data={claimFeeStats.avg} prizeToken={prizeToken} />
          <ClaimFeeStat type='high' data={claimFeeStats.high} prizeToken={prizeToken} />
          <ClaimFeeStat type='low' data={claimFeeStats.low} prizeToken={prizeToken} />
        </>
      ) : isFetchedAllDraws && isFetchedPrizeToken ? (
        <span>-</span>
      ) : (
        <Spinner className='after:border-y-pt-purple-800' />
      )}
    </div>
  )
}

interface ClaimFeeStatProps {
  type: 'avg' | 'high' | 'low'
  data: { amount: bigint; percentage: number }
  prizeToken: Token
  className?: string
}

export const ClaimFeeStat = (props: ClaimFeeStatProps) => {
  const { type, data, prizeToken, className } = props

  return (
    <div
      className={classNames(
        'flex items-center text-sm',
        {
          'text-pt-purple-700': type === 'avg',
          'text-green-600': type === 'high',
          'text-red-600': type === 'low'
        },
        className
      )}
    >
      <span className='w-10'>{type.toUpperCase()}</span>
      <span className='w-14 px-2 text-right border-x border-x-pt-purple-100'>
        <span className='text-xl'>
          {data.percentage.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </span>
        %
      </span>
      <span className='pl-2 text-pt-purple-700'>
        {formatBigIntForDisplay(data.amount, prizeToken.decimals, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}{' '}
        <span>{prizeToken.symbol}</span>
      </span>
    </div>
  )
}
