import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { useLastAwardedDrawId } from '@generationsoftware/hyperstructure-react-hooks'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { prizePoolABI } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { Address, ContractFunctionParameters } from 'viem'

/**
 * Returns vault contributions per draw
 * @param prizePool the prize pool being contributed to
 * @param vaultAddress the address of the vault to check contributions for
 * @returns
 */
export const useVaultContributions = (prizePool: PrizePool, vaultAddress: Address) => {
  const { data: lastDrawId } = useLastAwardedDrawId(prizePool)

  return useQuery({
    queryKey: ['vaultContributions', prizePool?.id, vaultAddress, lastDrawId],
    queryFn: async () => {
      const contributions: { [drawId: number]: bigint } = {}

      if (!!lastDrawId) {
        const drawIds = Array.from({ length: lastDrawId + 1 }, (_v, k) => k + 1)

        const contracts: ContractFunctionParameters<typeof prizePoolABI>[] = []
        drawIds.forEach((drawId) => {
          contracts.push({
            address: prizePool.address,
            abi: prizePoolABI,
            functionName: 'getContributedBetween',
            args: [vaultAddress, drawId, drawId]
          })
        })

        // @ts-ignore
        const multicallResults = await prizePool.publicClient.multicall({ contracts })

        multicallResults.forEach((entry, i) => {
          if (entry.status === 'success' && typeof entry.result === 'bigint') {
            contributions[i + 1] = entry.result
          }
        })
      }

      return contributions
    },
    enabled: !!prizePool && !!vaultAddress && lastDrawId !== undefined,
    ...NO_REFETCH
  })
}
