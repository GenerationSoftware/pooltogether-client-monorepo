import { NO_REFETCH } from '@shared/generic-react-hooks'
import { lower } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'
import { VELODROME_ADDRESSES } from '@constants/config'

/**
 * Returns `true` or `false` depending on whether a token is a recognized velodrome-like LP token
 * @param token token to check
 * @returns
 */
export const useIsVelodromeLp = (token: { chainId: number; address: Address }) => {
  const publicClient = usePublicClient({ chainId: token?.chainId })

  return useQuery({
    queryKey: ['isVelodromeLp', token?.chainId, token?.address],
    queryFn: async () => {
      if (!!publicClient) {
        const lpFactoryAddresses = VELODROME_ADDRESSES[token.chainId]?.lpFactories || []

        if (!lpFactoryAddresses.length) return false

        try {
          const lpFactoryAddress = await publicClient.readContract({
            address: token.address,
            abi: [
              {
                inputs: [],
                name: 'factory',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function'
              }
            ],
            functionName: 'factory'
          })

          return lpFactoryAddresses.includes(lower(lpFactoryAddress))
        } catch {
          return false
        }
      }
    },
    enabled: !!token?.chainId && !!token.address && !!publicClient,
    ...NO_REFETCH
  })
}
