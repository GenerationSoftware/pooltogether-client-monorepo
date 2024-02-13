import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import {
  chainlinkVrfABI,
  getSecondsSinceEpoch,
  RNG_AUCTION,
  RNG_RELAY_ADDRESSES,
  rngAuctionABI
} from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'

export const useRelayAuctionElapsedTime = (
  prizePool: PrizePool,
  options?: { refetchInterval?: number }
) => {
  const originChainId = !!prizePool
    ? RNG_RELAY_ADDRESSES[prizePool.chainId].from.chainId
    : undefined
  const publicClient = usePublicClient({ chainId: originChainId })

  return useQuery(
    ['relayAuctionElapsedTime'],
    async () => {
      if (!!publicClient) {
        const lastAuction = await publicClient.readContract({
          address: RNG_AUCTION[originChainId as number].address,
          abi: rngAuctionABI,
          functionName: 'getLastAuction'
        })

        if (!lastAuction.rngRequestId) {
          return 0n
        }

        const completedAt = await publicClient.readContract({
          address: lastAuction.rng,
          abi: chainlinkVrfABI,
          functionName: 'completedAt',
          args: [lastAuction.rngRequestId]
        })

        return BigInt(getSecondsSinceEpoch()) - completedAt
      }
    },
    {
      enabled: !!originChainId && !!publicClient,
      ...NO_REFETCH,
      refetchInterval: options?.refetchInterval ?? false
    }
  )
}
