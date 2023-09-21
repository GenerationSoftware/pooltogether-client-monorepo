import { useMemo } from 'react'
import { Address, formatUnits } from 'viem'
import { useAllUserVaultBalances, useAllVaultSharePrices, useSelectedVaults } from '..'

/**
 * Returns a user's total balance in ETH
 * @param userAddress user address to get total balance for
 * @returns
 */
export const useUserTotalBalance = (userAddress: Address) => {
  const { vaults, isFetched: isFetchedVaultData } = useSelectedVaults()

  const { data: allVaultShareTokens, isFetched: isFetchedAllVaultShareTokens } =
    useAllVaultSharePrices(vaults)

  const { data: vaultBalances, isFetched: isFetchedVaultBalances } = useAllUserVaultBalances(
    vaults,
    userAddress
  )

  const isFetched =
    isFetchedVaultData &&
    isFetchedAllVaultShareTokens &&
    isFetchedVaultBalances &&
    !!allVaultShareTokens &&
    !!vaultBalances &&
    !!vaults.underlyingTokenAddresses

  const data = useMemo(() => {
    if (isFetched) {
      let totalBalance: number = 0
      for (const vaultId in vaultBalances) {
        const decimals = vaultBalances[vaultId].decimals
        if (!isNaN(decimals)) {
          const shareBalance = vaultBalances[vaultId].amount

          const sharePrice = allVaultShareTokens[vaultId]?.price ?? 0

          const formattedShareBalance = formatUnits(shareBalance, decimals)
          totalBalance += Number(formattedShareBalance) * sharePrice
        }
      }
      return totalBalance
    } else {
      return undefined
    }
  }, [
    isFetchedVaultData,
    isFetchedAllVaultShareTokens,
    allVaultShareTokens,
    isFetchedVaultBalances,
    vaultBalances,
    vaults
  ])

  return { data, isFetched }
}
