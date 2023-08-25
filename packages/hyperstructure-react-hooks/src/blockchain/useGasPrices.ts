import { PoolTogetherApiGasPrices } from '@shared/types'
import { getGasPrices, NETWORK } from '@shared/utilities'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants'

/**
 * Returns gas prices for a given chain ID
 * @param chainId chain ID to get gas prices for
 * @param refetchInterval optional refetch interval in ms
 * @returns
 */
export const useGasPrices = (
  chainId: number,
  refetchInterval?: number
): UseQueryResult<PoolTogetherApiGasPrices, unknown> => {
  const enabled = !!chainId

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

  return useQuery([QUERY_KEYS.gasPrices, _chainId], async () => await getGasPrices(_chainId), {
    refetchInterval: refetchInterval ?? false,
    enabled
  })
}
