import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { chainlinkVrfABI, RNG_AUCTION, rngAuctionABI } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { RELAY_ORIGINS } from '@constants/config'

export const useRelayAuctionElapsedTime = (
  prizePool: PrizePool,
  options?: { refetchInterval?: number }
) => {
  const originChainId = !!prizePool ? RELAY_ORIGINS[prizePool.chainId] : undefined
  const publicClient = usePublicClient({ chainId: originChainId })

  return useQuery(
    ['relayAuctionElapsedTime'],
    async () => {
      const lastAuction = await publicClient.readContract({
        address: RNG_AUCTION[originChainId as number].address,
        abi: rngAuctionABI,
        functionName: 'getLastAuction'
      })

      const completedAt = await publicClient.readContract({
        address: lastAuction.rng,
        abi: chainlinkVrfABI,
        functionName: 'completedAt',
        args: [lastAuction.rngRequestId]
      })

      return BigInt(Math.floor(Date.now() / 1_000)) - completedAt
    },
    {
      enabled: !!originChainId && !!publicClient,
      ...NO_REFETCH,
      refetchInterval: options?.refetchInterval ?? false
    }
  )
}
