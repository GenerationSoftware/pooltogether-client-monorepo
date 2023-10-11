import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { MSG_EXECUTOR_ADDRESSES, NETWORK } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { QUERY_START_BLOCK } from '@constants/config'

export const useRngL2RelayMsgEvents = (prizePool: PrizePool) => {
  const publicClient = usePublicClient({ chainId: prizePool?.chainId })

  const queryKey = ['rngL2RelayMsgEvents', prizePool?.chainId]

  return useQuery(
    queryKey,
    async () => {
      // TODO: clean this up once not on testnet anymore
      const oldL2RelayEvents =
        prizePool.chainId === NETWORK['optimism-goerli']
          ? await publicClient.getLogs({
              address: '0xc5165406dB791549f0D2423D1483c1EA10A3A206',
              event: {
                inputs: [
                  { indexed: true, internalType: 'uint256', name: 'fromChainId', type: 'uint256' },
                  { indexed: true, internalType: 'bytes32', name: 'messageId', type: 'bytes32' }
                ],
                name: 'MessageIdExecuted',
                type: 'event'
              },
              fromBlock: 15600000n,
              toBlock: 15779000n,
              strict: true
            })
          : []

      const l2RelayEvents = await publicClient.getLogs({
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

      return oldL2RelayEvents.concat(l2RelayEvents)
    },
    {
      enabled: !!prizePool && !!publicClient && !!MSG_EXECUTOR_ADDRESSES[prizePool.chainId],
      ...NO_REFETCH
    }
  )
}
