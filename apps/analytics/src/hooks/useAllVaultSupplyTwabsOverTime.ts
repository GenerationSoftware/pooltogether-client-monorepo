import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { useLastAwardedDrawId } from '@generationsoftware/hyperstructure-react-hooks'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { getVaultId, prizePoolABI } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { Address, ContractFunctionParameters, zeroAddress } from 'viem'

export const useAllVaultSupplyTwabsOverTime = (prizePool: PrizePool, vaultAddresses: Address[]) => {
  const { data: lastAwardedDrawId } = useLastAwardedDrawId(prizePool)

  return useQuery({
    queryKey: ['allVaultSupplyTwabsOverTime', prizePool?.id, vaultAddresses, lastAwardedDrawId],
    queryFn: async () => {
      const supplyTwabs: { [vaultId: string]: { drawId: number; supplyTwab: bigint }[] } = {}

      if (!!lastAwardedDrawId) {
        const drawIds = Array.from({ length: lastAwardedDrawId }, (_, i) => i + 1)

        const contracts = vaultAddresses
          .map((vaultAddress) => getCalls(prizePool.address, vaultAddress, drawIds))
          .flat()

        // @ts-ignore
        const multicallResults = await prizePool.publicClient.multicall({ contracts })

        vaultAddresses.forEach((vaultAddress, i) => {
          const firstResultIndex = drawIds.length * i

          for (let j = 0; j < drawIds.length; j++) {
            const data = multicallResults[firstResultIndex + j]

            if (!!data && data.status === 'success') {
              const vaultId = getVaultId({ chainId: prizePool.chainId, address: vaultAddress })
              const drawId = j + 1
              const supplyTwab = (data.result as any as [bigint, bigint])[1]

              if (supplyTwabs[vaultId] === undefined) {
                supplyTwabs[vaultId] = []
              }

              supplyTwabs[vaultId].push({ drawId, supplyTwab })
            }
          }
        })
      }

      return supplyTwabs
    },
    enabled: !!prizePool && !!vaultAddresses.length && !!lastAwardedDrawId,
    ...NO_REFETCH
  })
}

const getCalls = (
  prizePoolAddress: Address,
  vaultAddress: Address,
  drawIds: number[]
): ContractFunctionParameters<typeof prizePoolABI>[] => {
  return drawIds.map((drawId) => ({
    address: prizePoolAddress,
    abi: prizePoolABI,
    functionName: 'getVaultUserBalanceAndTotalSupplyTwab',
    args: [vaultAddress, zeroAddress, drawId, drawId]
  }))
}
