import { NO_REFETCH } from '@shared/generic-react-hooks'
import { VaultList } from '@shared/types'
import { getVaultList, NETWORK } from '@shared/utilities'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { useCachedVaultLists, useSelectedVaultListIds } from '..'
import { QUERY_KEYS } from '../constants'

/**
 * Returns a vault list object from a HTTPS URL, IPFS/IPNS hash or ENS domain
 *
 * Caches and selects vault list
 * @param src the source of the vault list
 * @returns
 */
export const useVaultList = (
  src: string,
  options?: { onSuccess?: (id: string) => void }
): UseQueryResult<VaultList | undefined> => {
  const publicClient = usePublicClient({ chainId: NETWORK.mainnet })

  const { select } = useSelectedVaultListIds()
  const { cache } = useCachedVaultLists()

  const queryKey = [QUERY_KEYS.vaultList, src]

  return useQuery({
    queryKey,
    queryFn: async () => {
      const vaultList = await getVaultList(src, publicClient)

      if (!!vaultList) {
        cache(src, vaultList)
        select(src, 'imported')
        options?.onSuccess?.(src)
      }

      return vaultList
    },
    enabled: !!src,
    ...NO_REFETCH
  })
}
