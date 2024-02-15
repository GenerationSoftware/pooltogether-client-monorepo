import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH, QUERY_KEYS } from '@generationsoftware/hyperstructure-react-hooks'
import { getVaultId } from '@shared/utilities'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { Address, zeroAddress } from 'viem'
import { usePublicClient } from 'wagmi'

/**
 * Returns the underlying token address of a given yield source
 *
 * NOTE: Returns the zero address if not a valid ERC-4626 contract
 * @param chainId the yield source's chain ID
 * @param address the yield source's address
 * @returns
 */
export const useYieldSourceTokenAddress = (
  chainId: number,
  address: Address
): UseQueryResult<Address> => {
  const publicClient = usePublicClient({ chainId })

  const id = !!chainId && !!address ? getVaultId({ chainId, address }) : undefined
  const queryKey = [QUERY_KEYS.vaultTokenAddresses, id]

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!!publicClient) {
        const yieldSource = new Vault(chainId, address, publicClient)

        try {
          const tokenAddress = await yieldSource.getTokenAddress()
          return tokenAddress
        } catch (e) {
          console.warn(e)
          return zeroAddress
        }
      }
    },
    enabled: !!chainId && !!address && !!publicClient,
    ...NO_REFETCH
  })
}
