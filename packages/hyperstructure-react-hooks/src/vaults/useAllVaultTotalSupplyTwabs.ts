import { PrizePool, Vaults } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQueries, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { populateCachePerId } from '..'
import { QUERY_KEYS } from '../constants'

/**
 * Returns each vault's total supply TWAB on their respective prize pool over the last N draws
 *
 * Stores queried vault TWABs in cache
 * @param vaults instance of the `Vaults` class
 * @param prizePools instances of the `PrizePool` class
 * @param numDraws number of past draws to look back on (default is `7`)
 * @returns
 */
export const useAllVaultTotalSupplyTwabs = (
  vaults: Vaults,
  prizePools: PrizePool[],
  numDraws: number = 7
) => {
  const queryClient = useQueryClient()

  const results = useQueries({
    queries: prizePools.map((prizePool) => {
      const vaultIds = !!vaults
        ? Object.keys(vaults.vaults).filter(
            (vaultId) => vaults.vaults[vaultId].chainId === prizePool.chainId
          )
        : []

      const getQueryKey = (val: (string | number)[]) => [
        QUERY_KEYS.vaultTotalSupplyTwabs,
        prizePool?.id,
        val,
        numDraws
      ]

      return {
        queryKey: getQueryKey(vaultIds),
        queryFn: async () => {
          const vaultAddresses = Object.values(vaults.vaults)
            .filter((vault) => vaultIds.includes(vault.id))
            .map((vault) => vault.address)

          const totalSupplyTwabs = await prizePool.getVaultTotalSupplyTwabs(
            vaultAddresses,
            numDraws
          )

          populateCachePerId(queryClient, getQueryKey, totalSupplyTwabs)

          return totalSupplyTwabs
        },
        enabled: !!prizePool && !!vaults,
        ...NO_REFETCH
      }
    })
  })

  return useMemo(() => {
    const isFetched = results?.every((result) => result.isFetched)
    const refetch = () => results?.forEach((result) => result.refetch())

    const data: { [vaultId: string]: bigint } = Object.assign(
      {},
      ...results.map((result) => result.data)
    )

    return { isFetched, refetch, data }
  }, [results])
}
