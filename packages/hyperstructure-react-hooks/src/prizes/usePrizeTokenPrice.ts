import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { TokenWithPrice, TokenWithSupply } from '@shared/types'
import { useMemo } from 'react'
import { Address } from 'viem'
import { usePrizeTokenData, useTokenPrices } from '..'

/**
 * Returns the price of the token awarded by a prize pool
 * @param prizePool instance of the `PrizePool` class
 * @returns
 */
export const usePrizeTokenPrice = (prizePool: PrizePool) => {
  const { data: prizeToken, isFetched: isFetchedPrizeToken } = usePrizeTokenData(prizePool)

  const {
    data: tokenPrices,
    isFetched: isFetchedTokenPrices,
    refetch
  } = useTokenPrices(prizePool?.chainId, !!prizeToken ? [prizeToken.address] : [])

  const tokenPrice = useMemo(() => {
    return !!prizeToken && !!tokenPrices
      ? tokenPrices[prizeToken.address.toLowerCase() as Address]
      : undefined
  }, [prizeToken, tokenPrices])

  const isFetched = isFetchedPrizeToken && isFetchedTokenPrices

  const data: (TokenWithSupply & TokenWithPrice) | undefined =
    isFetched && !!prizeToken ? { ...prizeToken, price: tokenPrice } : undefined

  return { data, isFetched, refetch }
}
