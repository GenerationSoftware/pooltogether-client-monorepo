import { Vault } from '@pooltogether/hyperstructure-client-js'
import { NO_REFETCH, QUERY_KEYS } from '@pooltogether/hyperstructure-react-hooks'
import { getVaultId } from '@shared/utilities'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'

/**
 * Returns the underlying token address of a given yield source
 * @param chainId the yield source's chain ID
 * @param address the yield source's address
 * @returns
 */
export const useYieldSourceTokenAddress = (
  chainId: number,
  address: Address
): UseQueryResult<Address, unknown> => {
  const publicClient = usePublicClient({ chainId })

  const id = !!chainId && !!address ? [getVaultId({ chainId, address })] : []
  const queryKey = [QUERY_KEYS.vaultTokenAddresses, id]

  return useQuery(
    queryKey,
    async () => {
      const yieldSource = new Vault(chainId, address, publicClient)
      const tokenAddress = await yieldSource.getTokenAddress()
      return tokenAddress
    },
    {
      enabled: !!chainId && !!address && !!publicClient,
      ...NO_REFETCH
    }
  )
}
