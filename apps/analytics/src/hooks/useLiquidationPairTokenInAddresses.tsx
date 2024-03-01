import { NO_REFETCH } from '@shared/generic-react-hooks'
import { liquidationPairABI } from '@shared/utilities'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'

export const useLiquidationPairTokenInAddresses = (chainId: number, lpAddresses: Address[]) => {
  const publicClient = usePublicClient({ chainId })

  const results = useQueries({
    queries: lpAddresses.map((lpAddress) => {
      return {
        queryKey: ['lpTokenInAddress', chainId, lpAddress],
        queryFn: async () => {
          if (!!publicClient) {
            return await publicClient.readContract({
              address: lpAddress,
              abi: liquidationPairABI,
              functionName: 'tokenIn'
            })
          }
        },
        enabled: !!publicClient && !!lpAddress,
        ...NO_REFETCH
      }
    })
  })

  return useMemo(() => {
    const isFetched = results?.every((result) => result.isFetched)

    const data: { [lpAddress: Address]: Address } = {}
    lpAddresses.forEach((lpAddress, i) => {
      const tokenIn = results[i]?.data
      if (!!tokenIn) {
        data[lpAddress] = tokenIn
      }
    })

    return { isFetched, data }
  }, [results])
}

export const useLiquidationPairTokenInAddress = (
  chainId: number,
  lpAddress: Address
): { data?: Address; isFetched: boolean } => {
  const tokenInAddresses = useLiquidationPairTokenInAddresses(chainId, [lpAddress])

  return { ...tokenInAddresses, data: tokenInAddresses.data[lpAddress] }
}
