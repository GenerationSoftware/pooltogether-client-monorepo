import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useAllUserVaultBalances,
  useAllUserVaultDelegationBalances,
  useAllVaultSharePrices,
  useVaults
} from '@generationsoftware/hyperstructure-react-hooks'
import { TokenWithAmount, TokenWithPrice, TokenWithSupply } from '@shared/types'
import { useMemo } from 'react'
import { Address, formatUnits } from 'viem'

/**
 * Returns a sorted array of vaults by delegated amount
 * @param vaultsArray an unsorted array of vaults
 * @param userAddress user address to get delegations for
 * @returns
 */
export const useSortedVaultsByDelegatedAmount = (vaultsArray: Vault[], userAddress: Address) => {
  const vaults = useVaults(vaultsArray)

  const { data: shareBalances, isFetched: isFetchedShareBalances } = useAllUserVaultBalances(
    vaults,
    userAddress
  )

  const { data: delegationBalances, isFetched: isFetchedDelegationBalances } =
    useAllUserVaultDelegationBalances(vaults, userAddress)

  const { data: allVaultSharePrices, isFetched: isFetchedAllVaultSharePrices } =
    useAllVaultSharePrices(vaults)

  const isFetched =
    !!vaults &&
    isFetchedShareBalances &&
    isFetchedDelegationBalances &&
    isFetchedAllVaultSharePrices &&
    shareBalances &&
    !!delegationBalances &&
    !!allVaultSharePrices

  const data = useMemo(() => {
    if (isFetched) {
      return sortVaultsByDelegatedAmount(
        vaultsArray,
        shareBalances,
        delegationBalances,
        allVaultSharePrices
      )
    } else {
      return []
    }
  }, [vaultsArray, isFetched])

  return {
    data,
    isFetched
  }
}

const sortVaultsByDelegatedAmount = (
  vaults: Vault[],
  shareBalances: { [vaultId: string]: TokenWithAmount },
  delegationBalances: { [vaultId: string]: bigint },
  sharePrices: { [vaultId: string]: TokenWithSupply & TokenWithPrice }
) => {
  return vaults.sort((a, b) => {
    const price = (v: Vault) => sharePrices[v.id]?.price ?? 0
    const delegationBalance = (v: Vault) =>
      (delegationBalances[v.id] ?? 0n) - (shareBalances[v.id]?.amount ?? 0n)
    const decimals = (v: Vault) => shareBalances[v.id]?.decimals ?? 18

    const amount = (v: Vault) => parseFloat(formatUnits(delegationBalance(v), decimals(v)))
    const value = (v: Vault) => amount(v) * price(v)

    return value(b) - value(a)
  })
}
