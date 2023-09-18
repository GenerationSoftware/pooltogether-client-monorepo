import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { QUERY_START_BLOCK } from '@constants/config'

export const usePrizeBackstopEvents = (prizePool: PrizePool) => {
  const publicClient = usePublicClient({ chainId: prizePool?.chainId })

  const queryKey = ['prizeBackstopEvents', prizePool?.chainId]

  return useQuery(
    queryKey,
    async () => {
      return await publicClient.getLogs({
        address: prizePool.address,
        event: {
          inputs: [{ indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }],
          name: 'ReserveConsumed',
          type: 'event'
        },
        fromBlock: QUERY_START_BLOCK[prizePool.chainId],
        toBlock: 'latest',
        strict: true
      })
    },
    {
      enabled: !!prizePool && !!publicClient,
      ...NO_REFETCH
    }
  )
}
