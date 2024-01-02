import { NETWORK } from '@shared/utilities'
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
  const redirects: { [chainId: number]: number } = {
    [NETWORK.sepolia]: NETWORK.mainnet,
    [NETWORK['bsc-testnet']]: NETWORK.bsc,
    [NETWORK.mumbai]: NETWORK.polygon,
    [NETWORK.fuji]: NETWORK.avalanche,
    [NETWORK['celo-testnet']]: NETWORK.celo
  }

  const _chainId = redirects[chainId] ?? chainId

  const publicClient = usePublicClient({ chainId: _chainId })

  return useQuery(
    [QUERY_KEYS.gasPrices, _chainId],
    async () => {
      const gasPrices = await publicClient.estimateFeesPerGas()

      if (!!gasPrices.maxFeePerGas) {
        return gasPrices.maxFeePerGas + gasPrices.maxPriorityFeePerGas
      } else if (!!gasPrices.gasPrice) {
        return gasPrices.gasPrice
      } else {
        return 0n
      }
    },
    {
      refetchInterval: refetchInterval ?? false,
      enabled: !!chainId && !!publicClient
    }
  )
}
