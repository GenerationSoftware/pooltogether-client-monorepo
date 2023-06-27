import {
  CoingeckoTokenPrices,
  getAssetsFromShares,
  getTokenPriceFromObject,
  PrizePool,
  TokenWithAmount,
  Vault
} from '@pooltogether/hyperstructure-client-js'
import { useMemo, useState } from 'react'
import { formatUnits } from 'viem'
import { useAccount } from 'wagmi'
import {
  useAllTokenPrices,
  useAllUserVaultBalances,
  useAllVaultBalances,
  useAllVaultExchangeRates,
  useAllVaultPrizePowers,
  useSelectedVaults
} from '..'

export type SortId = 'prizePower' | 'totalBalance' | 'userBalance'
export type SortDirection = 'asc' | 'desc'

/**
 * Returns a sorted array of vaults
 *
 * NOTE: In order to sort by prize power, provide a prize pool in `options`.
 * @param vaults an unsorted array of vaults
 * @param options optional settings
 * @returns
 */
export const useSortedVaults = (
  vaults: Vault[],
  options?: { prizePool?: PrizePool; defaultSortId?: SortId; defaultSortDirection?: SortDirection }
) => {
  const [sortVaultsBy, setSortVaultsBy] = useState<SortId>(options?.defaultSortId ?? 'prizePower')
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    options?.defaultSortDirection ?? 'desc'
  )

  const { address: userAddress } = useAccount()

  const { vaults: selectedVaults, isFetched: isFetchedSelectedVaults } = useSelectedVaults()

  const { data: allVaultBalances, isFetched: isFetchedAllVaultBalances } =
    useAllVaultBalances(selectedVaults)

  const { data: allUserVaultBalances, isFetched: isFetchedAllUserVaultBalances } =
    useAllUserVaultBalances(selectedVaults, userAddress as `0x${string}`)

  const { data: allPrizePowers, isFetched: isFetchedAllPrizePowers } = useAllVaultPrizePowers(
    selectedVaults,
    options?.prizePool as PrizePool
  )

  const { data: allVaultExchangeRates, isFetched: isFetchedAllVaultExchangeRates } =
    useAllVaultExchangeRates(selectedVaults)

  const { data: allTokenPrices, isFetched: isFetchedAllTokenPrices } = useAllTokenPrices()

  const isFetched =
    isFetchedSelectedVaults &&
    isFetchedAllVaultBalances &&
    (isFetchedAllUserVaultBalances || !userAddress) &&
    (isFetchedAllPrizePowers || !options?.prizePool) &&
    isFetchedAllVaultExchangeRates &&
    isFetchedAllTokenPrices

  const sortedVaults = useMemo(() => {
    if (isFetched) {
      let sortedVaults = sortVaultsByPrizePower(vaults, allPrizePowers)
      if (sortVaultsBy === 'totalBalance' && !!allVaultBalances) {
        sortedVaults = sortVaultsByTotalDeposits(sortedVaults, allVaultBalances, allTokenPrices)
      } else if (
        sortVaultsBy === 'userBalance' &&
        !!allVaultBalances &&
        !!allUserVaultBalances &&
        !!allVaultExchangeRates
      ) {
        sortedVaults = sortVaultsByUserBalances(
          sortedVaults,
          allVaultBalances,
          allTokenPrices,
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
  }, [vaults, sortVaultsBy, sortDirection, isFetched])

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
    return vaults.sort((a, b) => (prizePowers[b.id] ?? 0) - (prizePowers[a.id] ?? 0))
  } else {
    return vaults
  }
}

const sortVaultsByTotalDeposits = (
  vaults: Vault[],
  vaultBalances: { [vaultId: string]: TokenWithAmount },
  tokenPrices: { [chainId: number]: CoingeckoTokenPrices }
) => {
  return vaults.sort((a, b) => {
    const aAmount = parseFloat(
      formatUnits(vaultBalances[a.id]?.amount ?? 0n, vaultBalances[a.id]?.decimals)
    )
    const bAmount = parseFloat(
      formatUnits(vaultBalances[b.id]?.amount ?? 0n, vaultBalances[b.id]?.decimals)
    )

    const aPrice = getTokenPriceFromObject(a.chainId, vaultBalances[a.id]?.address, tokenPrices)
    const bPrice = getTokenPriceFromObject(b.chainId, vaultBalances[b.id]?.address, tokenPrices)

    const aValue = aAmount * aPrice
    const bValue = bAmount * bPrice

    return bValue - aValue
  })
}

const sortVaultsByUserBalances = (
  vaults: Vault[],
  vaultBalances: { [vaultId: string]: TokenWithAmount },
  tokenPrices: { [chainId: number]: CoingeckoTokenPrices },
  userBalances: { [vaultId: string]: TokenWithAmount },
  exchangeRates: { [vaultId: string]: bigint }
) => {
  return vaults.sort((a, b) => {
    const aAmount = parseFloat(
      formatUnits(
        getAssetsFromShares(
          userBalances[a.id]?.amount ?? 0n,
          exchangeRates[a.id] ?? 0n,
          userBalances[a.id]?.decimals
        ),
        userBalances[a.id]?.decimals
      )
    )
    const bAmount = parseFloat(
      formatUnits(
        getAssetsFromShares(
          userBalances[b.id]?.amount ?? 0n,
          exchangeRates[b.id] ?? 0n,
          userBalances[b.id]?.decimals
        ),
        userBalances[b.id]?.decimals
      )
    )

    const aPrice = getTokenPriceFromObject(a.chainId, vaultBalances[a.id]?.address, tokenPrices)
    const bPrice = getTokenPriceFromObject(b.chainId, vaultBalances[b.id]?.address, tokenPrices)

    const aValue = aAmount * aPrice
    const bValue = bAmount * bPrice

    return bValue - aValue
  })
}
