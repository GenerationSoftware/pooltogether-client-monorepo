import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { ROCKETPOOL_ADDRESSES } from '@constants/config'

/**
 * Returns `rate`, the amount of wrETH that is equal to 1 rETH
 * @param chainId network to check
 * @param options optional settings
 * @returns
 */
export const useWRETHExchangeRate = (
  chainId: number,
  options?: { useOracle?: boolean; refetchInterval?: number }
) => {
  const publicClient = usePublicClient({ chainId })

  const rocketPoolAddresses = ROCKETPOOL_ADDRESSES[chainId]

  return useQuery({
    queryKey: ['wrETHExchangeRate', chainId, options?.useOracle ?? false],
    queryFn: async () => {
      if (!!publicClient) {
        const exchangeRate = await publicClient.readContract({
          address: options?.useOracle ? rocketPoolAddresses.oracle : rocketPoolAddresses.WRETH,
          abi: [
            {
              inputs: [],
              name: 'rate',
              outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
              stateMutability: 'view',
              type: 'function'
            }
          ],
          functionName: 'rate'
        })

        return exchangeRate
      }
    },
    enabled: !!chainId && !!publicClient && !!rocketPoolAddresses,
    ...NO_REFETCH,
    refetchInterval: options?.refetchInterval ?? false
  })
}
