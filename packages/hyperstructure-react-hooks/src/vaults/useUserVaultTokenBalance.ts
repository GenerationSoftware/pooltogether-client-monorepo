import { getAssetsFromShares, TokenWithAmount, Vault } from '@pooltogether/hyperstructure-client-js'
import { useUserVaultShareBalance, useVaultExchangeRate, useVaultTokenData } from '..'

/**
 * Returns a user's underlying token balance in a vault
 *
 * Wraps {@link useUserVaultShareBalance} and {@link useVaultExchangeRate}
 * @param vault instance of the `Vault` class
 * @param userAddress user address to get token balance for
 * @param refetchInterval optional automatic refetching interval in ms
 * @returns
 */
export const useUserVaultTokenBalance = (
  vault: Vault,
  userAddress: string,
  refetchInterval?: number
) => {
  const {
    data: shareBalance,
    isFetched: isFetchedShareBalance,
    refetch: refetchShareBalance
  } = useUserVaultShareBalance(vault, userAddress, refetchInterval)

  const {
    data: exchangeRate,
    isFetched: isFetchedExchangeRate,
    refetch: refetchExchangeRate
  } = useVaultExchangeRate(vault, refetchInterval)

  const { data: tokenData, isFetched: isFetchedTokenData } = useVaultTokenData(vault)

  const isFetched = isFetchedShareBalance && isFetchedExchangeRate && isFetchedTokenData

  const data: TokenWithAmount | undefined =
    isFetched && !!shareBalance && !!exchangeRate && !!tokenData
      ? {
          ...tokenData,
          amount: getAssetsFromShares(shareBalance.amount, exchangeRate, tokenData.decimals)
        }
      : undefined

  const refetch = () => {
    refetchShareBalance()
    refetchExchangeRate()
  }

  return { data, isFetched, refetch }
}
