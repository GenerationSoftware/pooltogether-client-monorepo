import { NO_REFETCH } from '@shared/generic-react-hooks'
import { getSimpleMulticallResults, getTokenInfo } from '@shared/utilities'
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
    queryKey: ['lpTokenData', lpToken?.chainId, lpToken?.address],
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
            { functionName: 'totalSupply' },
            { functionName: 'token0' },
            { functionName: 'token1' },
            { functionName: 'reserve0' },
            { functionName: 'reserve1' }
          ]
        )

        const token0Address: Address = multicallResults[4]
        const token1Address: Address = multicallResults[5]

        const underlyingTokenInfo = await getTokenInfo(publicClient, [token0Address, token1Address])

        const token0Amount: bigint = multicallResults[6]
        const token1Amount: bigint = multicallResults[7]

        const token0 = { ...underlyingTokenInfo[token0Address], amount: token0Amount }
        const token1 = { ...underlyingTokenInfo[token1Address], amount: token1Amount }

        const decimals: number = multicallResults[0]
        const name: string = multicallResults[1]
        const symbol: string = multicallResults[2]
        const totalSupply: bigint = multicallResults[3]

        return { decimals, name, symbol, totalSupply, ...lpToken, token0, token1 }
      }
    },
    enabled:
      !!lpToken?.chainId && !!lpToken.address && !!publicClient && options?.enabled !== false,
    ...NO_REFETCH
  })
}
