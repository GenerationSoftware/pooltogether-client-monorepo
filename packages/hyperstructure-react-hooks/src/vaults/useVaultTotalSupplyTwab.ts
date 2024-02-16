import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants'

/**
 * Returns a vault's total supply TWAB over the last N draws
 * @param prizePool instance of the `PrizePool` class
 * @param vault instance of the `Vault` class
 * @param numDraws number of past draws to look back on (default is `7`)
 * @returns
 */
export const useVaultTotalSupplyTwab = (
  prizePool: PrizePool,
  vault: Vault,
  numDraws: number = 7
) => {
  const queryKey = [QUERY_KEYS.vaultTotalSupplyTwabs, prizePool?.id, vault?.id, numDraws]

  return useQuery({
    queryKey,
    queryFn: async () => {
      const totalSupplyTwabs = await prizePool.getVaultTotalSupplyTwabs([vault.address], numDraws)

      const totalSupplyTwab = totalSupplyTwabs[vault.id]
      return totalSupplyTwab
    },
    enabled: !!prizePool && !!vault,
    ...NO_REFETCH
  })
}
