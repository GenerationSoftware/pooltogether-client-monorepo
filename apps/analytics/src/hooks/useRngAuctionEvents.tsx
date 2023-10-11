import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { RNG_AUCTION } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { QUERY_START_BLOCK, RELAY_ORIGINS } from '@constants/config'

export const useRngAuctionEvents = (prizePool: PrizePool) => {
  const originChainId = !!prizePool ? RELAY_ORIGINS[prizePool.chainId] : undefined
  const publicClient = usePublicClient({ chainId: originChainId })

  return useQuery(
    ['rngAuctionEvents'],
    async () => {
      return await publicClient.getLogs({
        address: RNG_AUCTION[originChainId as number].address,
        event: {
          inputs: [
            { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
            { indexed: true, internalType: 'address', name: 'recipient', type: 'address' },
            { indexed: true, internalType: 'uint32', name: 'sequenceId', type: 'uint32' },
            { indexed: false, internalType: 'contract RNGInterface', name: 'rng', type: 'address' },
            { indexed: false, internalType: 'uint32', name: 'rngRequestId', type: 'uint32' },
            { indexed: false, internalType: 'uint64', name: 'elapsedTime', type: 'uint64' },
            { indexed: false, internalType: 'UD2x18', name: 'rewardFraction', type: 'uint64' }
          ],
          name: 'RngAuctionCompleted',
          type: 'event'
        },
        fromBlock: QUERY_START_BLOCK[originChainId as number],
        toBlock: 'latest',
        strict: true
      })
    },
    {
      enabled: !!originChainId && !!publicClient,
      ...NO_REFETCH
    }
  )
}
