import { QUERY_KEYS, usePublicClientsByChain } from '@generationsoftware/hyperstructure-react-hooks'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { PartialPromotionInfo } from '@shared/types'
import { getClaimableRewards } from '@shared/utilities'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Address } from 'viem'

export const useUserV5ClaimableRewards = (
  userAddress: Address,
  allPromotions: {
    [chainId: number]: {
      [twabRewardsAddress: `0x${Lowercase<string>}`]: {
        [id: string]: PartialPromotionInfo
      }
    }
  }
) => {
  const publicClients = usePublicClientsByChain({ useAll: true })

  const allQueryData = useMemo(() => {
    const queries: {
      chainId: number
      twabRewardsAddress: Lowercase<Address>
      promotions: { [id: string]: PartialPromotionInfo }
    }[] = []

    Object.entries(allPromotions).forEach(([strChainId, contracts]) => {
      const chainId = parseInt(strChainId)

      Object.entries(contracts).forEach(([address, promotions]) => {
        const twabRewardsAddress = address as Lowercase<Address>

        queries.push({ chainId, twabRewardsAddress, promotions })
      })
    })

    return queries
  }, [allPromotions])

  const results = useQueries({
    queries: allQueryData.map(({ chainId, twabRewardsAddress, promotions }) => {
      const publicClient = publicClients[chainId]
      const promotionIds = Object.keys(promotions)

      const queryKey = [
        QUERY_KEYS.userClaimableRewards,
        chainId,
        userAddress,
        promotionIds,
        twabRewardsAddress
      ]

      return {
        queryKey,
        queryFn: async () =>
          await getClaimableRewards(publicClient, userAddress, promotions, { twabRewardsAddress }),
        enabled: !!chainId && !!publicClient && !!userAddress,
        ...NO_REFETCH
      }
    })
  })

  return useMemo(() => {
    const isFetched = results?.every((result) => result.isFetched)
    const isFetching = results?.some((result) => result.isFetching)
    const refetch = () => results?.forEach((result) => result.refetch())

    const data: {
      [chainId: number]: {
        [twabRewardsAddress: Lowercase<Address>]: { [id: string]: { [epochId: number]: bigint } }
      }
    } = {}
    results.forEach((result, i) => {
      if (!!result.data) {
        const { chainId, twabRewardsAddress } = allQueryData[i]

        if (data[chainId] === undefined) {
          data[chainId] = {}
        }

        data[chainId][twabRewardsAddress] = result.data
      }
    })

    return { isFetched, isFetching, refetch, data }
  }, [results])
}
