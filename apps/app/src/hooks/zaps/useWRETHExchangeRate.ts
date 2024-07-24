import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery } from '@tanstack/react-query'
import { parseUnits } from 'viem'
import { usePublicClient } from 'wagmi'
import { ROCKETPOOL_ADDRESSES } from '@constants/config'

/**
 * Returns `wrethForTokens`, the amount of wrETH that is equal to 1 rETH
 * @param chainId network to check
 * @returns
 */
export const useWRETHExchangeRate = (chainId: number) => {
  const publicClient = usePublicClient({ chainId })

  const wrETHTokenAddress = ROCKETPOOL_ADDRESSES[chainId]?.WRETH

  return useQuery({
    queryKey: ['wrETHExchangeRate', chainId],
    queryFn: async () => {
      if (!!publicClient) {
        const exchangeRate = await publicClient.readContract({
          address: wrETHTokenAddress,
          abi: [
            {
              inputs: [{ internalType: 'uint256', name: '_tokens', type: 'uint256' }],
              name: 'wrethForTokens',
              outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
              stateMutability: 'view',
              type: 'function'
            }
          ],
          functionName: 'wrethForTokens',
          args: [parseUnits('1', 18)]
        })

        return exchangeRate
      }
    },
    enabled: !!chainId && !!publicClient && !!wrETHTokenAddress,
    ...NO_REFETCH
  })
}
