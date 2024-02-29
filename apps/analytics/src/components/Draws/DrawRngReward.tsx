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
  const rngAuctionTx = allRngTxs?.find((txs) => txs.rngAuction.drawId === drawId)?.rngAuction

  const { data: prizeToken } = usePrizeTokenData(prizePool)

  const { data: currentRngAuctionReward } = useCurrentRngAuctionReward(prizePool)

  const isRngCompletionPossible = status === 'closed' && !!currentRngAuctionReward && !isSkipped

  return (
    <div className={classNames('flex flex-col gap-3', className)}>
      <DrawCardItemTitle>{isRngCompletionPossible ? 'Current ' : ''}RNG Reward</DrawCardItemTitle>
      <div className='flex flex-col gap-1 text-sm text-pt-purple-200 whitespace-nowrap'>
        {isFetchedAllRngTxs && !!prizeToken ? (
          <>
            <span>
              {!!rngAuctionTx ? (
                <>
                  {rngAuctionTx.reward !== undefined ? (
                    <>
                      <span className='text-xl font-semibold'>
                        {formatBigIntForDisplay(rngAuctionTx.reward, prizeToken.decimals, {
                          maximumFractionDigits: 5
                        })}
                      </span>{' '}
                      {prizeToken.symbol}
                    </>
                  ) : (
                    <>
                      {/* TODO: get last rng auction reward from draw manager to display here */}
                      <span className='text-xl font-semibold'>?</span>
                    </>
                  )}
                </>
              ) : isRngCompletionPossible ? (
                <>
                  <span className='text-xl font-semibold'>
                    {formatBigIntForDisplay(currentRngAuctionReward, prizeToken.decimals, {
                      maximumFractionDigits: 5
                    })}
                  </span>{' '}
                  {prizeToken.symbol}
                </>
              ) : (
                <span>-</span>
              )}
            </span>
            {!!rngAuctionTx ? (
              <ExternalLink
                href={getBlockExplorerUrl(prizePool.chainId, rngAuctionTx.hash, 'tx')}
                className='text-blue-400 hover:text-blue-300 transition'
              >
                {shorten(rngAuctionTx.hash, { short: true })}
              </ExternalLink>
            ) : (
              isRngCompletionPossible && <span>Not Yet Awarded</span>
            )}
          </>
        ) : (
          <Spinner className='after:border-y-pt-purple-300' />
        )}
      </div>
    </div>
  )
}
