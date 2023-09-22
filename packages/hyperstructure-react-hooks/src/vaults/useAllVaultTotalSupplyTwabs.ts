import { PrizePool, Vaults } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { populateCachePerId } from '..'
import { QUERY_KEYS } from '../constants'

/**
 * Returns each vault's total supply TWAB on a given prize pool over the last N draws
 *
 * Stores queried vault TWABs in cache
 * @param vaults instance of the `Vaults` class
 * @param prizePool instance of the `PrizePool` class
 * @param numDraws number of past draws to look back on (default is `7`)
 * @returns
 */
export const useAllVaultTotalSupplyTwabs = (
  vaults: Vaults,
  prizePool: PrizePool,
  numDraws: number = 7
) => {
  const queryClient = useQueryClient()

  const vaultIds = !!vaults
    ? Object.keys(vaults.vaults).filter(
        (vaultId) => vaults.vaults[vaultId].chainId === prizePool?.chainId
      )
    : []

  const getQueryKey = (val: (string | number)[]) => [
    QUERY_KEYS.vaultTotalSupplyTwabs,
    prizePool?.id,
    val,
    numDraws
  ]

  return useQuery(
    getQueryKey(vaultIds),
    async () => {
      const vaultAddresses = Object.values(vaults.vaults)
        .filter((vault) => vaultIds.includes(vault.id))
        .map((vault) => vault.address)

      const totalSupplyTwabs = await prizePool.getVaultTotalSupplyTwabs(vaultAddresses, numDraws)

      return totalSupplyTwabs
    },
    {
      enabled: !!prizePool && !!vaults,
      ...NO_REFETCH,
      onSuccess: (data) => populateCachePerId(queryClient, getQueryKey, data)
    }
  )
}
