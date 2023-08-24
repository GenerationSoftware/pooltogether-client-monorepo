import { getAssetsFromShares, Vault } from '@pooltogether/hyperstructure-client-js'
import {
  useAllUserBalanceUpdates,
  useAllVaultExchangeRates,
  useAllVaultShareData,
  useAllVaultTokenPrices,
  useVaults
} from '@pooltogether/hyperstructure-react-hooks'
import { SubgraphObservation, TokenWithSupply } from '@shared/types'
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

  const { data: userBalanceUpdates, isFetched: isFetchedUserBalanceUpdates } =
    useAllUserBalanceUpdates(prizePoolsArray, userAddress)

  const { data: allVaultExchangeRates, isFetched: isFetchedAllVaultExchangeRates } =
    useAllVaultExchangeRates(vaults)

  const { data: allVaultTokenPrices, isFetched: isFetchedAllVaultTokenPrices } =
    useAllVaultTokenPrices()

  const { data: allVaultShareData, isFetched: isFetchedAllVaultShareData } =
    useAllVaultShareData(vaults)

  const isFetched =
    !!vaults &&
    isFetchedUserBalanceUpdates &&
    isFetchedAllVaultExchangeRates &&
    isFetchedAllVaultTokenPrices &&
    isFetchedAllVaultShareData &&
    !!userBalanceUpdates &&
    !!allVaultExchangeRates &&
    !!allVaultTokenPrices &&
    !!allVaultShareData

  const data = useMemo(() => {
    if (isFetched) {
      return sortVaultsByDelegatedAmount(
        vaultsArray,
        userBalanceUpdates,
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
  balanceUpdates: { [chainId: number]: { [vaultAddress: `0x${string}`]: SubgraphObservation[] } },
  exchangeRates: { [vaultId: string]: bigint },
  tokenPrices: { [chainId: number]: { [address: Address]: number } },
  shareData: { [vaultId: string]: TokenWithSupply }
) => {
  return vaults.sort((a, b) => {
    const price = (v: Vault) => tokenPrices[v.chainId]?.[v.address.toLowerCase() as Address] ?? 0
    const latestObservation = (v: Vault) =>
      balanceUpdates[v.chainId]?.[v.address.toLowerCase() as Address]?.[0]
    const decimals = (v: Vault) => shareData[v.id]?.decimals ?? 0
    const exchangeRate = (v: Vault) => exchangeRates[v.id] ?? 0n

    const delegatedAmount = (v: Vault) =>
      latestObservation(v)
        ? latestObservation(v).delegateBalance - latestObservation(v).balance
        : 0n
    const tokenBalance = (v: Vault) =>
      getAssetsFromShares(delegatedAmount(v), exchangeRate(v), decimals(v))
    const amount = (v: Vault) => parseFloat(formatUnits(tokenBalance(v), decimals(v)))
    const value = (v: Vault) => amount(v) * price(v)

    return value(b) - value(a)
  })
}
