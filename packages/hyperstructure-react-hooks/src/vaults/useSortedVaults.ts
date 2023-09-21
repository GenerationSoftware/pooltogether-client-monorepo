import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import { TokenWithAmount, TokenWithPrice, TokenWithSupply } from '@shared/types'
import { useMemo, useState } from 'react'
import { Address, formatUnits } from 'viem'
import { useAccount } from 'wagmi'
import {
  useAllUserVaultBalances,
  useAllVaultPrizePowers,
  useAllVaultSharePrices,
  useVaults
} from '..'

export type SortId = 'prizePower' | 'totalBalance' | 'userBalance'
export type SortDirection = 'asc' | 'desc'

/**
 * Returns a sorted array of vaults
 *
 * NOTE: In order to sort by prize power, provide a prize pool in `options`.
 * @param vaultsArray an unsorted array of vaults
 * @param options optional settings
 * @returns
 */
export const useSortedVaults = (
  vaultsArray: Vault[],
  options?: { prizePool?: PrizePool; defaultSortId?: SortId; defaultSortDirection?: SortDirection }
) => {
  const [sortVaultsBy, setSortVaultsBy] = useState<SortId>(options?.defaultSortId ?? 'totalBalance')
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    options?.defaultSortDirection ?? 'desc'
  )

  const vaults = useVaults(vaultsArray)

  const { address: userAddress } = useAccount()

  const { data: allVaultShareTokens, isFetched: isFetchedAllVaultShareTokens } =
    useAllVaultSharePrices(vaults)

  const { data: allUserVaultBalances, isFetched: isFetchedAllUserVaultBalances } =
    useAllUserVaultBalances(vaults, userAddress as Address)

  const { data: allPrizePowers, isFetched: isFetchedAllPrizePowers } = useAllVaultPrizePowers(
    vaults,
    options?.prizePool as PrizePool
  )

  const isFetched =
    !!vaults &&
    isFetchedAllVaultShareTokens &&
    (isFetchedAllUserVaultBalances || !userAddress) &&
    (isFetchedAllPrizePowers || !options?.prizePool)

  const sortedVaults = useMemo(() => {
    if (isFetched && !!allVaultShareTokens) {
      let sortedVaults = sortVaultsByTotalDeposits(vaultsArray, allVaultShareTokens)
      if (sortVaultsBy === 'prizePower') {
        sortedVaults = sortVaultsByPrizePower(sortedVaults, allPrizePowers)
      } else if (sortVaultsBy === 'userBalance' && !!allUserVaultBalances && allVaultShareTokens) {
        sortedVaults = sortVaultsByUserBalances(
          sortedVaults,
          allVaultShareTokens,
          allUserVaultBalances
        )
      }

      if (sortDirection === 'asc') {
        sortedVaults.reverse()
      }

      return sortedVaults
    } else {
      return []
    }
  }, [vaultsArray, sortVaultsBy, sortDirection, userAddress, isFetched])

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
  }

  return {
    sortedVaults,
    sortVaultsBy,
    setSortVaultsBy,
    sortDirection,
    setSortDirection,
    toggleSortDirection,
    isFetched
  }
}

const sortVaultsByPrizePower = (vaults: Vault[], prizePowers?: { [vaultId: string]: number }) => {
  if (!!prizePowers) {
    const prizePower = (v: Vault) => prizePowers[v.id] ?? 0
    return [...vaults].sort((a, b) => prizePower(b) - prizePower(a))
  } else {
    return vaults
  }
}

const sortVaultsByTotalDeposits = (
  vaults: Vault[],
  shareTokens: { [vaultId: string]: TokenWithSupply & TokenWithPrice }
) => {
  return [...vaults].sort((a, b) => {
    const price = (v: Vault) => shareTokens[v.id]?.price ?? 0
    const balance = (v: Vault) => shareTokens[v.id]?.totalSupply ?? 0n
    const decimals = (v: Vault) => shareTokens[v.id]?.decimals ?? 0

    const amount = (v: Vault) => parseFloat(formatUnits(balance(v), decimals(v)))
    const value = (v: Vault) => amount(v) * price(v)

    return value(b) - value(a)
  })
}

const sortVaultsByUserBalances = (
  vaults: Vault[],
  shareTokens: { [vaultId: string]: TokenWithSupply & TokenWithPrice },
  userBalances: { [vaultId: string]: TokenWithAmount }
) => {
  return [...vaults].sort((a, b) => {
    const price = (v: Vault) => shareTokens[v.id]?.price ?? 0
    const shareBalance = (v: Vault) => userBalances[v.id]?.amount ?? 0n
    const decimals = (v: Vault) => shareTokens[v.id]?.decimals ?? 0

    const amount = (v: Vault) => parseFloat(formatUnits(shareBalance(v), decimals(v)))
    const value = (v: Vault) => amount(v) * price(v)

    return value(b) - value(a)
  })
}
