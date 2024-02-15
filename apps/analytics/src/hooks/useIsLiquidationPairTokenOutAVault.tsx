import { NO_REFETCH } from '@shared/generic-react-hooks'
import { vaultABI } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { Address, isAddress } from 'viem'
import { usePublicClient } from 'wagmi'
import { useLiquidationPairTokenOutAddress } from './useLiquidationPairTokenOutAddress'

export const useIsLiquidationPairTokenOutAVault = (chainId: number, lpAddress: Address) => {
  const publicClient = usePublicClient({ chainId })

  const { data: tokenOutAddress, isFetched: isFetchedTokenOutAddress } =
    useLiquidationPairTokenOutAddress(chainId, lpAddress)

  const queryKey = ['isLpTokenOutAVault', chainId, lpAddress]

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!!publicClient) {
        try {
          const asset = await publicClient.readContract({
            address: tokenOutAddress as Address,
            abi: vaultABI,
            functionName: 'asset'
          })
          return !!asset ? isAddress(asset) : false
        } catch {
          return false
        }
      }
    },
    enabled: !!publicClient && !!lpAddress && isFetchedTokenOutAddress && !!tokenOutAddress,
    ...NO_REFETCH
  })
}
