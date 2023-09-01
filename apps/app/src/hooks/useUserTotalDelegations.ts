import {
  useAllUserVaultDelegationBalances,
  useAllVaultExchangeRates,
  useAllVaultTokenPrices,
  useSelectedVaults
} from '@generationsoftware/hyperstructure-react-hooks'
import { getAssetsFromShares } from '@shared/utilities'
import { useMemo } from 'react'
import { Address, formatUnits } from 'viem'
import { useSupportedPrizePools } from './useSupportedPrizePools'

/**
 * Returns a user's total received delegations in ETH
 * @param userAddress user address to get total delegations for
 * @returns
 */
export const useUserTotalDelegations = (userAddress: Address) => {
  const { vaults, isFetched: isFetchedVaultData } = useSelectedVaults()

  const { data: allVaultTokenPrices, isFetched: isFetchedAllVaultTokenPrices } =
    useAllVaultTokenPrices()

  const prizePools = useSupportedPrizePools()
  const prizePoolsArray = Object.values(prizePools)

  const { data: delegationBalances, isFetched: isFetchedDelegationBalances } =
    useAllUserVaultDelegationBalances(prizePoolsArray, userAddress as Address)

  const { data: vaultExchangeRates, isFetched: isFetchedVaultExchangeRates } =
    useAllVaultExchangeRates(vaults)

  const isFetched =
    isFetchedVaultData &&
    isFetchedAllVaultTokenPrices &&
    isFetchedDelegationBalances &&
    isFetchedVaultExchangeRates &&
    !!allVaultTokenPrices &&
    !!vaultExchangeRates &&
    !!delegationBalances &&
    !!vaults.underlyingTokenAddresses

  const data = useMemo(() => {
    if (isFetched) {
      let totalDelegations: number = 0

      for (const key in delegationBalances) {
        const chainId = parseInt(key)
        const chainBalances = delegationBalances[chainId]

        for (const vaultAddress in chainBalances) {
          const vault = Object.values(vaults.vaults).find(
            (v) => v.chainId === chainId && v.address.toLowerCase() === vaultAddress
          )

          if (!!vault) {
            const decimals = vault.decimals
            const exchangeRate = vaultExchangeRates[vault.id]

            if (decimals !== undefined && !!exchangeRate) {
              const tokenAddress = vaults.underlyingTokenAddresses?.byVault[vault.id] as Address
              const delegationBalance = chainBalances[vaultAddress as Address]

              if (delegationBalance > 0n) {
                const tokenPrice =
                  allVaultTokenPrices[chainId]?.[tokenAddress.toLowerCase() as Address] ?? 0
                const tokenBalance = getAssetsFromShares(delegationBalance, exchangeRate, decimals)

                const formattedTokenBalance = formatUnits(tokenBalance, decimals)
                totalDelegations += Number(formattedTokenBalance) * tokenPrice
              }
            }
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
    isFetchedDelegationBalances,
    delegationBalances,
    isFetchedVaultExchangeRates,
    vaultExchangeRates,
    vaults
  ])

  return { data, isFetched }
}
