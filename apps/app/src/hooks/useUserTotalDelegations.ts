import {
  useAllUserVaultBalances,
  useAllUserVaultDelegationBalances,
  useAllVaultSharePrices,
  useSelectedVaults
} from '@generationsoftware/hyperstructure-react-hooks'
import { useMemo } from 'react'
import { Address, formatUnits } from 'viem'

/**
 * Returns a user's total received delegations in ETH
 * @param userAddress user address to get total delegations for
 * @returns
 */
export const useUserTotalDelegations = (userAddress: Address) => {
  const { vaults, isFetched: isFetchedVaultData } = useSelectedVaults()

  const { data: allVaultSharePrices, isFetched: isFetchedAllVaultSharePrices } =
    useAllVaultSharePrices(vaults)

  const { data: shareBalances, isFetched: isFetchedShareBalances } = useAllUserVaultBalances(
    vaults,
    userAddress
  )

  const { data: delegationBalances, isFetched: isFetchedDelegationBalances } =
    useAllUserVaultDelegationBalances(vaults, userAddress)

  const isFetched =
    isFetchedVaultData &&
    isFetchedAllVaultSharePrices &&
    isFetchedShareBalances &&
    isFetchedDelegationBalances &&
    !!allVaultSharePrices &&
    !!shareBalances &&
    !!delegationBalances &&
    !!vaults.underlyingTokenAddresses &&
    Object.values(allVaultSharePrices).some((token) => token.price !== undefined)

  const data = useMemo(() => {
    if (isFetched) {
      let totalDelegations: number = 0

      for (const vaultId in shareBalances) {
        const shareToken = shareBalances[vaultId]
        const decimals = shareToken.decimals

        if (decimals !== undefined) {
          const delegationBalance = delegationBalances[vaultId] - shareToken.amount

          if (delegationBalance > 0n) {
            const sharePrice = allVaultSharePrices[vaultId]?.price ?? 0

            const formattedBalance = formatUnits(delegationBalance, decimals)
            totalDelegations += Number(formattedBalance) * sharePrice
          }
        }
      }

      return totalDelegations
    } else {
      return undefined
    }
  }, [
    isFetchedVaultData,
    isFetchedAllVaultSharePrices,
    allVaultSharePrices,
    isFetchedShareBalances,
    shareBalances,
    isFetchedDelegationBalances,
    delegationBalances,
    vaults
  ])

  return { data, isFetched }
}
