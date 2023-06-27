import { PrizePool, Vault } from '@pooltogether/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants'

/**
 * Returns a vault's prize power
 * @param vault instance of the `Vault` class
 * @param prizePool instance of the `PrizePool` class
 * @param refetchInterval optional automatic refetching interval in ms
 * @returns
 */
export const useVaultPrizePower = (
  vault: Vault,
  prizePool: PrizePool,
  refetchInterval?: number
): { data?: number } & Omit<UseQueryResult<{ [vaultId: string]: number }>, 'data'> => {
  const queryKey = [QUERY_KEYS.vaultPrizePower, prizePool?.id, vault?.id]

  const result = useQuery(
    queryKey,
    async () => await prizePool.getVaultPrizePowers([vault?.address]),
    {
      enabled: !!vault && !!prizePool,
      ...NO_REFETCH,
      refetchInterval: refetchInterval ?? false
    }
  )

  return { ...result, data: result.data?.[vault?.id] }
}
