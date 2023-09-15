import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { usePrizeTokenData } from '@generationsoftware/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import { formatBigIntForDisplay, PRIZE_POOLS, SECONDS_PER_DAY } from '@shared/utilities'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { currentTimestampAtom } from 'src/atoms'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'
import { useBlockAtTimestamp } from '@hooks/useBlockAtTimestamp'
import { useReserve } from '@hooks/useReserve'
import { ReserveCard } from './ReserveCard'

interface ReserveInfoProps {
  chainId: number
  className?: string
}

export const ReserveInfo = (props: ReserveInfoProps) => {
  const { chainId, className } = props

  const publicClient = usePublicClient({ chainId })

  const currentTimestamp = useAtomValue(currentTimestampAtom)

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

  const { data: reserve } = useReserve(prizePool)

  const { data: prizeToken } = usePrizeTokenData(prizePool)

  const { data: minBlock } = useBlockAtTimestamp(
    prizePool.chainId,
    currentTimestamp - SECONDS_PER_DAY
  )

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
      <ReserveCard prizePool={prizePool} minBlock={minBlock?.number} className='max-w-md' />
    </div>
  )
}
