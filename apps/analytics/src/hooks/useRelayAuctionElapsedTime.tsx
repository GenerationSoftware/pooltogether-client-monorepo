import { NO_REFETCH } from '@shared/generic-react-hooks'
import { chainlinkVrfABI, NETWORK, RNG_AUCTION, rngAuctionABI } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'

export const useRelayAuctionElapsedTime = (options?: { refetchInterval?: number }) => {
  const mainnetPublicClient = usePublicClient({ chainId: NETWORK.mainnet })

  return useQuery(
    ['relayAuctionElapsedTime'],
    async () => {
      const lastAuction = await mainnetPublicClient.readContract({
        address: RNG_AUCTION.address,
        abi: rngAuctionABI,
        functionName: 'getLastAuction'
      })

      const completedAt = await mainnetPublicClient.readContract({
        address: lastAuction.rng,
        abi: chainlinkVrfABI,
        functionName: 'completedAt',
        args: [lastAuction.rngRequestId]
      })

      return BigInt(Math.floor(Date.now() / 1_000)) - completedAt
    },
    {
      enabled: !!mainnetPublicClient,
      ...NO_REFETCH,
      refetchInterval: options?.refetchInterval ?? false
    }
  )
}
