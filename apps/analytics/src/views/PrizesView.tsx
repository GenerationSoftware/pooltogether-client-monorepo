import { sToMs } from '@shared/utilities'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { DrawAvgClaimFeesChart } from '@components/Charts/DrawAvgClaimFeesChart'
import { DrawSelector } from '@components/Draws/DrawSelector'
import { DrawStatusBadge } from '@components/Draws/DrawStatusBadge'
import { PrizesTable } from '@components/Prizes/PrizesTable'
import { usePrizePool } from '@hooks/usePrizePool'
import { useRngTxs } from '@hooks/useRngTxs'

interface PrizesViewProps {
  chainId: number
  className?: string
}

export const PrizesView = (props: PrizesViewProps) => {
  const { chainId, className } = props

  const router = useRouter()

  const prizePool = usePrizePool(chainId)

  const drawIdSelected = useMemo(() => {
    const queryDraw = router.query['draw'] as string | undefined
    return queryDraw ? parseInt(queryDraw) : undefined
  }, [router.query])

  const { refetch: refetchRngTxs } = useRngTxs(prizePool)

  // Automatic data refetching
  useEffect(() => {
    const interval = setInterval(() => {
      refetchRngTxs()
    }, sToMs(300))

    return () => clearInterval(interval)
  }, [])

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
