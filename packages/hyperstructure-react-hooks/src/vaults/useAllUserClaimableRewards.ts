import { NO_REFETCH } from '@shared/generic-react-hooks'
import { getClaimableRewards } from '@shared/utilities'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Address } from 'viem'
import { usePublicClientsByChain } from '../blockchain/useClients'
import { QUERY_KEYS } from '../constants'

/**
 * Returns a user's claimable rewards for the given promotions on any network
 * @param userAddress user address to get delegate for
 * @param promotions info for the promotions to consider
 * @returns
 */
export const useAllUserClaimableRewards = (
  userAddress: Address,
  promotions: {
    [chainId: number]: {
      [id: string]: { startTimestamp?: bigint; numberOfEpochs?: number; epochDuration?: number }
    }
  }
) => {
  const publicClients = usePublicClientsByChain({ useAll: true })

  const chainIds = Object.keys(promotions).map((k) => parseInt(k))

  const results = useQueries({
    queries: chainIds.map((chainId) => {
      const publicClient = publicClients[chainId]

      const promotionIds = !!promotions?.[chainId] ? Object.keys(promotions[chainId]) : []
      const queryKey = [QUERY_KEYS.userClaimableRewards, chainId, userAddress, promotionIds]

      return {
        queryKey,
        queryFn: async () =>
          await getClaimableRewards(publicClient, userAddress, promotions[chainId]),
        enabled: !!chainId && !!publicClient && !!userAddress,
        ...NO_REFETCH
      }
    })
  })

  return useMemo(() => {
    const isFetched = results?.every((result) => result.isFetched)
    const isFetching = results?.some((result) => result.isFetching)
    const refetch = () => results?.forEach((result) => result.refetch())

    const data: { [chainId: number]: { [id: string]: { [epochId: number]: bigint } } } = {}
    results.forEach((result, i) => {
      if (!!result.data) {
        data[chainIds[i]] = result.data
      }
    })

    return { isFetched, isFetching, refetch, data }
  }, [results])
}
