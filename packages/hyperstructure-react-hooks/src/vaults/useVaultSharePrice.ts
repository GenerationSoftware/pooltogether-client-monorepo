import { getAssetsFromShares, TokenWithPrice, Vault } from '@pooltogether/hyperstructure-client-js'
import { CURRENCY_ID } from '@shared/generic-react-hooks'
import { formatEther, parseEther } from 'viem'
import { useVaultExchangeRate, useVaultShareData, useVaultTokenPrice } from '..'

/**
 * Returns a vault's share price
 * @param vault instance of the `Vault` class
 * @param currency optional currency (default is 'eth')
 * @returns
 */
export const useVaultSharePrice = (vault: Vault, currency?: CURRENCY_ID) => {
  const { data: shareData, isFetched: isFetchedShareData } = useVaultShareData(vault)

  const {
    data: tokenWithPrice,
    isFetched: isFetchedTokenPrice,
    refetch: refetchTokenPrice
  } = useVaultTokenPrice(vault, currency)
  const tokenPrice = parseEther(`${tokenWithPrice?.price ?? 0}`)

  const {
    data: exchangeRate,
    isFetched: isFetchedExchangeRate,
    refetch: refetchExchangeRate
  } = useVaultExchangeRate(vault)

  const isFetched = isFetchedShareData && isFetchedTokenPrice && isFetchedExchangeRate

  const enabled = isFetched && !!shareData && !!tokenWithPrice && !!exchangeRate

  const sharePrice = enabled
    ? parseFloat(
        formatEther(getAssetsFromShares(tokenPrice, exchangeRate, tokenWithPrice.decimals))
      )
    : undefined

  const data: TokenWithPrice | undefined =
    enabled && sharePrice !== undefined ? { ...shareData, price: sharePrice } : undefined

  const refetch = () => {
    refetchTokenPrice()
    refetchExchangeRate()
  }

  return { data, isFetched, refetch }
}
