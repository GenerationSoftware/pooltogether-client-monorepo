import { NO_REFETCH } from '@shared/generic-react-hooks'
import { liquidationPairABI } from '@shared/utilities'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'

export const useLiquidationPairTokenOutAddresses = (chainId: number, lpAddresses: Address[]) => {
  const publicClient = usePublicClient({ chainId })

  const results = useQueries({
    queries: lpAddresses.map((lpAddress) => {
      return {
        queryKey: ['lpTokenOutAddress', chainId, lpAddress],
        queryFn: async () =>
          await publicClient.readContract({
            address: lpAddress,
            abi: liquidationPairABI,
            functionName: 'tokenOut'
          }),
        enabled: !!publicClient && !!lpAddress,
        ...NO_REFETCH
      }
    })
  })

  return useMemo(() => {
    const isFetched = results?.every((result) => result.isFetched)

    const data: { [lpAddress: Address]: Address } = {}
    lpAddresses.forEach((lpAddress, i) => {
      const tokenOut = results[i]?.data
      if (!!tokenOut) {
        data[lpAddress] = tokenOut
      }
    })

    return { isFetched, data }
  }, [results])
}
