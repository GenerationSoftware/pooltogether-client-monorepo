import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants'

/**
 * Returns a vault's token contributions to a prize pool
 * @param prizePool instance of the `PrizePool` class
 * @param vault instance of the `Vault` class
 * @param numDraws number of past draws to consider (default is `7`)
 * @returns
 */
export const useVaultContributionAmount = (
  prizePool: PrizePool,
  vault: Vault,
  numDraws: number = 7
) => {
  const queryKey = [QUERY_KEYS.vaultContributionAmounts, prizePool?.id, vault?.id, numDraws]

  return useQuery(
    queryKey,
    async () => {
      const lastDrawId = (await prizePool.getLastDrawId()) || 1
      const startDrawId = numDraws > lastDrawId ? 1 : lastDrawId - Math.floor(numDraws) + 1

      const contributionAmounts = await prizePool.getVaultContributedAmounts(
        [vault.address],
        startDrawId,
        lastDrawId
      )

      const contributionAmount = contributionAmounts[vault.id]
      return contributionAmount
    },
    {
      enabled: !!prizePool && !!vault,
      ...NO_REFETCH
    }
  )
}
