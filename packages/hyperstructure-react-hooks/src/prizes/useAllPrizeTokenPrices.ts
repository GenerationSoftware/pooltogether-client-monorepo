import { lower, PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { TokenWithPrice, TokenWithSupply } from '@shared/types'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useTokenPricesAcrossChains } from '..'
import { useAllPrizeTokenData } from './useAllPrizeTokenData'

/**
 * Returns the prices of the tokens awarded by any given prize pools
 * @param prizePools instances of the `PrizePool` class
 * @returns
 */
export const useAllPrizeTokenPrices = (prizePools: PrizePool[]) => {
  const { data: prizeTokens, isFetched: isFetchedPrizeTokens } = useAllPrizeTokenData(prizePools)

  const prizeTokenAddresses = useMemo(() => {
    const addresses: { [chainId: number]: Address[] } = {}

    Object.values(prizeTokens).forEach((token) => {
      if (addresses[token.chainId] === undefined) {
        addresses[token.chainId] = [token.address]
      } else {
        addresses[token.chainId].push(token.address)
      }
    })

    return addresses
  }, [prizeTokens])

  const {
    data: prizeTokenPrices,
    isFetched: isFetchedPrizeTokenPrices,
    refetch
  } = useTokenPricesAcrossChains(prizeTokenAddresses)

  const isFetched = isFetchedPrizeTokens && isFetchedPrizeTokenPrices

  const data = useMemo(() => {
    const prices: { [prizePoolId: string]: TokenWithSupply & TokenWithPrice } = {}

    Object.entries(prizeTokens).forEach(([prizePoolId, token]) => {
      const price = prizeTokenPrices[token.chainId]?.[lower(token.address)]
      prices[prizePoolId] = { ...token, price }
    })

    return prices
  }, [prizeTokens, prizeTokenPrices])

  return { data, isFetched, refetch }
}
