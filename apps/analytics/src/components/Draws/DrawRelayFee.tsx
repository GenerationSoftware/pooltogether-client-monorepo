import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { usePrizeTokenData } from '@generationsoftware/hyperstructure-react-hooks'
import { ExternalLink, Spinner } from '@shared/ui'
import { formatBigIntForDisplay, getBlockExplorerUrl, shorten, sToMs } from '@shared/utilities'
import classNames from 'classnames'
import { useDrawRngFeePercentage } from '@hooks/useDrawRngFeePercentage'
import { useRngTxs } from '@hooks/useRngTxs'
import { DrawCardItemTitle } from './DrawCardItemTitle'

interface DrawRelayFeeProps {
  prizePool: PrizePool
  drawId: number
  className?: string
}

export const DrawRelayFee = (props: DrawRelayFeeProps) => {
  const { prizePool, drawId, className } = props

  const { data: allRngTxs, isFetched: isFetchedAllRngTxs } = useRngTxs(prizePool)
  const relayTx = allRngTxs?.find((txs) => txs.rng.drawId === drawId)?.relay

  const { data: prizeToken } = usePrizeTokenData(prizePool)

  const { data: currentFeePercentage } = useDrawRngFeePercentage({ refetchInterval: sToMs(60) })

  return (
    <div className={classNames('flex flex-col gap-3', className)}>
      <DrawCardItemTitle>
        {isFetchedAllRngTxs && !relayTx ? 'Current ' : ''}Relay Fee
      </DrawCardItemTitle>
      <div className='flex flex-col gap-1 text-sm text-pt-purple-700 whitespace-nowrap'>
        {isFetchedAllRngTxs && !!prizeToken ? (
          <>
            <span>
              {!!relayTx ? (
                <>
                  <span className='text-xl font-semibold'>
                    {formatBigIntForDisplay(relayTx.fee, prizeToken.decimals, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>{' '}
                  {prizeToken.symbol}{' '}
                  {!!relayTx.feeFraction && (
                    <>
                      (
                      {formatBigIntForDisplay(relayTx.feeFraction, 16, {
                        maximumFractionDigits: 0
                      })}
                      %)
                    </>
                  )}
                </>
              ) : !!currentFeePercentage ? (
                <>
                  <span className='text-xl font-semibold'>
                    {currentFeePercentage.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                  %
                </>
              ) : (
                <span>-</span>
              )}
            </span>
            {!!relayTx ? (
              <ExternalLink href={getBlockExplorerUrl(prizePool.chainId, relayTx.hash, 'tx')}>
                {shorten(relayTx.hash, { short: true })}
              </ExternalLink>
            ) : (
              !!currentFeePercentage && <span>Not Yet Awarded</span>
            )}
          </>
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  )
}
