import { QUERY_KEYS, usePublicClientsByChain } from '@generationsoftware/hyperstructure-react-hooks'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { getPromotionCreatedEvents } from '@shared/utilities'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Address } from 'viem'
import { OLD_V5_VAULTS, V5_PROMOTION_SETTINGS } from '@constants/config'

export const useV5AllPromotionCreatedEvents = () => {
  const publicClients = usePublicClientsByChain({ useAll: true })

  const allQueryData = useMemo(() => {
    const queries: {
      chainId: number
      twabRewardsAddress: Lowercase<Address>
      vaultAddresses: Lowercase<Address>[]
      tokenAddresses?: Lowercase<Address>[]
      fromBlock?: bigint
      toBlock?: bigint
    }[] = []

    Object.entries(V5_PROMOTION_SETTINGS).forEach(
      ([strChainId, { twabRewards, tokenAddresses }]) => {
        const chainId = parseInt(strChainId)
        const chainVaultInfo = OLD_V5_VAULTS[chainId]

        if (!!chainVaultInfo) {
          const vaultAddresses = chainVaultInfo.map((entry) => entry.vault.address)

          twabRewards.forEach((entry) => {
            queries.push({
              chainId,
              twabRewardsAddress: entry.address,
              vaultAddresses,
              tokenAddresses,
              fromBlock: entry.fromBlock,
              toBlock: entry.toBlock
            })
          })
        }
      }
    )

    return queries
  }, [V5_PROMOTION_SETTINGS])

  const results = useQueries({
    queries: allQueryData.map((queryData) => {
      const publicClient = publicClients[queryData.chainId]

      const queryKey = [
        QUERY_KEYS.promotionCreatedEvents,
        queryData.chainId,
        undefined,
        queryData.vaultAddresses,
        queryData.tokenAddresses,
        queryData.fromBlock?.toString(),
        queryData.toBlock?.toString() ?? 'latest',
        queryData.twabRewardsAddress
      ]

      return {
        queryKey,
        queryFn: async () => await getPromotionCreatedEvents(publicClient, queryData),
        enabled: !!publicClient && !!allQueryData.length,
        ...NO_REFETCH
      }
    })
  })

  return useMemo(() => {
    const isFetched = results?.every((result) => result.isFetched)
    const refetch = () => results?.forEach((result) => result.refetch())

    const data: {
      [chainId: number]: {
        [twabRewardsAddress: Lowercase<Address>]: Awaited<
          ReturnType<typeof getPromotionCreatedEvents>
        >
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

    return { isFetched, refetch, data }
  }, [results])
}
