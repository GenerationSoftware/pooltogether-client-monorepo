import { NO_REFETCH } from '@shared/generic-react-hooks'
import { getPoolWideClaimableRewards, POOL_WIDE_TWAB_REWARDS_ADDRESSES } from '@shared/utilities'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Address } from 'viem'
import { usePublicClientsByChain } from '../blockchain/useClients'
import { QUERY_KEYS } from '../constants'

/**
 * Returns a user's claimable pool-wide rewards for the given promotions on any network
 * @param userAddress user address to get delegate for
 * @param vaultAddresses the prize vault addresses to consider
 * @param promotions info for the pool-wide promotions to consider
 * @returns
 */
export const useAllUserClaimablePoolWideRewards = (
  userAddress: Address,
  vaultAddresses: { [chainId: number]: Address[] },
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
      const queryKey = [
        QUERY_KEYS.userClaimablePoolWideRewards,
        chainId,
        userAddress,
        vaultAddresses?.[chainId] ?? [],
        promotionIds
      ]

      return {
        queryKey,
        queryFn: async () =>
          !!POOL_WIDE_TWAB_REWARDS_ADDRESSES[chainId]
            ? await getPoolWideClaimableRewards(
                publicClient,
                userAddress,
                vaultAddresses[chainId],
                promotions[chainId]
              )
            : {},
        enabled: !!chainId && !!publicClient && !!userAddress && !!vaultAddresses?.[chainId],
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
