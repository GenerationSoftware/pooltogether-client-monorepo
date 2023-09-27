import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { MSG_EXECUTOR_ADDRESSES } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { QUERY_START_BLOCK } from '@constants/config'

export const useRngL2RelayMsgEvents = (prizePool: PrizePool) => {
  const publicClient = usePublicClient({ chainId: prizePool?.chainId })

  const queryKey = ['rngL2RelayMsgEvents', prizePool?.chainId]

  return useQuery(
    queryKey,
    async () => {
      return await publicClient.getLogs({
        address: MSG_EXECUTOR_ADDRESSES[prizePool.chainId],
        event: {
          inputs: [
            { indexed: true, internalType: 'uint256', name: 'fromChainId', type: 'uint256' },
            { indexed: true, internalType: 'bytes32', name: 'messageId', type: 'bytes32' }
          ],
          name: 'MessageIdExecuted',
          type: 'event'
        },
        fromBlock: QUERY_START_BLOCK[prizePool.chainId],
        toBlock: 'latest',
        strict: true
      })
    },
    {
      enabled: !!prizePool && !!publicClient && !!MSG_EXECUTOR_ADDRESSES[prizePool.chainId],
      ...NO_REFETCH
    }
  )
}
