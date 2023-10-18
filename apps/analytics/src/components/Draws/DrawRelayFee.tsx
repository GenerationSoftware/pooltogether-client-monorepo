import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { usePrizeTokenData } from '@generationsoftware/hyperstructure-react-hooks'
import { ExternalLink, Spinner } from '@shared/ui'
import { formatBigIntForDisplay, getBlockExplorerUrl, shorten } from '@shared/utilities'
import classNames from 'classnames'
import { formatUnits } from 'viem'
import { RELAY_ORIGINS } from '@constants/config'
import { useDrawRelayFeePercentage } from '@hooks/useDrawRelayFeePercentage'
import { useDrawStatus } from '@hooks/useDrawStatus'
import { useRngTxs } from '@hooks/useRngTxs'
import { DrawCardItemTitle } from './DrawCardItemTitle'

interface DrawRelayFeeProps {
  prizePool: PrizePool
  drawId: number
  className?: string
}

export const DrawRelayFee = (props: DrawRelayFeeProps) => {
  const { prizePool, drawId, className } = props

  const { status, isSkipped } = useDrawStatus(prizePool, drawId)

  const { data: allRngTxs, isFetched: isFetchedAllRngTxs } = useRngTxs(prizePool)
  const rngTxs = allRngTxs?.find((txs) => txs.rng.drawId === drawId)
  const relayMsgTx = rngTxs?.relay.l1
  const relayTx = rngTxs?.relay.l2

  const rngTxFeeFraction = !!rngTxs
    ? parseFloat(formatUnits(rngTxs.rng.feeFraction, 18))
    : undefined

  const { data: prizeToken } = usePrizeTokenData(prizePool)

  const { data: currentFeePercentage } = useDrawRelayFeePercentage(prizePool)

  const canBeRelayed =
    status === 'closed' && !!currentFeePercentage && !!rngTxFeeFraction && !isSkipped

  return (
    <div className={classNames('flex flex-col gap-3', className)}>
      <DrawCardItemTitle>
        {canBeRelayed ? 'Current ' : ''}
        Relay Fee
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
                        maximumSignificantDigits: 2
                      })}
                      %)
                    </>
                  )}
                </>
              ) : canBeRelayed ? (
                <>
                  <span className='text-xl font-semibold'>
                    {((1 - rngTxFeeFraction) * currentFeePercentage).toLocaleString(undefined, {
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
              <>
                {!!relayMsgTx && (
                  <ExternalLink
                    href={getBlockExplorerUrl(
                      RELAY_ORIGINS[prizePool.chainId],
                      relayMsgTx.hash,
                      'tx'
                    )}
                  >
                    {shorten(relayMsgTx.hash, { short: true })}
                  </ExternalLink>
                )}
                <ExternalLink href={getBlockExplorerUrl(prizePool.chainId, relayTx.hash, 'tx')}>
                  {shorten(relayTx.hash, { short: true })}
                </ExternalLink>
              </>
            ) : (
              canBeRelayed && <span>Not Yet Awarded</span>
            )}
          </>
        ) : (
          <Spinner className='after:border-y-pt-purple-800' />
        )}
      </div>
    </div>
  )
}
