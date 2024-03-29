import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { TokenWithAmount } from '@shared/types'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants'

/**
 * Returns a vault's total underlying token balance
 * @param vault instance of the `Vault` class
 * @param refetchInterval optional automatic refetching interval in ms
 * @returns
 */
export const useVaultBalance = (
  vault: Vault,
  refetchInterval?: number
): UseQueryResult<TokenWithAmount> => {
  const queryKey = [QUERY_KEYS.vaultBalances, vault?.id]

  return useQuery({
    queryKey,
    queryFn: async () => await vault.getTotalTokenBalance(),
    enabled: !!vault,
    ...NO_REFETCH,
    refetchInterval: refetchInterval ?? false
  })
}
