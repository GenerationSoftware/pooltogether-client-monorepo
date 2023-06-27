import { getVaultList, VaultList } from '@pooltogether/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { useCachedVaultLists, useSelectedVaultListIds } from '..'
import { QUERY_KEYS } from '../constants'

/**
 * Returns a vault list object from a HTTPS URL, IPFS/IPNS hash or ENS domain
 *
 * Caches and selects vault list
 * @param src the source of the vault list
 * @returns
 */
export const useVaultList = (src: string): UseQueryResult<VaultList | undefined, unknown> => {
  const queryKey = [QUERY_KEYS.vaultList, src]

  const { select } = useSelectedVaultListIds()
  const { cache } = useCachedVaultLists()

  return useQuery(queryKey, async () => await getVaultList(src), {
    enabled: !!src,
    ...NO_REFETCH,
    onSuccess: (vaultList) => {
      if (!!vaultList) {
        cache(src, vaultList)
        select(src, 'imported')
      }
    }
  })
}
