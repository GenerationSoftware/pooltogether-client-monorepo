import { Vaults } from '@generationsoftware/hyperstructure-client-js'
import { TokenWithSupply } from '@shared/types'
import { getAssetsFromShares } from '@shared/utilities'
import { useMemo } from 'react'
import { Address, formatEther, parseEther } from 'viem'
import {
  useAllVaultExchangeRates,
  useAllVaultHistoricalTokenPrices,
  useAllVaultShareData,
  useAllVaultTokenAddresses
} from '..'

// TODO: should support multiple chains at once
// TODO: this isn't entirely accurate since exchange rates might've been different in the past
/**
 * Returns historical share prices for all given vaults
 * @param chainId network to query for
 * @param vaults instance of the `Vaults` class
 * @returns
 */
export const useAllVaultHistoricalSharePrices = (chainId: number, vaults: Vaults) => {
  const {
    data: allShareData,
    isFetched: isFetchedAllShareData,
    refetch: refetchAllShareData
  } = useAllVaultShareData(vaults)

  const {
    data: allHistoricalTokenPrices,
    isFetched: isFetchedAllHistoricalTokenPrices,
    refetch: refetchAllHistoricalTokenPrices
  } = useAllVaultHistoricalTokenPrices(chainId, vaults)

  const {
    data: allExchangeRates,
    isFetched: isFetchedAllExchangeRates,
    refetch: refetchAllExchangeRates
  } = useAllVaultExchangeRates(vaults)

  const { data: allTokenAddresses, isFetched: isFetchedAllTokenAddresses } =
    useAllVaultTokenAddresses(vaults)

  const data = useMemo(() => {
    if (!!allShareData && !!allHistoricalTokenPrices && !!allExchangeRates && !!allTokenAddresses) {
      const sharePrices: {
        [vaultId: string]: TokenWithSupply & { priceHistory: { date: string; price: number }[] }
      } = {}

      Object.entries(allShareData).forEach(([vaultId, shareToken]) => {
        const tokenAddress = allTokenAddresses.byVault[vaultId]?.toLowerCase() as Address

        if (!!tokenAddress) {
          const tokenPrices = allHistoricalTokenPrices[tokenAddress]
          const exchangeRate = allExchangeRates[vaultId]

          const priceHistory =
            !!exchangeRate && !!tokenPrices
              ? tokenPrices.map((entry) => ({
                  date: entry.date,
                  price: parseFloat(
                    formatEther(
                      getAssetsFromShares(
                        parseEther(`${entry.price}`),
                        exchangeRate,
                        shareToken.decimals
                      )
                    )
                  )
                }))
              : []

          sharePrices[vaultId] = { ...shareToken, priceHistory }
        }
      })

      return sharePrices
    }
  }, [allShareData, allHistoricalTokenPrices, allExchangeRates, allTokenAddresses])

  const isFetched =
    isFetchedAllShareData &&
    isFetchedAllHistoricalTokenPrices &&
    isFetchedAllExchangeRates &&
    isFetchedAllTokenAddresses

  const refetch = () => {
    refetchAllShareData()
    refetchAllHistoricalTokenPrices()
    refetchAllExchangeRates()
  }

  return { data, isFetched, refetch }
}
