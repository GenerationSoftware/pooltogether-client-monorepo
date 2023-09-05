import { NETWORK } from '@shared/utilities'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { QUERY_KEYS } from '../constants'

/**
 * Returns gas price for a given chain ID
 * @param chainId chain ID to get gas prices for
 * @param refetchInterval optional refetch interval in ms
 * @returns
 */
export const useGasPrice = (
  chainId: number,
  refetchInterval?: number
): UseQueryResult<bigint, unknown> => {
  const redirects: { [chainId: number]: number } = {
    [NETWORK.goerli]: NETWORK.mainnet,
    [NETWORK.sepolia]: NETWORK.mainnet,
    [NETWORK['bsc-testnet']]: NETWORK.bsc,
    [NETWORK.mumbai]: NETWORK.polygon,
    [NETWORK['optimism-goerli']]: NETWORK.optimism,
    [NETWORK.fuji]: NETWORK.avalanche,
    [NETWORK['celo-testnet']]: NETWORK.celo,
    [NETWORK['arbitrum-goerli']]: NETWORK.arbitrum
  }

  const _chainId = redirects[chainId] ?? chainId

  const publicClient = usePublicClient({ chainId: _chainId })

  return useQuery([QUERY_KEYS.gasPrices, _chainId], async () => await publicClient.getGasPrice(), {
    refetchInterval: refetchInterval ?? false,
    enabled: !!chainId && !!publicClient
  })
}
