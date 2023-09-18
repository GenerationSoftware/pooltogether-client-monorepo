import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { LIQUIDATION_ROUTER_ADDRESSES } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { QUERY_START_BLOCK } from '@constants/config'

export const useLiquidationEvents = (prizePool: PrizePool) => {
  const publicClient = usePublicClient({ chainId: prizePool?.chainId })

  const queryKey = ['liquidationEvents', prizePool?.chainId]

  return useQuery(
    queryKey,
    async () => {
      return await publicClient.getLogs({
        address: LIQUIDATION_ROUTER_ADDRESSES[prizePool.chainId],
        event: {
          inputs: [
            {
              indexed: true,
              internalType: 'contract LiquidationPair',
              name: 'liquidationPair',
              type: 'address'
            },
            { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
            { indexed: true, internalType: 'address', name: 'receiver', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'amountOut', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'amountInMax', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'amountIn', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'deadline', type: 'uint256' }
          ],
          name: 'SwappedExactAmountOut',
          type: 'event'
        },
        fromBlock: QUERY_START_BLOCK[prizePool.chainId],
        toBlock: 'latest',
        strict: true
      })
    },
    {
      enabled: !!prizePool && !!publicClient && !!LIQUIDATION_ROUTER_ADDRESSES[prizePool.chainId],
      ...NO_REFETCH
    }
  )
}
