import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import { TokenWithAmount, TokenWithPrice, TokenWithSupply } from '@shared/types'
import { TWAB_REWARDS_ADDRESSES } from '@shared/utilities'
import { useMemo, useState } from 'react'
import { Address, formatUnits } from 'viem'
import { useAccount } from 'wagmi'
import {
  useAllUserVaultBalances,
  useAllVaultPrizeYields,
  useAllVaultPromotionsApr,
  useAllVaultSharePrices,
  useVaults
} from '..'

export type SortId = 'prizeYield' | 'twabRewards' | 'totalBalance' | 'userBalance'
export type SortDirection = 'asc' | 'desc'

/**
 * Returns a sorted array of vaults
 *
 * NOTE: In order to sort by prize yield, provide a prize pool in `options`.
 *
 * NOTE: In order to sort by twab rewards APR, provide a prize pool and twab reward settings in `options`.
 * @param vaultsArray an unsorted array of vaults
 * @param options optional settings
 * @returns
 */
export const useSortedVaults = (
  vaultsArray: Vault[],
  options?: {
    prizePool?: PrizePool
    twabRewards?: { rewardTokenAddresses: Address[]; numDraws?: number; fromBlock?: bigint }
    defaultSortId?: SortId
    defaultSortDirection?: SortDirection
  }
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

  const { data: allPrizeYields, isFetched: isFetchedAllPrizeYields } = useAllVaultPrizeYields(
    vaults,
    options?.prizePool as PrizePool
  )

  const { data: allVaultPromotionsApr, isFetched: isFetchedAllVaultPromotionsApr } =
    useAllVaultPromotionsApr(
      vaults,
      options?.prizePool as PrizePool,
      options?.twabRewards?.rewardTokenAddresses ?? [],
      { numDraws: options?.twabRewards?.numDraws, fromBlock: options?.twabRewards?.fromBlock }
    )

  const isFetched =
    !!vaults &&
    isFetchedAllVaultShareTokens &&
    (isFetchedAllUserVaultBalances || !userAddress) &&
    (isFetchedAllPrizeYields || !options?.prizePool) &&
    (isFetchedAllVaultPromotionsApr ||
      !options?.prizePool ||
      !options?.twabRewards ||
      (!!options?.prizePool && !TWAB_REWARDS_ADDRESSES[options.prizePool.chainId]))

  const sortedVaults = useMemo(() => {
    if (isFetched && !!allVaultShareTokens) {
      let sortedVaults = sortVaultsByTotalDeposits(vaultsArray, allVaultShareTokens)
      if (sortVaultsBy === 'prizeYield') {
        sortedVaults = sortVaultsByPrizeYield(sortedVaults, allPrizeYields)
      } else if (sortVaultsBy === 'twabRewards') {
        sortedVaults = sortVaultsByTwabRewards(sortedVaults, allVaultPromotionsApr)
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

const sortVaultsByPrizeYield = (vaults: Vault[], prizeYields?: { [vaultId: string]: number }) => {
  if (!!prizeYields) {
    const prizeYield = (v: Vault) => prizeYields[v.id] ?? 0
    return [...vaults].sort((a, b) => prizeYield(b) - prizeYield(a))
  } else {
    return vaults
  }
}

const sortVaultsByTwabRewards = (vaults: Vault[], twabRewards?: { [vaultId: string]: number }) => {
  if (!!twabRewards) {
    const rewards = (v: Vault) => twabRewards[v.id] ?? 0
    return [...vaults].sort((a, b) => rewards(b) - rewards(a))
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
