import { NO_REFETCH } from '@shared/generic-react-hooks'
import { liquidationPairABI, vaultABI } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'
import { useLiquidationPairTokenOutAddress } from './useLiquidationPairTokenOutAddress'

export const useLiquidationPairLiquidatableBalance = (chainId: number, lpAddress: Address) => {
  const publicClient = usePublicClient({ chainId })

  const { data: lpTokenOutAddress } = useLiquidationPairTokenOutAddress(chainId, lpAddress)

  const queryKey = ['lpLiquidatableBalance', chainId, lpAddress]

  return useQuery(
    queryKey,
    async () => {
      if (!!publicClient) {
        const source = await publicClient.readContract({
          address: lpAddress,
          abi: liquidationPairABI,
          functionName: 'source'
        })

        const liquidatableBalance = await publicClient.readContract({
          address: source,
          abi: vaultABI,
          functionName: 'liquidatableBalanceOf',
          args: [lpTokenOutAddress as Address]
        })

        return liquidatableBalance
      }
    },
    {
      enabled: !!publicClient && !!lpAddress && !!lpTokenOutAddress,
      ...NO_REFETCH
    }
  )
}
