import { NO_REFETCH } from '@shared/generic-react-hooks'
import { getSimpleMulticallResults } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'
import { curveLpTokenABI } from '@constants/curveLpTokenABI'

// TODO: enable this to be more general once `useLpToken` supports curve lps with 3+ tokens
/**
 * Returns `true` or `false` depending on whether a token is a recognized curve-like LP token
 * @param token token to check
 * @returns
 */
export const useIsCurveLp = (token: { chainId: number; address: Address }) => {
  const publicClient = usePublicClient({ chainId: token?.chainId })

  return useQuery({
    queryKey: ['isCurveLp', token?.chainId, token?.address],
    queryFn: async () => {
      if (!!publicClient) {
        try {
          const results = await getSimpleMulticallResults(
            publicClient,
            token.address,
            curveLpTokenABI,
            [
              { functionName: 'coins', args: [0n] },
              { functionName: 'coins', args: [1n] },
              { functionName: 'coins', args: [2n] }
            ]
          )

          return !!results[0] && !!results[1] && !results[2]
        } catch {
          return false
        }
      }
    },
    enabled: !!token?.chainId && !!token.address && !!publicClient,
    ...NO_REFETCH
  })
}
