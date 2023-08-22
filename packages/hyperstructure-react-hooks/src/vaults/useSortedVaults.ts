import {
  getAssetsFromShares,
  PrizePool,
  TokenWithAmount,
  Vault
} from '@pooltogether/hyperstructure-client-js'
import { useMemo, useState } from 'react'
import { Address, formatUnits } from 'viem'
import { useAccount } from 'wagmi'
import {
  useAllUserVaultBalances,
  useAllVaultBalances,
  useAllVaultExchangeRates,
  useAllVaultPrizePowers,
  useAllVaultTokenPrices,
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
  const [sortVaultsBy, setSortVaultsBy] = useState<SortId>(options?.defaultSortId ?? 'prizePower')
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    options?.defaultSortDirection ?? 'desc'
  )

  const vaults = useVaults(vaultsArray)

  const { address: userAddress } = useAccount()

  const { data: allVaultBalances, isFetched: isFetchedAllVaultBalances } =
    useAllVaultBalances(vaults)

  const { data: allUserVaultBalances, isFetched: isFetchedAllUserVaultBalances } =
    useAllUserVaultBalances(vaults, userAddress as Address)

  const { data: allPrizePowers, isFetched: isFetchedAllPrizePowers } = useAllVaultPrizePowers(
    vaults,
    options?.prizePool as PrizePool
  )

  const { data: allVaultExchangeRates, isFetched: isFetchedAllVaultExchangeRates } =
    useAllVaultExchangeRates(vaults)

  const { data: allVaultTokenPrices, isFetched: isFetchedAllVaultTokenPrices } =
    useAllVaultTokenPrices()

  const isFetched =
    !!vaults &&
    isFetchedAllVaultBalances &&
    (isFetchedAllUserVaultBalances || !userAddress) &&
    (isFetchedAllPrizePowers || !options?.prizePool) &&
    isFetchedAllVaultExchangeRates &&
    isFetchedAllVaultTokenPrices

  const sortedVaults = useMemo(() => {
    if (isFetched) {
      let sortedVaults = sortVaultsByPrizePower(vaultsArray, allPrizePowers)
      if (sortVaultsBy === 'totalBalance' && !!allVaultBalances) {
        sortedVaults = sortVaultsByTotalDeposits(
          sortedVaults,
          allVaultBalances,
          allVaultTokenPrices
        )
      } else if (
        sortVaultsBy === 'userBalance' &&
        !!allUserVaultBalances &&
        !!allVaultExchangeRates
      ) {
        sortedVaults = sortVaultsByUserBalances(
          sortedVaults,
          allVaultTokenPrices,
          allUserVaultBalances,
          allVaultExchangeRates
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
    return vaults.sort((a, b) => prizePower(b) - prizePower(a))
  } else {
    return vaults
  }
}

const sortVaultsByTotalDeposits = (
  vaults: Vault[],
  vaultBalances: { [vaultId: string]: TokenWithAmount },
  tokenPrices: { [chainId: number]: { [address: Address]: number } }
) => {
  return vaults.sort((a, b) => {
    const price = (v: Vault) => tokenPrices[v.chainId]?.[v.address.toLowerCase() as Address] ?? 0
    const balance = (v: Vault) => vaultBalances[v.id]?.amount ?? 0n
    const decimals = (v: Vault) => vaultBalances[v.id]?.decimals ?? 0

    const amount = (v: Vault) => parseFloat(formatUnits(balance(v), decimals(v)))
    const value = (v: Vault) => amount(v) * price(v)

    return value(b) - value(a)
  })
}

const sortVaultsByUserBalances = (
  vaults: Vault[],
  tokenPrices: { [chainId: number]: { [address: Address]: number } },
  userBalances: { [vaultId: string]: TokenWithAmount },
  exchangeRates: { [vaultId: string]: bigint }
) => {
  return vaults.sort((a, b) => {
    const price = (v: Vault) => tokenPrices[v.chainId]?.[v.address.toLowerCase() as Address] ?? 0
    const shareBalance = (v: Vault) => userBalances[v.id]?.amount ?? 0n
    const decimals = (v: Vault) => userBalances[v.id]?.decimals ?? 0
    const exchangeRate = (v: Vault) => exchangeRates[v.id] ?? 0n

    const balance = (v: Vault) => getAssetsFromShares(shareBalance(v), exchangeRate(v), decimals(v))
    const amount = (v: Vault) => parseFloat(formatUnits(balance(v), decimals(v)))
    const value = (v: Vault) => amount(v) * price(v)

    return value(b) - value(a)
  })
}
