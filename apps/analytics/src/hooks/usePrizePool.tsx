import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { PRIZE_POOLS } from '@shared/utilities'
import { useMemo } from 'react'
import { usePublicClient } from 'wagmi'

export const usePrizePool = (chainId: number) => {
  const publicClient = usePublicClient({ chainId })

  return useMemo(() => {
    const prizePoolInfo = PRIZE_POOLS.find(
      (pool) => pool.chainId === chainId
    ) as (typeof PRIZE_POOLS)[number]

    return new PrizePool(
      prizePoolInfo.chainId,
      prizePoolInfo.address,
      publicClient!,
      prizePoolInfo.options
    )
  }, [chainId, publicClient])
}
