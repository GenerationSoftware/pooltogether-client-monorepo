import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useDrawAwardedEvents,
  usePrizeDrawWinners
} from '@generationsoftware/hyperstructure-react-hooks'
import { SubgraphDraw } from '@shared/types'
import { ExternalLink, Spinner } from '@shared/ui'
import { divideBigInts, getBlockExplorerUrl, MAX_UINT_256 } from '@shared/utilities'
import classNames from 'classnames'
import { useMemo } from 'react'
import { isCanaryTier } from 'src/utils'
import { QUERY_START_BLOCK } from '@constants/config'

type Stat = { amount: bigint; percentage: number; txHash?: `0x${string}` }

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
  const draw = allDraws?.find((d) => d.id === drawId)

  const { data: drawAwardedEvents, isFetched: isFetchedDrawAwardedEvents } = useDrawAwardedEvents(
    prizePool,
    { fromBlock: !!prizePool ? QUERY_START_BLOCK[prizePool.chainId] : undefined }
  )

  const numTiers = useMemo(() => {
    const drawAwardedEvent = drawAwardedEvents?.find((e) => e.args.drawId === drawId)
    return drawAwardedEvent?.args.numTiers
  }, [drawId, drawAwardedEvents])

  const wins = useMemo(() => {
    const filteredWins: SubgraphDraw['prizeClaims'] = []
    if (!!draw) {
      draw.prizeClaims.forEach((prize) => {
        if (
          prize.claimReward > 0n &&
          prize.claimRewardRecipient !== prize.recipient &&
          (tier === undefined || prize.tier === tier) &&
          (!hideCanary || (!!numTiers && !isCanaryTier(prize.tier, numTiers)))
        ) {
          filteredWins.push(prize)
        }
      })
    }
    return filteredWins
  }, [tier, draw, numTiers])

  const claimFeeStats = useMemo(() => {
    if (wins.length > 0) {
      const sumClaimFeeAmount = wins.reduce((a, b) => a + b.claimReward, 0n)
      const sumPrizeAmount = wins.reduce((a, b) => a + b.payout, 0n)

      const high: Stat = wins.reduce(
        (a, b) => {
          const percentage = divideBigInts(b.claimReward, b.payout + b.claimReward) * 100
          return a.percentage < percentage
            ? { amount: b.claimReward, percentage, txHash: b.txHash }
            : a
        },
        { amount: 0n, percentage: 0 }
      )

      const low: Stat = wins.reduce(
        (a, b) => {
          const percentage = divideBigInts(b.claimReward, b.payout + b.claimReward) * 100
          return a.percentage > percentage
            ? { amount: b.claimReward, percentage, txHash: b.txHash }
            : a
        },
        { amount: MAX_UINT_256, percentage: 100 }
      )

      const avg = {
        amount: BigInt(Math.floor(divideBigInts(sumClaimFeeAmount, BigInt(wins.length)))),
        percentage: divideBigInts(sumClaimFeeAmount, sumPrizeAmount + sumClaimFeeAmount) * 100
      }

      return { avg, high, low }
    }
  }, [wins])

  return (
    <div className={classNames('flex flex-col gap-1 text-sm text-pt-purple-300', className)}>
      {!!prizePool && !!claimFeeStats ? (
        <>
          <ClaimFeeStat type='avg' data={claimFeeStats.avg} />
          <ClaimFeeStat type='high' data={claimFeeStats.high} chainId={prizePool.chainId} />
          <ClaimFeeStat type='low' data={claimFeeStats.low} chainId={prizePool.chainId} />
        </>
      ) : isFetchedAllDraws && isFetchedDrawAwardedEvents ? (
        <span>-</span>
      ) : (
        <Spinner className='after:border-y-pt-purple-300' />
      )}
    </div>
  )
}

interface ClaimFeeStatProps {
  type: 'avg' | 'high' | 'low'
  data: Stat
  chainId?: number
  className?: string
}

export const ClaimFeeStat = (props: ClaimFeeStatProps) => {
  const { type, data, chainId, className } = props

  const formattedPercentage = (
    <span className='pl-2'>
      <span className='text-xl'>
        {data.percentage.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </span>
      %
    </span>
  )

  return (
    <div
      className={classNames(
        'flex items-center text-sm',
        {
          'text-pt-purple-200': type === 'avg',
          'text-green-200': type === 'high',
          'text-red-400': type === 'low'
        },
        className
      )}
    >
      <span className='w-10 border-r border-r-pt-purple-600'>{type.toUpperCase()}</span>
      {!!chainId && !!data.txHash ? (
        <ExternalLink href={getBlockExplorerUrl(chainId, data.txHash, 'tx')} size='sm'>
          {formattedPercentage}
        </ExternalLink>
      ) : (
        formattedPercentage
      )}
    </div>
  )
}
