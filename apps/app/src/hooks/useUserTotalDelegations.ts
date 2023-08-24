import { getAssetsFromShares } from '@pooltogether/hyperstructure-client-js'
import {
  useAllUserBalanceUpdates,
  useAllVaultExchangeRates,
  useAllVaultTokenPrices,
  useSelectedVaults
} from '@pooltogether/hyperstructure-react-hooks'
import { getVaultId } from '@shared/utilities'
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

  const { data: userBalanceUpdates, isFetched: isFetchedUserBalanceUpdates } =
    useAllUserBalanceUpdates(prizePoolsArray, userAddress)

  const { data: vaultExchangeRates, isFetched: isFetchedVaultExchangeRates } =
    useAllVaultExchangeRates(vaults)

  const isFetched =
    isFetchedVaultData &&
    isFetchedAllVaultTokenPrices &&
    isFetchedUserBalanceUpdates &&
    isFetchedVaultExchangeRates &&
    !!allVaultTokenPrices &&
    !!vaultExchangeRates &&
    !!userBalanceUpdates &&
    !!vaults.underlyingTokenAddresses

  const data = useMemo(() => {
    if (isFetched) {
      let totalDelegations: number = 0

      for (const key in userBalanceUpdates) {
        const chainId = parseInt(key)
        const chainUpdates = userBalanceUpdates[chainId]

        for (const vaultAddress in chainUpdates) {
          const vault = Object.values(vaults.vaults).find(
            (v) => v.chainId === chainId && v.address.toLowerCase() === vaultAddress
          )

          if (!!vault) {
            const decimals = vault.decimals
            const exchangeRate = vaultExchangeRates[vault.id]

            if (decimals !== undefined && !!exchangeRate) {
              const tokenAddress = vaults.underlyingTokenAddresses?.byVault[vault.id] as Address
              const latestObservation = chainUpdates[vaultAddress as Address][0]
              const delegationBalance =
                latestObservation.delegateBalance - latestObservation.balance

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
    isFetchedUserBalanceUpdates,
    userBalanceUpdates,
    isFetchedVaultExchangeRates,
    vaultExchangeRates,
    vaults
  ])

  return { data, isFetched }
}
