import { NO_REFETCH } from '@generationsoftware/hyperstructure-react-hooks'
import { VAULT_FACTORY_ADDRESSES, vaultFactoryABI } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'

/**
 * Returns the vault factory's yield buffer amount
 * @param chainId the vault factory's chain ID
 * @returns
 */
export const useYieldBuffer = (chainId: number) => {
  const publicClient = usePublicClient({ chainId })

  const vaultFactoryAddress = !!chainId ? VAULT_FACTORY_ADDRESSES[chainId] : undefined

  return useQuery({
    queryKey: ['yieldBuffer', chainId],
    queryFn: async () => {
      if (!!publicClient) {
        return publicClient.readContract({
          address: vaultFactoryAddress as Address,
          abi: vaultFactoryABI,
          functionName: 'YIELD_BUFFER'
        })
      }
    },
    enabled: !!chainId && !!publicClient && !!vaultFactoryAddress,
    ...NO_REFETCH
  })
}
