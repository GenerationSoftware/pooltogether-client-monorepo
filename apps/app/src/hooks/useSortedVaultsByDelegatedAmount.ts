import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useAllUserVaultDelegationBalances,
  useAllVaultExchangeRates,
  useAllVaultShareData,
  useAllVaultTokenPrices,
  useVaults
} from '@generationsoftware/hyperstructure-react-hooks'
import { TokenWithSupply } from '@shared/types'
import { getAssetsFromShares } from '@shared/utilities'
import { useMemo } from 'react'
import { Address, formatUnits } from 'viem'
import { useSupportedPrizePools } from './useSupportedPrizePools'

/**
 * Returns a sorted array of vaults by delegated amount
 * @param vaultsArray an unsorted array of vaults
 * @param userAddress user address to get delegations for
 * @returns
 */
export const useSortedVaultsByDelegatedAmount = (vaultsArray: Vault[], userAddress: Address) => {
  const vaults = useVaults(vaultsArray)

  const prizePools = useSupportedPrizePools()
  const prizePoolsArray = Object.values(prizePools)

  const { data: delegationBalances, isFetched: isFetchedDelegationBalances } =
    useAllUserVaultDelegationBalances(prizePoolsArray, userAddress as Address)

  const { data: allVaultExchangeRates, isFetched: isFetchedAllVaultExchangeRates } =
    useAllVaultExchangeRates(vaults)

  const { data: allVaultTokenPrices, isFetched: isFetchedAllVaultTokenPrices } =
    useAllVaultTokenPrices()

  const { data: allVaultShareData, isFetched: isFetchedAllVaultShareData } =
    useAllVaultShareData(vaults)

  const isFetched =
    !!vaults &&
    isFetchedDelegationBalances &&
    isFetchedAllVaultExchangeRates &&
    isFetchedAllVaultTokenPrices &&
    isFetchedAllVaultShareData &&
    !!delegationBalances &&
    !!allVaultExchangeRates &&
    !!allVaultTokenPrices &&
    !!allVaultShareData

  const data = useMemo(() => {
    if (isFetched) {
      return sortVaultsByDelegatedAmount(
        vaultsArray,
        delegationBalances,
        allVaultExchangeRates,
        allVaultTokenPrices,
        allVaultShareData
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
  delegationBalances: { [chainId: number]: { [vaultAddress: `0x${string}`]: bigint } },
  exchangeRates: { [vaultId: string]: bigint },
  tokenPrices: { [chainId: number]: { [address: Address]: number } },
  shareData: { [vaultId: string]: TokenWithSupply }
) => {
  return vaults.sort((a, b) => {
    const price = (v: Vault) => tokenPrices[v.chainId]?.[v.address.toLowerCase() as Address] ?? 0
    const delegationBalance = (v: Vault) =>
      delegationBalances[v.chainId]?.[v.address.toLowerCase() as Address] ?? 0n
    const decimals = (v: Vault) => shareData[v.id]?.decimals ?? 0
    const exchangeRate = (v: Vault) => exchangeRates[v.id] ?? 0n

    const tokenBalance = (v: Vault) =>
      getAssetsFromShares(delegationBalance(v), exchangeRate(v), decimals(v))
    const amount = (v: Vault) => parseFloat(formatUnits(tokenBalance(v), decimals(v)))
    const value = (v: Vault) => amount(v) * price(v)

    return value(b) - value(a)
  })
}
