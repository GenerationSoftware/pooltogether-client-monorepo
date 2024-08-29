import { NO_REFETCH } from '@shared/generic-react-hooks'
import { curveLpTokenABI } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'

/**
 * Returns the expected output in LP tokens of a curve `add_liquidity` call
 * @param chainId the chain ID the curve LP is on
 * @param lpTokenAddress the curve LP's address
 * @param amounts the amounts of each token to be deposited
 * @param options optional settings
 * @returns
 */
export const useCurveAddLiquidityOutput = (
  chainId: number,
  lpTokenAddress: Address,
  amounts: [bigint, bigint],
  options?: { enabled?: boolean }
) => {
  const publicClient = usePublicClient({ chainId })

  return useQuery({
    queryKey: ['curveLpOutput', chainId, lpTokenAddress, amounts?.map(String)],
    queryFn: async () =>
      await publicClient!.readContract({
        address: lpTokenAddress,
        abi: curveLpTokenABI,
        functionName: 'calc_token_amount',
        args: [amounts, true]
      }),
    enabled:
      !!chainId &&
      !!lpTokenAddress &&
      !!amounts?.length &&
      (!!amounts[0] || !!amounts[1]) &&
      !!publicClient &&
      options?.enabled !== false,
    ...NO_REFETCH
  })
}
