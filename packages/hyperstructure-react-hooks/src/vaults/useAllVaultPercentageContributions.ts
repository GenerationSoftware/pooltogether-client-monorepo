import { PrizePool, Vaults } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { QUERY_KEYS } from '../constants'

/**
 * Returns all vault percentage contributions to each of their respective prize pools
 * @param prizePools array of instances of the `PrizePool` class
 * @param vaults instance of the `Vaults` class
 * @param numDraws number of past draws to consider (default is `7`)
 * @param options optional settings
 * @returns
 */
export const useAllVaultPercentageContributions = (
  prizePools: PrizePool[],
  vaults: Vaults,
  numDraws: number = 7,
  options?: {
    refetchOnWindowFocus?: boolean
  }
) => {
  const results = useQueries({
    queries: prizePools.map((prizePool) => {
      const getQueryKey = (val: (string | number)[]) => [
        QUERY_KEYS.vaultPercentageContributions,
        prizePool?.id,
        numDraws,
        val
      ]

      const vaultIds = Object.keys(vaults.vaults).filter(
        (vaultId) => vaults.vaults[vaultId].chainId === prizePool?.chainId
      )

      return {
        queryKey: getQueryKey(vaultIds),
        queryFn: async () => {
          const lastDrawId = (await prizePool.getLastAwardedDrawId()) || 1
          const startDrawId = numDraws > lastDrawId ? 1 : lastDrawId - Math.floor(numDraws) + 1

          const contributionPercentages = await prizePool.getVaultContributedPercentages(
            vaultIds.map((vaultId) => vaults.vaults[vaultId].address),
            startDrawId,
            lastDrawId
          )

          return contributionPercentages
        },
        enabled: !!prizePool && !!vaults,
        ...NO_REFETCH,
        refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false
      }
    })
  })

  return useMemo(() => {
    const isFetched = results?.every((result) => result.isFetched)
    const isRefetching = results?.every((result) => result.isRefetching)
    const refetch = () => results?.forEach((result) => result.refetch())

    const data: { [vaultId: string]: number } = Object.assign(
      {},
      ...results.map((result) => result.data)
    )

    return { isFetched, isRefetching, refetch, data }
  }, [results])
}
