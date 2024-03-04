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
  const drawStartTx = allRngTxs?.find((txs) => txs.drawStart.drawId === drawId)?.drawStart

  const { data: prizeToken } = usePrizeTokenData(prizePool)

  const { data: currentRngAuctionReward } = useCurrentRngAuctionReward(prizePool)

  // TODO: query expected reward from draw manager if drawStartTx?.reward === undefined using `drawStartTx.elapsedTime` (not possible with current contract deployment)
  const expectedDrawStartReward: bigint | undefined = undefined

  const isRngCompletionPossible = status === 'closed' && !!currentRngAuctionReward && !isSkipped

  return (
    <div className={classNames('flex flex-col gap-3', className)}>
      <DrawCardItemTitle>{isRngCompletionPossible ? 'Current ' : ''}RNG Reward</DrawCardItemTitle>
      <div className='flex flex-col gap-1 text-sm text-pt-purple-200 whitespace-nowrap'>
        {isFetchedAllRngTxs && !!prizeToken ? (
          <>
            <span>
              {!!drawStartTx ? (
                <>
                  {drawStartTx.reward !== undefined ? (
                    <>
                      <span className='text-xl font-semibold'>
                        {formatBigIntForDisplay(drawStartTx.reward, prizeToken.decimals, {
                          maximumFractionDigits: 5
                        })}
                      </span>{' '}
                      {prizeToken.symbol}
                    </>
                  ) : (
                    <>
                      {expectedDrawStartReward !== undefined ? (
                        <>
                          <span
                            className={classNames('text-xl font-semibold', {
                              'line-through': !isRngCompletionPossible
                            })}
                          >
                            {formatBigIntForDisplay(expectedDrawStartReward, prizeToken.decimals, {
                              maximumFractionDigits: 5
                            })}
                          </span>{' '}
                          {prizeToken.symbol}
                        </>
                      ) : (
                        <Spinner className='after:border-y-pt-purple-300' />
                      )}
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
            {!!drawStartTx ? (
              <ExternalLink
                href={getBlockExplorerUrl(prizePool.chainId, drawStartTx.hash, 'tx')}
                className='text-blue-400 hover:text-blue-300 transition'
              >
                {shorten(drawStartTx.hash, { short: true })}
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
