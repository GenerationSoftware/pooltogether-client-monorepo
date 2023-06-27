import {
  getTokenPriceFromObject,
  PrizePool,
  TokenWithPrice
} from '@pooltogether/hyperstructure-client-js'
import { CURRENCY_ID } from '@shared/generic-react-hooks'
import { usePrizeTokenData, useTokenPrices } from '..'

/**
 * Returns the price of the token awarded by a prize pool
 * @param prizePool instance of the `PrizePool` class
 * @param currency optional currency (default is 'eth')
 * @returns
 */
export const usePrizeTokenPrice = (
  prizePool: PrizePool,
  currency?: CURRENCY_ID
): { data: TokenWithPrice | undefined; isFetched: boolean; refetch: () => void } => {
  const { data: prizeToken, isFetched: isFetchedPrizeToken } = usePrizeTokenData(prizePool)

  const {
    data: tokenPrices,
    isFetched: isFetchedTokenPrices,
    refetch
  } = useTokenPrices(
    prizePool?.chainId,
    !!prizeToken ? [prizeToken.address] : [],
    !!currency ? [currency] : undefined
  )

  const tokenPrice = !!prizeToken
    ? getTokenPriceFromObject(
        prizePool.chainId,
        prizeToken.address,
        {
          [prizePool.chainId]: tokenPrices ?? {}
        },
        currency
      )
    : undefined

  const isFetched = isFetchedPrizeToken && isFetchedTokenPrices

  const data: TokenWithPrice | undefined =
    !!prizeToken && tokenPrice !== undefined ? { ...prizeToken, price: tokenPrice } : undefined

  return { data, isFetched, refetch }
}
