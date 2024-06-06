import { NO_REFETCH } from '@shared/generic-react-hooks'
import { getSimpleMulticallResults } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'
import { lpTokenABI } from '@constants/lpTokenABI'

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
    queryKey: ['lpToken', lpToken?.chainId, lpToken?.address],
    queryFn: async () => {
      if (!!publicClient) {
        const multicallResults = await getSimpleMulticallResults(
          publicClient,
          lpToken.address,
          lpTokenABI,
          [
            { functionName: 'decimals' },
            { functionName: 'name' },
            { functionName: 'symbol' },
            { functionName: 'token0' },
            { functionName: 'token1' },
            { functionName: 'reserve0' },
            { functionName: 'reserve1' }
          ]
        )

        const decimals: number = multicallResults[0]
        const name: string = multicallResults[1]
        const symbol: string = multicallResults[2]

        const token0: { chainId: number; address: Address; amount: bigint } = {
          chainId: lpToken.chainId,
          address: multicallResults[3],
          amount: multicallResults[5]
        }

        const token1: { chainId: number; address: Address; amount: bigint } = {
          chainId: lpToken.chainId,
          address: multicallResults[4],
          amount: multicallResults[6]
        }

        return { decimals, name, symbol, ...lpToken, token0, token1 }
      }
    },
    enabled:
      !!lpToken?.chainId && !!lpToken.address && !!publicClient && options?.enabled !== false,
    ...NO_REFETCH
  })
}
