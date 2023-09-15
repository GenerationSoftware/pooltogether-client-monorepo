import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { Spinner } from '@shared/ui'
import { PRIZE_POOLS } from '@shared/utilities'
import classNames from 'classnames'
import { useMemo } from 'react'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'
import { useRngTxs } from '@hooks/useRngTxs'
import { DrawCard } from './DrawCard'

interface DrawCardsProps {
  chainId: number
  className?: string
}

export const DrawCards = (props: DrawCardsProps) => {
  const { chainId, className } = props

  const publicClient = usePublicClient({ chainId })

  const prizePool = useMemo(() => {
    const prizePoolInfo = PRIZE_POOLS.find((pool) => pool.chainId === chainId) as {
      chainId: number
      address: Address
      options: { prizeTokenAddress: Address; drawPeriodInSeconds: number; tierShares: number }
    }

    return new PrizePool(
      prizePoolInfo.chainId,
      prizePoolInfo.address,
      publicClient,
      prizePoolInfo.options
    )
  }, [chainId])

  const { data: rngTxs, isFetched: isFetchedRngTxs } = useRngTxs(prizePool)

  if (!isFetchedRngTxs || !rngTxs) {
    return <Spinner />
  }

  const lastRngTxs = rngTxs[rngTxs.length - 1]
  const lastDrawId = lastRngTxs.rng.drawId

  // TODO: should cap draws rendered in at once and add a "show more" at the bottom
  return (
    <div className={classNames('w-full flex flex-col gap-3 items-center', className)}>
      {!!lastRngTxs.relay && (
        <DrawCard
          key={`draw-${lastDrawId + 1}-${chainId}`}
          prizePool={prizePool}
          drawId={lastDrawId + 1}
        />
      )}
      {[...rngTxs].reverse().map((txs) => (
        <DrawCard
          key={`draw-${txs.rng.drawId}-${chainId}`}
          prizePool={prizePool}
          drawId={txs.rng.drawId}
        />
      ))}
    </div>
  )
}
