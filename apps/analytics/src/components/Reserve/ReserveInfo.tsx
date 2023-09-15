import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  usePrizeDrawTimestamps,
  usePrizeTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import { formatBigIntForDisplay, PRIZE_POOLS, SECONDS_PER_DAY, sToMs } from '@shared/utilities'
import classNames from 'classnames'
import { useAtom } from 'jotai'
import { useEffect, useMemo } from 'react'
import { currentTimestampAtom } from 'src/atoms'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'
import { useBlockAtTimestamp } from '@hooks/useBlockAtTimestamp'
import { useManualContributionEvents } from '@hooks/useManualContributionEvents'
import { usePrizeBackstopEvents } from '@hooks/usePrizeBackstopEvents'
import { useRelayAuctionEvents } from '@hooks/useRelayAuctionEvents'
import { useReserve } from '@hooks/useReserve'
import { useRngAuctionEvents } from '@hooks/useRngAuctionEvents'
import { ReserveCard } from './ReserveCard'

interface ReserveInfoProps {
  chainId: number
  className?: string
}

export const ReserveInfo = (props: ReserveInfoProps) => {
  const { chainId, className } = props

  const publicClient = usePublicClient({ chainId })

  const [currentTimestamp, setCurrentTimestamp] = useAtom(currentTimestampAtom)

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

  const { data: reserve, refetch: refetchReserve } = useReserve(prizePool)

  const { data: prizeToken } = usePrizeTokenData(prizePool)

  const { data: minBlock } = useBlockAtTimestamp(
    prizePool.chainId,
    currentTimestamp - SECONDS_PER_DAY
  )

  // TODO: refetch liquidation events here once setup
  const { refetch: refetchManualContributionEvents } = useManualContributionEvents(prizePool)
  const { refetch: refetchPrizeBackstopEvents } = usePrizeBackstopEvents(prizePool)
  const { refetch: refetchRngAuctionEvents } = useRngAuctionEvents()
  const { refetch: refetchRelayAuctionEvents } = useRelayAuctionEvents(prizePool)
  const { refetch: refetchPrizeDrawTimestamps } = usePrizeDrawTimestamps(prizePool)

  // Automatic data refetching
  useEffect(() => {
    const interval = setInterval(() => {
      refetchReserve()
      refetchManualContributionEvents()
      refetchPrizeBackstopEvents()
      refetchRngAuctionEvents()
      refetchRelayAuctionEvents()
      refetchPrizeDrawTimestamps()
      setCurrentTimestamp(Math.floor(Date.now() / 1_000))
    }, sToMs(300))

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={classNames('w-full flex flex-col gap-6 items-center', className)}>
      <div className='flex flex-col items-center'>
        <span>Current Reserve:</span>
        <span className='flex gap-1 items-center text-pt-purple-500'>
          <span className='text-4xl font-semibold'>
            {!!reserve && !!prizeToken ? (
              formatBigIntForDisplay(reserve, prizeToken.decimals, {
                hideZeroes: true
              })
            ) : (
              <Spinner />
            )}
          </span>{' '}
          {prizeToken?.symbol}
        </span>
      </div>
      {!!minBlock && <ReserveCard prizePool={prizePool} minBlock={minBlock} className='max-w-md' />}
      <ReserveCard prizePool={prizePool} className='max-w-md' />
    </div>
  )
}
