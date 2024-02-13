import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useBlockAtTimestamp,
  usePrizeTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { PRIZE_POOLS, SECONDS_PER_DAY } from '@shared/utilities'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { currentTimestampAtom } from 'src/atoms'
import { Address, PublicClient } from 'viem'
import { usePublicClient } from 'wagmi'
import { BurnHeader } from '@components/Burn/BurnHeader'
import { RecentBurnStats } from '@components/Burn/RecentBurnStats'
import { BurnChart } from '@components/Charts/BurnChart'

interface BurnViewProps {
  chainId: number
  className?: string
}

export const BurnView = (props: BurnViewProps) => {
  const { chainId, className } = props

  const publicClient = usePublicClient({ chainId })

  const currentTimestamp = useAtomValue(currentTimestampAtom)

  const prizePool = useMemo(() => {
    const prizePoolInfo = PRIZE_POOLS.find((pool) => pool.chainId === chainId) as {
      chainId: number
      address: Address
      options: {
        prizeTokenAddress: Address
        drawPeriodInSeconds: number
        tierShares: number
        reserveShares: number
      }
    }

    return new PrizePool(
      prizePoolInfo.chainId,
      prizePoolInfo.address,
      publicClient as PublicClient,
      prizePoolInfo.options
    )
  }, [chainId, publicClient])

  const { data: prizeToken } = usePrizeTokenData(prizePool)

  const { data: minBlockDay } = useBlockAtTimestamp(
    prizePool.chainId,
    currentTimestamp - SECONDS_PER_DAY
  )

  const { data: minBlockWeek } = useBlockAtTimestamp(
    prizePool.chainId,
    currentTimestamp - SECONDS_PER_DAY * 7
  )

  if (!!prizeToken) {
    return (
      <div className={classNames('w-full flex flex-col gap-6 items-center', className)}>
        <div className='flex flex-col items-center'>
          <BurnHeader prizeToken={prizeToken} className='mb-3' />
          {!!minBlockDay && (
            <RecentBurnStats prizeToken={prizeToken} minBlock={minBlockDay} label='Last 24 hours' />
          )}
          {!!minBlockWeek && (
            <RecentBurnStats prizeToken={prizeToken} minBlock={minBlockWeek} label='Last week' />
          )}
        </div>
        <BurnChart prizePool={prizePool} prizeToken={prizeToken} />
      </div>
    )
  }

  return <></>
}
