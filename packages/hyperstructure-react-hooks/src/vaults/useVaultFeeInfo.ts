import { Vault } from '@pooltogether/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { Address } from 'viem'
import { QUERY_KEYS } from '../constants'

/**
 * Returns the vault's current fee configuration
 * @param vault instance of the `Vault` class
 * @returns
 */
export const useVaultFeeInfo = (
  vault: Vault
): UseQueryResult<{ percent: number; recipient: Address }, unknown> => {
  const vaultId = !!vault ? [vault.id] : []
  const queryKey = [QUERY_KEYS.vaultFeeInfo, vaultId]

  return useQuery(
    queryKey,
    async () => {
      const feeInfo = await vault.getFeeInfo()
      return feeInfo
    },
    {
      enabled: !!vault,
      ...NO_REFETCH
    }
  )
}
