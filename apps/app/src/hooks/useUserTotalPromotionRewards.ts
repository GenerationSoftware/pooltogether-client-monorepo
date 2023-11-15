import {
  useTokenPricesAcrossChains,
  useTokensAcrossChains
} from '@generationsoftware/hyperstructure-react-hooks'
import { useMemo } from 'react'
import { Address, formatUnits } from 'viem'
import { useUserClaimablePromotions } from './useUserClaimablePromotions'
import { useUserClaimedPromotions } from './useUserClaimedPromotions'

/**
 * Returns a user's total TWAB rewards in ETH
 * @param userAddress user address to get total rewards for
 * @param options optional settings
 * @returns
 */
export const useUserTotalPromotionRewards = (
  userAddress: Address,
  options?: { includeUnclaimed?: boolean }
) => {
  const { data: claimed, isFetched: isFetchedClaimed } = useUserClaimedPromotions(userAddress)
  const { data: claimable, isFetched: isFetchedClaimable } = useUserClaimablePromotions(userAddress)

  const tokenAddresses = useMemo(() => {
    const addresses: { [chainId: number]: Address[] } = {}
    const addressSets: { [chainId: number]: Set<Address> } = {}

    if (isFetchedClaimed && !!claimed) {
      claimed.forEach((promotion) => {
        if (addressSets[promotion.chainId] === undefined) {
          addressSets[promotion.chainId] = new Set<Address>()
        }
        addressSets[promotion.chainId].add(promotion.token)
      })
    }

    if (options?.includeUnclaimed && isFetchedClaimable && !!claimable) {
      claimable.forEach((promotion) => {
        if (addressSets[promotion.chainId] === undefined) {
          addressSets[promotion.chainId] = new Set<Address>()
        }
        addressSets[promotion.chainId].add(promotion.token)
      })
    }

    Object.entries(addressSets).forEach(([key, addressSet]) => {
      const chainId = parseInt(key)
      addresses[chainId] = [...addressSet]
    })

    return addresses
  }, [claimed, isFetchedClaimed, claimable, isFetchedClaimable, options])

  const { data: allTokenPrices, isFetched: isFetchedAllTokenPrices } =
    useTokenPricesAcrossChains(tokenAddresses)

  const { data: allTokenData, isFetched: isFetchedAllTokenData } =
    useTokensAcrossChains(tokenAddresses)

  return useMemo(() => {
    const isFetched =
      isFetchedClaimed &&
      isFetchedClaimable &&
      isFetchedAllTokenPrices &&
      isFetchedAllTokenData &&
      !!claimed &&
      (!options?.includeUnclaimed || !!claimable) &&
      !!allTokenPrices &&
      !!allTokenData

    let totalRewards = 0

    if (isFetched) {
      claimed.forEach((promotion) => {
        const tokenPrice =
          allTokenPrices[promotion.chainId]?.[promotion.token.toLowerCase() as Address]
        const tokenData = allTokenData[promotion.chainId]?.[promotion.token]

        if (!!tokenPrice && !!tokenData) {
          const tokenAmount = parseFloat(formatUnits(promotion.totalClaimed, tokenData.decimals))
          totalRewards += tokenAmount * tokenPrice
        }
      })

      if (options?.includeUnclaimed) {
        claimable.forEach((promotion) => {
          const tokenPrice =
            allTokenPrices[promotion.chainId]?.[promotion.token.toLowerCase() as Address]
          const tokenData = allTokenData[promotion.chainId]?.[promotion.token]

          if (!!tokenPrice && !!tokenData) {
            const rawTokenAmount = Object.values(promotion.epochRewards).reduce((a, b) => a + b, 0n)
            const tokenAmount = parseFloat(formatUnits(rawTokenAmount, tokenData.decimals))
            totalRewards += tokenAmount * tokenPrice
          }
        })
      }
    }

    return { isFetched, data: isFetched ? totalRewards : undefined }
  }, [claimed, claimable, allTokenPrices, allTokenData, options])
}
