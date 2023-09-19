import { NO_REFETCH } from '@shared/generic-react-hooks'
import { liquidationPairABI } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'

export const useLiquidationPairTokenOutAddress = (chainId: number, lpAddress: Address) => {
  const publicClient = usePublicClient({ chainId })

  const queryKey = ['lpTokenOutAddress', chainId, lpAddress]

  return useQuery(
    queryKey,
    async () =>
      await publicClient.readContract({
        address: lpAddress,
        abi: liquidationPairABI,
        functionName: 'tokenOut'
      }),
    {
      enabled: !!publicClient && !!lpAddress,
      ...NO_REFETCH
    }
  )
}
