import { NO_REFETCH } from '@shared/generic-react-hooks'
import { vaultABI } from '@shared/utilities'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Address, isAddress } from 'viem'
import { usePublicClient } from 'wagmi'
import { useLiquidationPairTokenOutAddresses } from './useLiquidationPairTokenOutAddresses'

export const useAreLiquidationPairTokenOutVaults = (chainId: number, lpAddresses: Address[]) => {
  const publicClient = usePublicClient({ chainId })

  const { data: tokenOutAddresses } = useLiquidationPairTokenOutAddresses(chainId, lpAddresses)

  const results = useQueries({
    queries: Object.entries(tokenOutAddresses).map(([lpAddress, tokenOutAddress]) => ({
      queryKey: ['isLpTokenOutAVault', chainId, lpAddress],
      queryFn: async () => {
        if (!!publicClient) {
          try {
            const asset = await publicClient.readContract({
              address: tokenOutAddress,
              abi: vaultABI,
              functionName: 'asset'
            })
            return !!asset ? isAddress(asset) : false
          } catch {
            return false
          }
        }
      },
      enabled: !!publicClient && !!lpAddress && !!tokenOutAddress,
      ...NO_REFETCH
    }))
  })

  return useMemo(() => {
    const isFetched = results?.every((result) => result.isFetched)

    const data: { [lpAddress: Address]: boolean } = {}
    lpAddresses.forEach((lpAddress, i) => {
      data[lpAddress] = !!results[i]?.data
    })

    return { isFetched, data }
  }, [results])
}
