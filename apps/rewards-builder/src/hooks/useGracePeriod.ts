import { NO_REFETCH } from '@shared/generic-react-hooks'
import { TWAB_REWARDS_ADDRESSES, twabRewardsABI } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'

/**
 * Returns the grace period for TWAB rewards
 * @returns
 */
export const useGracePeriod = (chainId: number) => {
  const queryKey = ['twabRewardsGracePeriod', chainId]

  const publicClient = usePublicClient({ chainId })

  const twabRewardsAddress = TWAB_REWARDS_ADDRESSES[chainId]

  return useQuery(
    queryKey,
    async () => {
      if (!!publicClient) {
        return publicClient.readContract({
          address: twabRewardsAddress,
          abi: twabRewardsABI,
          functionName: 'GRACE_PERIOD'
        })
      }
    },
    {
      enabled: !!chainId && !!publicClient && !!twabRewardsAddress,
      ...NO_REFETCH
    }
  )
}
