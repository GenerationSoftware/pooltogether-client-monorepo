import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { TokenWithPrice } from '@shared/types'
import { getAssetsFromShares } from '@shared/utilities'
import { formatEther, parseEther } from 'viem'
import { useVaultExchangeRate, useVaultShareData, useVaultTokenPrice } from '..'

/**
 * Returns a vault's share price
 * @param vault instance of the `Vault` class
 * @returns
 */
export const useVaultSharePrice = (vault: Vault) => {
  const { data: shareData, isFetched: isFetchedShareData } = useVaultShareData(vault)

  const {
    data: tokenWithPrice,
    isFetched: isFetchedTokenPrice,
    refetch: refetchTokenPrice
  } = useVaultTokenPrice(vault)
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

  const data: TokenWithPrice | undefined = enabled ? { ...shareData, price: sharePrice } : undefined

  const refetch = () => {
    refetchTokenPrice()
    refetchExchangeRate()
  }

  return { data, isFetched, refetch }
}
