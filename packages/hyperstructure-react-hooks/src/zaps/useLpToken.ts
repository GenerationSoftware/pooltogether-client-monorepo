import { NO_REFETCH } from '@shared/generic-react-hooks'
import {
  curveLpTokenABI,
  getSimpleMulticallResults,
  getTokenInfo,
  lpTokenABI
} from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { Address, parseUnits } from 'viem'
import { usePublicClient } from 'wagmi'

// TODO: support curve lps with 3+ tokens
/**
 * Returns basic lp token data
 * @param lpToken the lp token to query data for
 * @param options optional settings
 * @returns
 */
export const useLpToken = (
  lpToken: { chainId: number; address: Address },
  options?: { enabled?: boolean }
) => {
  const publicClient = usePublicClient({ chainId: lpToken?.chainId })

  return useQuery({
    queryKey: ['lpTokenData', lpToken?.chainId, lpToken?.address],
    queryFn: async () => {
      if (!!publicClient) {
        const multicallResults = await getSimpleMulticallResults(
          publicClient,
          lpToken.address,
          [...lpTokenABI, ...curveLpTokenABI],
          [
            { functionName: 'decimals' },
            { functionName: 'name' },
            { functionName: 'symbol' },
            { functionName: 'totalSupply' },
            { functionName: 'token0' },
            { functionName: 'token1' },
            { functionName: 'reserve0' },
            { functionName: 'reserve1' },
            { functionName: 'coins', args: [0n] },
            { functionName: 'coins', args: [1n] },
            { functionName: 'balances', args: [0n] },
            { functionName: 'balances', args: [1n] }
          ]
        )

        const token0Address: Address = multicallResults[4] ?? multicallResults[8]
        const token1Address: Address = multicallResults[5] ?? multicallResults[9]

        const underlyingTokenInfo = await getTokenInfo(publicClient, [token0Address, token1Address])

        const token0Amount: bigint = multicallResults[6] ?? multicallResults[10]
        const token1Amount: bigint = multicallResults[7] ?? multicallResults[11]

        const token0 = { ...underlyingTokenInfo[token0Address], amount: token0Amount }
        const token1 = { ...underlyingTokenInfo[token1Address], amount: token1Amount }

        const decimals: number = multicallResults[0]
        const name: string = multicallResults[1]
        const symbol: string = multicallResults[2]
        const totalSupply: bigint = multicallResults[3]

        let bestCurveInputTokenAddress: Address | undefined

        if (
          !!multicallResults[8] &&
          !!multicallResults[9] &&
          token0.decimals !== undefined &&
          token1.decimals !== undefined
        ) {
          const curveMulticallResults = await getSimpleMulticallResults(
            publicClient,
            lpToken.address,
            curveLpTokenABI,
            [
              {
                functionName: 'calc_token_amount',
                args: [[parseUnits('1', token0.decimals), 0n], true]
              },
              {
                functionName: 'calc_token_amount',
                args: [[0n, parseUnits('1', token0.decimals)], true]
              }
            ]
          )

          bestCurveInputTokenAddress =
            curveMulticallResults[0] > curveMulticallResults[1] ? token0.address : token1.address
        }

        return {
          decimals,
          name,
          symbol,
          totalSupply,
          ...lpToken,
          token0,
          token1,
          bestCurveInputTokenAddress
        }
      }
    },
    enabled:
      !!lpToken?.chainId && !!lpToken.address && !!publicClient && options?.enabled !== false,
    ...NO_REFETCH
  })
}
