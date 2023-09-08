import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useAllUserVaultBalances,
  useAllUserVaultDelegationBalances,
  useAllVaultExchangeRates,
  useAllVaultTokenPrices,
  useVaults
} from '@generationsoftware/hyperstructure-react-hooks'
import { TokenWithAmount } from '@shared/types'
import { getAssetsFromShares } from '@shared/utilities'
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

  const { data: allVaultExchangeRates, isFetched: isFetchedAllVaultExchangeRates } =
    useAllVaultExchangeRates(vaults)

  const { data: allVaultTokenPrices, isFetched: isFetchedAllVaultTokenPrices } =
    useAllVaultTokenPrices()

  const isFetched =
    !!vaults &&
    isFetchedShareBalances &&
    isFetchedDelegationBalances &&
    isFetchedAllVaultExchangeRates &&
    isFetchedAllVaultTokenPrices &&
    shareBalances &&
    !!delegationBalances &&
    !!allVaultExchangeRates &&
    !!allVaultTokenPrices

  const data = useMemo(() => {
    if (isFetched) {
      return sortVaultsByDelegatedAmount(
        vaultsArray,
        shareBalances,
        delegationBalances,
        allVaultExchangeRates,
        allVaultTokenPrices
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
  exchangeRates: { [vaultId: string]: bigint },
  tokenPrices: { [chainId: number]: { [address: Address]: number } }
) => {
  return vaults.sort((a, b) => {
    const price = (v: Vault) => tokenPrices[v.chainId]?.[v.address.toLowerCase() as Address] ?? 0
    const delegationBalance = (v: Vault) =>
      (delegationBalances[v.id] ?? 0n) - (shareBalances[v.id]?.amount ?? 0n)
    const decimals = (v: Vault) => shareBalances[v.id]?.decimals ?? 18
    const exchangeRate = (v: Vault) => exchangeRates[v.id] ?? 0n

    const tokenBalance = (v: Vault) =>
      getAssetsFromShares(delegationBalance(v), exchangeRate(v), decimals(v))
    const amount = (v: Vault) => parseFloat(formatUnits(tokenBalance(v), decimals(v)))
    const value = (v: Vault) => amount(v) * price(v)

    return value(b) - value(a)
  })
}
