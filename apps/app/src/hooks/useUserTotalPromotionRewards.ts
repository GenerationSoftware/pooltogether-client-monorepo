import {
  useTokenPricesAcrossChains,
  useTokensAcrossChains
} from '@generationsoftware/hyperstructure-react-hooks'
import { lower } from '@shared/utilities'
import { useMemo } from 'react'
import { Address, formatUnits } from 'viem'
import { useUserClaimablePoolWidePromotions } from './useUserClaimablePoolWidePromotions'
import { useUserClaimablePromotions } from './useUserClaimablePromotions'
import { useUserClaimedPoolWidePromotions } from './useUserClaimedPoolWidePromotions'
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

  const { data: poolWideClaimed, isFetched: isFetchedPoolWideClaimed } =
    useUserClaimedPoolWidePromotions(userAddress)
  const { data: poolWideClaimable, isFetched: isFetchedPoolWideClaimable } =
    useUserClaimablePoolWidePromotions(userAddress)

  const tokenAddresses = useMemo(() => {
    const addresses: { [chainId: number]: Address[] } = {}
    const addressSets: { [chainId: number]: Set<Address> } = {}

    claimed.forEach((promotion) => {
      if (addressSets[promotion.chainId] === undefined) {
        addressSets[promotion.chainId] = new Set<Address>()
      }
      addressSets[promotion.chainId].add(promotion.token)
    })

    poolWideClaimed.forEach((promotion) => {
      if (addressSets[promotion.chainId] === undefined) {
        addressSets[promotion.chainId] = new Set<Address>()
      }
      addressSets[promotion.chainId].add(promotion.token)
    })

    if (options?.includeUnclaimed) {
      claimable.forEach((promotion) => {
        if (addressSets[promotion.chainId] === undefined) {
          addressSets[promotion.chainId] = new Set<Address>()
        }
        addressSets[promotion.chainId].add(promotion.token)
      })

      poolWideClaimable.forEach((promotion) => {
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
  }, [claimed, claimable, poolWideClaimed, poolWideClaimable, options])

  const { data: allTokenPrices, isFetched: isFetchedAllTokenPrices } =
    useTokenPricesAcrossChains(tokenAddresses)

  const { data: allTokenData, isFetched: isFetchedAllTokenData } =
    useTokensAcrossChains(tokenAddresses)

  return useMemo(() => {
    const isFetched =
      isFetchedClaimed &&
      isFetchedClaimable &&
      isFetchedPoolWideClaimed &&
      isFetchedPoolWideClaimable &&
      isFetchedAllTokenPrices &&
      isFetchedAllTokenData &&
      !!claimed &&
      !!poolWideClaimed &&
      (!options?.includeUnclaimed || (!!claimable && !!poolWideClaimable)) &&
      !!allTokenPrices &&
      !!allTokenData

    let totalRewards = 0

    const getTokenRewards = (chainId: number, tokenAddress: Address, amount: bigint) => {
      const tokenPrice = allTokenPrices[chainId]?.[lower(tokenAddress)]
      const tokenData = allTokenData[chainId]?.[tokenAddress]

      if (!!tokenPrice && !!tokenData) {
        const tokenAmount = parseFloat(formatUnits(amount, tokenData.decimals))
        return tokenAmount * tokenPrice
      } else {
        return 0
      }
    }

    claimed.forEach((promotion) => {
      totalRewards += getTokenRewards(promotion.chainId, promotion.token, promotion.totalClaimed)
    })

    poolWideClaimed.forEach((promotion) => {
      totalRewards += getTokenRewards(promotion.chainId, promotion.token, promotion.totalClaimed)
    })

    if (options?.includeUnclaimed) {
      claimable.forEach((promotion) => {
        totalRewards += getTokenRewards(
          promotion.chainId,
          promotion.token,
          Object.values(promotion.epochRewards).reduce((a, b) => a + b, 0n)
        )
      })

      poolWideClaimable.forEach((promotion) => {
        totalRewards += getTokenRewards(
          promotion.chainId,
          promotion.token,
          Object.values(promotion.epochRewards).reduce((a, b) => a + b, 0n)
        )
      })
    }

    return { isFetched, data: totalRewards }
  }, [
    claimed,
    claimable,
    poolWideClaimed,
    poolWideClaimable,
    allTokenPrices,
    allTokenData,
    options
  ])
}
