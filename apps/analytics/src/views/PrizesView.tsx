import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { PRIZE_POOLS, sToMs } from '@shared/utilities'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { useEffect, useMemo } from 'react'
import { selectedDrawIdAtom } from 'src/atoms'
import { PublicClient } from 'viem'
import { usePublicClient } from 'wagmi'
import { DrawAvgClaimFeesChart } from '@components/Charts/DrawAvgClaimFeesChart'
import { DrawSelector } from '@components/Draws/DrawSelector'
import { DrawStatusBadge } from '@components/Draws/DrawStatusBadge'
import { PrizesTable } from '@components/Prizes/PrizesTable'
import { useRngTxs } from '@hooks/useRngTxs'

interface PrizesViewProps {
  chainId: number
  className?: string
}

export const PrizesView = (props: PrizesViewProps) => {
  const { chainId, className } = props

  const publicClient = usePublicClient({ chainId })

  const prizePool = useMemo(() => {
    const prizePoolInfo = PRIZE_POOLS.find(
      (pool) => pool.chainId === chainId
    ) as (typeof PRIZE_POOLS)[number]

    return new PrizePool(
      prizePoolInfo.chainId,
      prizePoolInfo.address,
      publicClient as PublicClient,
      prizePoolInfo.options
    )
  }, [chainId, publicClient])

  const { refetch: refetchRngTxs } = useRngTxs(prizePool)

  // Automatic data refetching
  useEffect(() => {
    const interval = setInterval(() => {
      refetchRngTxs()
    }, sToMs(300))

    return () => clearInterval(interval)
  }, [])

  const drawIdSelected = useAtomValue(selectedDrawIdAtom)

  return (
    <div className={classNames('w-full flex flex-col grow gap-2 items-center md:gap-6', className)}>
      {!!drawIdSelected && (
        <>
          <DrawStatusBadge prizePool={prizePool} drawId={drawIdSelected} />
          <DrawAvgClaimFeesChart
            prizePool={prizePool}
            drawId={drawIdSelected}
            className='max-w-4xl'
          />
          <PrizesTable prizePool={prizePool} drawId={drawIdSelected} className='md:mt-6' />
        </>
      )}
      <DrawSelector prizePool={prizePool} excludeDrawStatus={['open', 'closed']} />
    </div>
  )
}
