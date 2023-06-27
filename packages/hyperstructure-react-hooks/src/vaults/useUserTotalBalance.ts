import {
  getAssetsFromShares,
  getTokenPriceFromObject
} from '@pooltogether/hyperstructure-client-js'
import { useMemo } from 'react'
import { formatUnits } from 'viem'
import { useAccount } from 'wagmi'
import {
  useAllTokenPrices,
  useAllUserVaultBalances,
  useAllVaultExchangeRates,
  useSelectedVaults
} from '..'

/**
 * Returns a user's total balance in ETH
 * @returns
 */
export const useUserTotalBalance = () => {
  const { address: userAddress } = useAccount()

  const { vaults, isFetched: isFetchedVaultData } = useSelectedVaults()

  const { data: tokenPrices, isFetched: isFetchedTokenPrices } = useAllTokenPrices()

  const { data: vaultBalances, isFetched: isFetchedVaultBalances } = useAllUserVaultBalances(
    vaults,
    userAddress as `0x${string}`
  )

  const { data: vaultExchangeRates, isFetched: isFetchedVaultExchangeRates } =
    useAllVaultExchangeRates(vaults)

  const isFetched =
    isFetchedVaultData &&
    isFetchedTokenPrices &&
    isFetchedVaultBalances &&
    isFetchedVaultExchangeRates &&
    !!tokenPrices &&
    !!vaultBalances &&
    !!vaultExchangeRates &&
    !!vaults.underlyingTokenAddresses

  const data = useMemo(() => {
    if (isFetched) {
      let totalBalance: number = 0
      for (const vaultId in vaultBalances) {
        const decimals = vaultBalances[vaultId].decimals
        if (!isNaN(decimals)) {
          const exchangeRate = vaultExchangeRates[vaultId]
          if (!!exchangeRate) {
            const chainId = vaultBalances[vaultId].chainId
            const tokenAddress = vaults.underlyingTokenAddresses?.byVault[vaultId] as `0x${string}`
            const shareBalance = vaultBalances[vaultId].amount

            const tokenPrice = getTokenPriceFromObject(chainId, tokenAddress, tokenPrices)
            const tokenBalance = getAssetsFromShares(shareBalance, exchangeRate, decimals)

            const formattedTokenBalance = formatUnits(tokenBalance, decimals)
            totalBalance += Number(formattedTokenBalance) * tokenPrice
          }
        }
      }
      return totalBalance
    } else {
      return 0
    }
  }, [
    isFetchedVaultData,
    isFetchedTokenPrices,
    tokenPrices,
    isFetchedVaultBalances,
    vaultBalances,
    isFetchedVaultExchangeRates,
    vaultExchangeRates,
    vaults
  ])

  return { data, isFetched }
}
