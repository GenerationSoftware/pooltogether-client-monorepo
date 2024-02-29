import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { usePrizeTokenData } from '@generationsoftware/hyperstructure-react-hooks'
import { ExternalLink, Spinner } from '@shared/ui'
import { formatBigIntForDisplay, getBlockExplorerUrl, shorten } from '@shared/utilities'
import classNames from 'classnames'
import { useCurrentDrawAwardReward } from '@hooks/useCurrentDrawAwardReward'
import { useDrawStatus } from '@hooks/useDrawStatus'
import { useRngTxs } from '@hooks/useRngTxs'
import { DrawCardItemTitle } from './DrawCardItemTitle'

interface DrawAwardRewardProps {
  prizePool: PrizePool
  drawId: number
  className?: string
}

export const DrawAwardReward = (props: DrawAwardRewardProps) => {
  const { prizePool, drawId, className } = props

  const { status, isSkipped } = useDrawStatus(prizePool, drawId)

  const { data: allRngTxs, isFetched: isFetchedAllRngTxs } = useRngTxs(prizePool)
  const rngTxs = allRngTxs?.find((txs) => txs.rngAuction.drawId === drawId)
  const drawAwardTx = rngTxs?.drawAward

  const { data: prizeToken } = usePrizeTokenData(prizePool)

  const { data: currentDrawAwardReward } = useCurrentDrawAwardReward(prizePool)

  const isAwardPossible = status === 'closed' && !!currentDrawAwardReward && !isSkipped

  return (
    <div className={classNames('flex flex-col gap-3', className)}>
      <DrawCardItemTitle>
        {isAwardPossible ? 'Current ' : ''}
        Award Reward
      </DrawCardItemTitle>
      <div className='flex flex-col gap-1 text-sm text-pt-purple-200 whitespace-nowrap'>
        {isFetchedAllRngTxs && !!prizeToken ? (
          <>
            <span>
              {!!drawAwardTx ? (
                <>
                  <span className='text-xl font-semibold'>
                    {formatBigIntForDisplay(drawAwardTx.reward, prizeToken.decimals, {
                      maximumFractionDigits: 5
                    })}
                  </span>{' '}
                  {prizeToken.symbol}
                </>
              ) : isAwardPossible ? (
                <>
                  <span className='text-xl font-semibold'>
                    {formatBigIntForDisplay(currentDrawAwardReward, prizeToken.decimals, {
                      maximumFractionDigits: 5
                    })}
                  </span>{' '}
                  {prizeToken.symbol}
                </>
              ) : (
                <span>-</span>
              )}
            </span>
            {!!drawAwardTx ? (
              <ExternalLink
                href={getBlockExplorerUrl(prizePool.chainId, drawAwardTx.hash, 'tx')}
                className='text-blue-400 hover:text-blue-300 transition'
              >
                {shorten(drawAwardTx.hash, { short: true })}
              </ExternalLink>
            ) : (
              isAwardPossible && <span>Not Yet Awarded</span>
            )}
          </>
        ) : (
          <Spinner className='after:border-y-pt-purple-300' />
        )}
      </div>
    </div>
  )
}
