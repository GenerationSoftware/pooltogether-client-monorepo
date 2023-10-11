import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { RNG_RELAY_ADDRESSES } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { QUERY_START_BLOCK } from '@constants/config'

export const useRelayAuctionEvents = (prizePool: PrizePool) => {
  const publicClient = usePublicClient({ chainId: prizePool?.chainId })

  const queryKey = ['relayAuctionEvents', prizePool?.chainId]

  return useQuery(
    queryKey,
    async () => {
      // TODO: clean this up once not on testnet anymore
      const oldRelayAuctionEvents = await publicClient.getLogs({
        address: '0xABDf9A2fc7a26a62c37b3F446454F2B0EF4ADD68',
        event: {
          inputs: [
            { indexed: true, internalType: 'uint32', name: 'sequenceId', type: 'uint32' },
            { indexed: true, internalType: 'address', name: 'recipient', type: 'address' },
            { indexed: true, internalType: 'uint32', name: 'index', type: 'uint32' },
            { indexed: false, internalType: 'uint256', name: 'reward', type: 'uint256' }
          ],
          name: 'AuctionRewardAllocated',
          type: 'event'
        },
        fromBlock: 15600000n,
        toBlock: 15779000n,
        strict: true
      })

      const relayAuctionEvents = await publicClient.getLogs({
        address: RNG_RELAY_ADDRESSES[prizePool.chainId],
        event: {
          inputs: [
            { indexed: true, internalType: 'uint32', name: 'sequenceId', type: 'uint32' },
            { indexed: true, internalType: 'address', name: 'recipient', type: 'address' },
            { indexed: true, internalType: 'uint32', name: 'index', type: 'uint32' },
            { indexed: false, internalType: 'uint256', name: 'reward', type: 'uint256' }
          ],
          name: 'AuctionRewardAllocated',
          type: 'event'
        },
        fromBlock: QUERY_START_BLOCK[prizePool.chainId],
        toBlock: 'latest',
        strict: true
      })

      return oldRelayAuctionEvents.concat(relayAuctionEvents)
    },
    {
      enabled: !!prizePool && !!publicClient && !!RNG_RELAY_ADDRESSES[prizePool.chainId],
      ...NO_REFETCH
    }
  )
}
