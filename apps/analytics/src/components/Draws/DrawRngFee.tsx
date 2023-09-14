import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { ExternalLink, Spinner } from '@shared/ui'
import { getBlockExplorerUrl, NETWORK, shorten, sToMs } from '@shared/utilities'
import classNames from 'classnames'
import { useDrawRngFeePercentage } from '@hooks/useDrawRngFeePercentage'
import { useDrawRngTx } from '@hooks/useDrawRngTx'
import { DrawCardItemTitle } from './DrawCardItemTitle'

interface DrawRngFeeProps {
  prizePool: PrizePool
  drawId: number
  className?: string
}

export const DrawRngFee = (props: DrawRngFeeProps) => {
  const { prizePool, drawId, className } = props

  const { data: rngTx, isFetched: isFetchedRngTx } = useDrawRngTx(prizePool, drawId)

  const { data: currentFeePercentage } = useDrawRngFeePercentage({ refetchInterval: sToMs(60) })

  return (
    <div className={classNames('flex flex-col gap-3', className)}>
      <DrawCardItemTitle>{isFetchedRngTx && !rngTx ? 'Current ' : ''}RNG Fee</DrawCardItemTitle>
      <div className='flex flex-col gap-1 text-sm text-pt-purple-700'>
        {isFetchedRngTx ? (
          <>
            <span>
              {!!rngTx ? (
                <>
                  <span className='text-xl font-semibold'>
                    {rngTx.feePercentage.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                  %
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
            {!!rngTx ? (
              <ExternalLink href={getBlockExplorerUrl(NETWORK.mainnet, rngTx.hash, 'tx')}>
                {shorten(rngTx.hash, { short: true })}
              </ExternalLink>
            ) : (
              <span>Not Yet Awarded</span>
            )}
          </>
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  )
}
