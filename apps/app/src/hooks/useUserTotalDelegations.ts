import {
  useAllUserVaultBalances,
  useAllUserVaultDelegationBalances,
  useAllVaultExchangeRates,
  useAllVaultTokenPrices,
  useSelectedVaults
} from '@generationsoftware/hyperstructure-react-hooks'
import { getAssetsFromShares } from '@shared/utilities'
import { useMemo } from 'react'
import { Address, formatUnits } from 'viem'

/**
 * Returns a user's total received delegations in ETH
 * @param userAddress user address to get total delegations for
 * @returns
 */
export const useUserTotalDelegations = (userAddress: Address) => {
  const { vaults, isFetched: isFetchedVaultData } = useSelectedVaults()

  const { data: allVaultTokenPrices, isFetched: isFetchedAllVaultTokenPrices } =
    useAllVaultTokenPrices()

  const { data: shareBalances, isFetched: isFetchedShareBalances } = useAllUserVaultBalances(
    vaults,
    userAddress
  )

  const { data: delegationBalances, isFetched: isFetchedDelegationBalances } =
    useAllUserVaultDelegationBalances(vaults, userAddress)

  const { data: vaultExchangeRates, isFetched: isFetchedVaultExchangeRates } =
    useAllVaultExchangeRates(vaults)

  const isFetched =
    isFetchedVaultData &&
    isFetchedAllVaultTokenPrices &&
    isFetchedShareBalances &&
    isFetchedDelegationBalances &&
    isFetchedVaultExchangeRates &&
    !!allVaultTokenPrices &&
    !!shareBalances &&
    !!delegationBalances &&
    !!vaultExchangeRates &&
    !!vaults.underlyingTokenAddresses

  const data = useMemo(() => {
    if (isFetched) {
      let totalDelegations: number = 0

      for (const vaultId in shareBalances) {
        const shareToken = shareBalances[vaultId]
        const chainId = shareToken.chainId
        const decimals = shareToken.decimals
        const exchangeRate = vaultExchangeRates[vaultId]

        if (decimals !== undefined && !!exchangeRate) {
          const tokenAddress = vaults.underlyingTokenAddresses?.byVault[vaultId] as Address
          const delegationBalance = delegationBalances[vaultId] - shareToken.amount

          if (delegationBalance > 0n) {
            const tokenPrice =
              allVaultTokenPrices[chainId]?.[tokenAddress.toLowerCase() as Address] ?? 0
            const tokenBalance = getAssetsFromShares(delegationBalance, exchangeRate, decimals)

            const formattedTokenBalance = formatUnits(tokenBalance, decimals)
            totalDelegations += Number(formattedTokenBalance) * tokenPrice
          }
        }
      }

      return totalDelegations
    } else {
      return undefined
    }
  }, [
    isFetchedVaultData,
    isFetchedAllVaultTokenPrices,
    allVaultTokenPrices,
    isFetchedShareBalances,
    shareBalances,
    isFetchedDelegationBalances,
    delegationBalances,
    isFetchedVaultExchangeRates,
    vaultExchangeRates,
    vaults
  ])

  return { data, isFetched }
}
