import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useLiquidationEvents,
  useManualContributionEvents,
  usePrizeBackstopEvents,
  useToken
} from '@generationsoftware/hyperstructure-react-hooks'
import { getSecondsSinceEpoch, POOL_TOKEN_ADDRESSES, PRIZE_POOLS, sToMs } from '@shared/utilities'
import classNames from 'classnames'
import { useSetAtom } from 'jotai'
import { useEffect, useMemo } from 'react'
import { currentTimestampAtom } from 'src/atoms'
import { PublicClient } from 'viem'
import { usePublicClient } from 'wagmi'
import { ReserveChart } from '@components/Charts/ReserveChart'
import { ReserveHeader } from '@components/Reserve/ReserveHeader'
import { QUERY_START_BLOCK } from '@constants/config'
import { useReserve } from '@hooks/useReserve'
import { useRngTxs } from '@hooks/useRngTxs'

interface ReserveViewProps {
  chainId: number
  className?: string
}

export const ReserveView = (props: ReserveViewProps) => {
  const { chainId, className } = props

  const publicClient = usePublicClient({ chainId })

  const setCurrentTimestamp = useSetAtom(currentTimestampAtom)

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

  const { data: burnToken } = useToken(
    chainId,
    POOL_TOKEN_ADDRESSES[prizePool.chainId as keyof typeof POOL_TOKEN_ADDRESSES]
  )

  const fromBlock = !!prizePool ? QUERY_START_BLOCK[prizePool.chainId] : undefined

  const { refetch: refetchReserve } = useReserve(prizePool)
  const { refetch: refetchLiquidationEvents } = useLiquidationEvents(prizePool?.chainId, {
    fromBlock
  })
  const { refetch: refetchManualContributionEvents } = useManualContributionEvents(prizePool, {
    fromBlock
  })
  const { refetch: refetchPrizeBackstopEvents } = usePrizeBackstopEvents(prizePool, { fromBlock })
  const { refetch: refetchRngTxs } = useRngTxs(prizePool)

  // Automatic data refetching
  useEffect(() => {
    const interval = setInterval(() => {
      refetchReserve()
      refetchLiquidationEvents()
      refetchManualContributionEvents()
      refetchPrizeBackstopEvents()
      refetchRngTxs()
      setCurrentTimestamp(getSecondsSinceEpoch())
    }, sToMs(300))

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={classNames('w-full flex flex-col gap-6 items-center', className)}>
      <ReserveHeader prizePool={prizePool} />
      {!!burnToken && <ReserveChart prizePool={prizePool} burnToken={burnToken} />}
    </div>
  )
}
