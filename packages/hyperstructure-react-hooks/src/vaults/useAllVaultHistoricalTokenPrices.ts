import { Vaults } from '@generationsoftware/hyperstructure-client-js'
import { useAllVaultTokenAddresses, useHistoricalTokenPrices } from '..'

// TODO: should support multiple chains at once
/**
 * Returns historical token prices for all vaults' underlying tokens
 * @param chainId network to query for
 * @param vaults instance of the `Vaults` class
 * @returns
 */
export const useAllVaultHistoricalTokenPrices = (chainId: number, vaults: Vaults) => {
  const { data: allTokenAddresses, isFetched: isFetchedAllTokenAddresses } =
    useAllVaultTokenAddresses(vaults)

  const {
    data: historicalTokenPrices,
    isFetched: isFetchedHistoricalTokenPrices,
    refetch: refetchHistoricalTokenPrices
  } = useHistoricalTokenPrices(chainId, allTokenAddresses?.byChain[chainId] ?? [])

  const isFetched = isFetchedAllTokenAddresses && isFetchedHistoricalTokenPrices

  return { data: historicalTokenPrices, isFetched, refetch: refetchHistoricalTokenPrices }
}
