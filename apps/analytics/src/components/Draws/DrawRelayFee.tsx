import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { usePrizeTokenData } from '@generationsoftware/hyperstructure-react-hooks'
import { ExternalLink, Spinner } from '@shared/ui'
import { formatBigIntForDisplay, getBlockExplorerUrl, shorten } from '@shared/utilities'
import classNames from 'classnames'
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
  const rngTxs = allRngTxs?.find((txs) => txs.rng.drawId === drawId)
  const relayTx = rngTxs?.relay

  const { data: prizeToken } = usePrizeTokenData(prizePool)

  // TODO: get current relay reward fraction
  // 1. https://etherscan.io/address/0x8cfffffa42407db9dcb974c2c744425c3e58d832#readContract#F7
  // 2. https://etherscan.io/address/0x0D51a33975024E8aFc55fde9F6b070c10AA71Dd9#readContract#F1 w/ rngRequestId
  // 3. https://optimistic.etherscan.io/address/0xf4c47dacfda99be38793181af9fd1a2ec7576bbf#readContract#F2 w/ currentTimestamp - completedAt
  const currentFeePercentage = 0

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
              ) : (
                // ) : !!currentFeePercentage && !!rngTxs?.rng ? (
                //   <>
                //     <span className='text-xl font-semibold'>
                //       {currentFeePercentage.toLocaleString(undefined, {
                //         minimumFractionDigits: 2,
                //         maximumFractionDigits: 2
                //       })}
                //     </span>
                //     %
                //   </>
                <span>-</span>
              )}
            </span>
            {!!relayTx ? (
              <ExternalLink href={getBlockExplorerUrl(prizePool.chainId, relayTx.hash, 'tx')}>
                {shorten(relayTx.hash, { short: true })}
              </ExternalLink>
            ) : (
              !!currentFeePercentage && !!rngTxs?.rng && <span>Not Yet Awarded</span>
            )}
          </>
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  )
}
