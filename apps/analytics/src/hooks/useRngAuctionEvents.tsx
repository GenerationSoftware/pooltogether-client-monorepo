import { NO_REFETCH } from '@shared/generic-react-hooks'
import { NETWORK, RNG_AUCTION } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { QUERY_START_BLOCK } from '@constants/config'

export const useRngAuctionEvents = () => {
  const mainnetPublicClient = usePublicClient({ chainId: NETWORK.mainnet })

  return useQuery(
    ['rngAuctionEvents'],
    async () => {
      return await mainnetPublicClient.getLogs({
        address: RNG_AUCTION[NETWORK.mainnet].address,
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
        fromBlock: QUERY_START_BLOCK[NETWORK.mainnet],
        toBlock: 'latest',
        strict: true
      })
    },
    {
      enabled: !!mainnetPublicClient,
      ...NO_REFETCH
    }
  )
}
