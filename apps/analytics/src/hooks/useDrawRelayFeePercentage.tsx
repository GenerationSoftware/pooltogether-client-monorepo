import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { RNG_RELAY_ADDRESSES, rngRelayABI } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { formatUnits } from 'viem'
import { usePublicClient } from 'wagmi'
import { useRelayAuctionElapsedTime } from './useRelayAuctionElapsedTime'

export const useDrawRelayFeePercentage = (prizePool: PrizePool) => {
  const publicClient = usePublicClient({ chainId: prizePool?.chainId })

  const { data: elapsedTime } = useRelayAuctionElapsedTime()

  const queryKey = ['drawRelayFeePercentage', prizePool?.chainId, elapsedTime?.toString()]

  return useQuery(
    queryKey,
    async () => {
      const rewardFraction = await publicClient.readContract({
        address: RNG_RELAY_ADDRESSES[prizePool.chainId],
        abi: rngRelayABI,
        functionName: 'computeRewardFraction',
        args: [elapsedTime as bigint]
      })

      return parseFloat(formatUnits(rewardFraction, 18)) * 100
    },
    {
      enabled: !!prizePool && !!publicClient && !!elapsedTime,
      ...NO_REFETCH
    }
  )
}
