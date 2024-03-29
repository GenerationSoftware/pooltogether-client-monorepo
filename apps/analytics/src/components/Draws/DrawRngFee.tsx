import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { usePrizeTokenData } from '@generationsoftware/hyperstructure-react-hooks'
import { ExternalLink, Spinner } from '@shared/ui'
import {
  formatBigIntForDisplay,
  getBlockExplorerUrl,
  RNG_RELAY_ADDRESSES,
  shorten,
  sToMs
} from '@shared/utilities'
import classNames from 'classnames'
import { useDrawRngFeePercentage } from '@hooks/useDrawRngFeePercentage'
import { useDrawStatus } from '@hooks/useDrawStatus'
import { useRngTxs } from '@hooks/useRngTxs'
import { DrawCardItemTitle } from './DrawCardItemTitle'

interface DrawRngFeeProps {
  prizePool: PrizePool
  drawId: number
  className?: string
}

export const DrawRngFee = (props: DrawRngFeeProps) => {
  const { prizePool, drawId, className } = props

  const { status, isSkipped } = useDrawStatus(prizePool, drawId)

  const { data: allRngTxs, isFetched: isFetchedAllRngTxs } = useRngTxs(prizePool)
  const rngTx = allRngTxs?.find((txs) => txs.rng.drawId === drawId)?.rng

  const { data: prizeToken } = usePrizeTokenData(prizePool)

  const { data: currentFeePercentage } = useDrawRngFeePercentage(prizePool, {
    refetchInterval: sToMs(60)
  })

  const canBeAwarded = status === 'closed' && !!currentFeePercentage && !isSkipped

  return (
    <div className={classNames('flex flex-col gap-3', className)}>
      <DrawCardItemTitle>{canBeAwarded ? 'Current ' : ''}RNG Fee</DrawCardItemTitle>
      <div className='flex flex-col gap-1 text-sm text-pt-purple-200 whitespace-nowrap'>
        {isFetchedAllRngTxs && !!prizeToken ? (
          <>
            <span>
              {!!rngTx ? (
                <>
                  {!!rngTx.fee ? (
                    <>
                      <span className='text-xl font-semibold'>
                        {formatBigIntForDisplay(rngTx.fee, prizeToken.decimals, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>{' '}
                      {prizeToken.symbol} (
                      {formatBigIntForDisplay(rngTx.feeFraction, 16, {
                        maximumSignificantDigits: 2
                      })}
                      %)
                    </>
                  ) : (
                    <>
                      <span className='text-xl font-semibold'>
                        {formatBigIntForDisplay(rngTx.feeFraction, 16, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>
                      %
                    </>
                  )}
                </>
              ) : canBeAwarded ? (
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
            {!!rngTx ? (
              <ExternalLink
                href={getBlockExplorerUrl(
                  RNG_RELAY_ADDRESSES[prizePool.chainId].from.chainId,
                  rngTx.hash,
                  'tx'
                )}
                className='text-blue-400 hover:text-blue-300 transition'
              >
                {shorten(rngTx.hash, { short: true })}
              </ExternalLink>
            ) : (
              canBeAwarded && <span>Not Yet Awarded</span>
            )}
          </>
        ) : (
          <Spinner className='after:border-y-pt-purple-300' />
        )}
      </div>
    </div>
  )
}
