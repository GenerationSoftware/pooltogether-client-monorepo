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
import { DrawCardItemTitle } from './DrawCardItemTitle'

interface DrawClaimFeesProps {
  prizePool: PrizePool
  drawId: number
  className?: string
}

export const DrawClaimFees = (props: DrawClaimFeesProps) => {
  const { prizePool, drawId, className } = props

  const { data: allDraws, isFetched: isFetchedAllDraws } = usePrizeDrawWinners(prizePool)
  const draw = allDraws?.find((d) => d.id === drawId)
  // const prizeClaims = draw?.prizeClaims.filter(prize => prize.tier < draw.numTiers - 1  && prize.fee > 0n) ?? []
  const prizeClaims =
    draw?.prizeClaims.filter((prize) => prize.tier < 4 - 1 && prize.fee > 0n) ?? [] // TODO: replace hardcoded number with numTiers from draw

  const { data: prizeToken, isFetched: isFetchedPrizeToken } = usePrizeTokenData(prizePool)

  const claimFeeStats = useMemo(() => {
    if (prizeClaims.length > 0) {
      const sumClaimFeeAmount = prizeClaims.reduce((a, b) => a + b.fee, 0n)
      const sumPrizeAmount = prizeClaims.reduce((a, b) => a + b.payout, 0n)

      const maxClaimFee = prizeClaims.reduce(
        (a, b) => {
          const percentage = divideBigInts(b.fee, b.payout + b.fee) * 100
          return a.percentage < percentage ? { amount: b.fee, percentage } : a
        },
        { amount: 0n, percentage: 0 }
      )

      const minClaimFee = prizeClaims.reduce(
        (a, b) => {
          const percentage = divideBigInts(b.fee, b.payout + b.fee) * 100
          return a.percentage > percentage ? { amount: b.fee, percentage } : a
        },
        { amount: MAX_UINT_256, percentage: 100 }
      )

      const avg = {
        amount: BigInt(Math.floor(divideBigInts(sumClaimFeeAmount, BigInt(prizeClaims.length)))),
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
  }, [prizeClaims])

  return (
    <div className={classNames('flex flex-col gap-3', className)}>
      <DrawCardItemTitle>Claim Fees</DrawCardItemTitle>
      <div className='flex flex-col gap-1 text-sm text-pt-purple-700'>
        {!!claimFeeStats && !!prizeToken ? (
          <>
            <ClaimFeeStat type='avg' data={claimFeeStats.avg} prizeToken={prizeToken} />
            <ClaimFeeStat type='high' data={claimFeeStats.high} prizeToken={prizeToken} />
            <ClaimFeeStat type='low' data={claimFeeStats.low} prizeToken={prizeToken} />
          </>
        ) : isFetchedAllDraws && isFetchedPrizeToken ? (
          <span>-</span>
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  )
}

interface ClaimFeeStatProps {
  type: 'avg' | 'high' | 'low'
  data: { amount: bigint; percentage: number }
  prizeToken: Token
  className?: string
}

const ClaimFeeStat = (props: ClaimFeeStatProps) => {
  const { type, data, prizeToken, className } = props

  return (
    <div
      className={classNames(
        'grid grid-cols-[minmax(0,1fr)_minmax(0,3fr)_minmax(0,1fr)] items-center text-sm',
        {
          'text-pt-purple-700': type === 'avg',
          'text-red-600': type === 'high',
          'text-green-600': type === 'low'
        },
        className
      )}
    >
      <span className='w-10'>{type.toUpperCase()}</span>
      <span className='px-2 text-right text-xl font-semibold border-x border-x-pt-purple-100'>
        {formatBigIntForDisplay(data.amount, prizeToken.decimals, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}{' '}
        <span className='text-sm font-normal text-pt-purple-700'>{prizeToken.symbol}</span>
      </span>
      <span className='pl-2'>
        <span className='text-xl'>
          {data.percentage.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </span>
        %
      </span>
    </div>
  )
}
