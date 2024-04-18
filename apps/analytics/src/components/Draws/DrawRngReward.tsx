import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { usePrizeTokenData } from '@generationsoftware/hyperstructure-react-hooks'
import { ExternalLink, Spinner } from '@shared/ui'
import { formatBigIntForDisplay, getBlockExplorerUrl, shorten } from '@shared/utilities'
import classNames from 'classnames'
import { useCurrentRngAuctionReward } from '@hooks/useCurrentRngAuctionReward'
import { useDrawStatus } from '@hooks/useDrawStatus'
import { useRngTxs } from '@hooks/useRngTxs'
import { DrawCardItemTitle } from './DrawCardItemTitle'

interface DrawRngRewardProps {
  prizePool: PrizePool
  drawId: number
  className?: string
}

export const DrawRngReward = (props: DrawRngRewardProps) => {
  const { prizePool, drawId, className } = props

  const { status, isSkipped } = useDrawStatus(prizePool, drawId)

  const { data: allRngTxs, isFetched: isFetchedAllRngTxs } = useRngTxs(prizePool)
  const drawStartTxs = allRngTxs?.find((txs) => txs.drawStart[0].drawId === drawId)?.drawStart

  const { data: prizeToken } = usePrizeTokenData(prizePool)

  const { data: currentRngAuctionReward } = useCurrentRngAuctionReward(prizePool)

  const isRngCompletionPossible = status === 'closed' && !!currentRngAuctionReward && !isSkipped

  const getFormattedAmount = (rawAmount: bigint, decimals: number) => {
    const formattedBigInt = formatBigIntForDisplay(rawAmount, decimals, {
      maximumFractionDigits: 4
    })

    return formattedBigInt !== '0' ? formattedBigInt : '< 0.0001'
  }

  return (
    <div className={classNames('flex flex-col gap-3', className)}>
      <DrawCardItemTitle>{isRngCompletionPossible ? 'Current ' : ''}RNG Reward</DrawCardItemTitle>
      <div className='flex flex-col gap-1 text-sm text-pt-purple-200 whitespace-nowrap'>
        {isFetchedAllRngTxs && !!prizeToken ? (
          <>
            {!!drawStartTxs ? (
              drawStartTxs.map((drawStartTx) => (
                <span key={`reward-${drawStartTx.hash}`}>
                  <span
                    className={classNames('text-xl font-semibold', { 'line-through': isSkipped })}
                  >
                    {getFormattedAmount(drawStartTx.reward, prizeToken.decimals)}
                  </span>{' '}
                  {prizeToken.symbol}
                </span>
              ))
            ) : isRngCompletionPossible ? (
              <span>
                <span className='text-xl font-semibold'>
                  {getFormattedAmount(currentRngAuctionReward, prizeToken.decimals)}
                </span>{' '}
                {prizeToken.symbol}
              </span>
            ) : (
              <span>-</span>
            )}
            {!!drawStartTxs
              ? drawStartTxs.map((drawStartTx) => (
                  <ExternalLink
                    key={`link-${drawStartTx.hash}`}
                    href={getBlockExplorerUrl(prizePool.chainId, drawStartTx.hash, 'tx')}
                    className='text-blue-400 hover:text-blue-300 transition'
                  >
                    {shorten(drawStartTx.hash, { short: true })}
                  </ExternalLink>
                ))
              : isRngCompletionPossible && <span>Not Yet Awarded</span>}
          </>
        ) : (
          <Spinner className='after:border-y-pt-purple-300' />
        )}
      </div>
    </div>
  )
}
