import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { QUERY_KEYS } from '../constants'

/**
 * Returns gas price for a given chain ID
 * @param chainId chain ID to get gas prices for
 * @param refetchInterval optional refetch interval in ms
 * @returns
 */
export const useGasPrice = (chainId: number, refetchInterval?: number) => {
  const publicClient = usePublicClient({ chainId })

  return useQuery({
    queryKey: [QUERY_KEYS.gasPrices, chainId],
    queryFn: async () => {
      if (!!publicClient) {
        const gasPrices = await publicClient.estimateFeesPerGas()

        if (!!gasPrices.maxFeePerGas) {
          return gasPrices.maxFeePerGas + gasPrices.maxPriorityFeePerGas
        } else if (!!gasPrices.gasPrice) {
          return gasPrices.gasPrice
        } else {
          return 0n
        }
      }
    },
    refetchInterval: refetchInterval ?? false,
    enabled: !!chainId && !!publicClient
  })
}
