import { getAssetsFromShares } from '@pooltogether/hyperstructure-client-js'
import { useMemo } from 'react'
import { Address, formatUnits } from 'viem'
import { useAccount } from 'wagmi'
import {
  useAllUserVaultBalances,
  useAllVaultExchangeRates,
  useAllVaultTokenPrices,
  useSelectedVaults
} from '..'

/**
 * Returns a user's total balance in ETH
 * @returns
 */
export const useUserTotalBalance = () => {
  const { address: userAddress } = useAccount()

  const { vaults, isFetched: isFetchedVaultData } = useSelectedVaults()

  const { data: allVaultTokenPrices, isFetched: isFetchedAllVaultTokenPrices } =
    useAllVaultTokenPrices()

  const { data: vaultBalances, isFetched: isFetchedVaultBalances } = useAllUserVaultBalances(
    vaults,
    userAddress as Address
  )

  const { data: vaultExchangeRates, isFetched: isFetchedVaultExchangeRates } =
    useAllVaultExchangeRates(vaults)

  const isFetched =
    isFetchedVaultData &&
    isFetchedAllVaultTokenPrices &&
    isFetchedVaultBalances &&
    isFetchedVaultExchangeRates &&
    !!allVaultTokenPrices &&
    !!vaultBalances &&
    !!vaultExchangeRates &&
    !!vaults.underlyingTokenAddresses

  const data = useMemo(() => {
    if (isFetched) {
      let totalBalance: number = 0
      for (const vaultId in vaultBalances) {
        const decimals = vaultBalances[vaultId].decimals
        if (!isNaN(decimals)) {
          const exchangeRate = vaultExchangeRates[vaultId]
          if (!!exchangeRate) {
            const chainId = vaultBalances[vaultId].chainId
            const tokenAddress = vaults.underlyingTokenAddresses?.byVault[vaultId] as Address
            const shareBalance = vaultBalances[vaultId].amount

            const tokenPrice = allVaultTokenPrices[chainId]?.[tokenAddress] ?? 0
            const tokenBalance = getAssetsFromShares(shareBalance, exchangeRate, decimals)

            const formattedTokenBalance = formatUnits(tokenBalance, decimals)
            totalBalance += Number(formattedTokenBalance) * tokenPrice
          }
        }
      }
      return totalBalance
    } else {
      return undefined
    }
  }, [
    isFetchedVaultData,
    isFetchedAllVaultTokenPrices,
    allVaultTokenPrices,
    isFetchedVaultBalances,
    vaultBalances,
    isFetchedVaultExchangeRates,
    vaultExchangeRates,
    vaults
  ])

  return { data, isFetched }
}
