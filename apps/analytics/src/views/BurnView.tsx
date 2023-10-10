import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { usePrizeTokenData } from '@generationsoftware/hyperstructure-react-hooks'
import { PRIZE_POOLS } from '@shared/utilities'
import classNames from 'classnames'
import { useMemo } from 'react'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'
import { BurnHeader } from '@components/Burn/BurnHeader'
import { BurnChart } from '@components/Charts/BurnChart'

interface BurnViewProps {
  chainId: number
  className?: string
}

export const BurnView = (props: BurnViewProps) => {
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

  const { data: prizeToken } = usePrizeTokenData(prizePool)

  if (!!prizeToken) {
    return (
      <div className={classNames('w-full flex flex-col gap-6 items-center', className)}>
        <BurnHeader prizeToken={prizeToken} />
        <BurnChart prizePool={prizePool} prizeToken={prizeToken} />
      </div>
    )
  }

  return <></>
}
