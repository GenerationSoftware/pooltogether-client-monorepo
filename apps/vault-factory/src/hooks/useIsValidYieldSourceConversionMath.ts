import { NO_REFETCH } from '@generationsoftware/hyperstructure-react-hooks'
import { vaultABI } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'

/**
 * Returns true or false depending on whether the conversion on withdraw/redeem amounts is accurate on a yield source
 * @param chainId the yield source's chain ID
 * @param address the yield source's address
 * @returns
 */
export const useIsValidYieldSourceConversionMath = (chainId: number, address: Address) => {
  const publicClient = usePublicClient({ chainId })

  return useQuery({
    queryKey: ['yieldSourceConversionChecks', chainId, address],
    queryFn: async () => {
      if (!!publicClient) {
        const valuesToCheck = Array.from(Array(19).keys()).map((i) => 10n ** BigInt(i))

        const blockNumber = await publicClient.getBlockNumber()

        const initialMulticallResults = await publicClient.multicall({
          contracts: [
            ...valuesToCheck.map((v) => ({
              address,
              abi: vaultABI,
              functionName: 'previewWithdraw',
              args: [v]
            })),
            ...valuesToCheck.map((v) => ({
              address,
              abi: vaultABI,
              functionName: 'previewRedeem',
              args: [v]
            }))
          ],
          blockNumber
        })

        const withdrawResults = initialMulticallResults
          .slice(0, valuesToCheck.length)
          .map((r) => r.result as bigint)
        const redeemResults = initialMulticallResults
          .slice(valuesToCheck.length)
          .map((r) => r.result as bigint)

        const testMulticallResults = await publicClient.multicall({
          contracts: [
            ...withdrawResults.map((v) => ({
              address,
              abi: vaultABI,
              functionName: 'previewRedeem',
              args: [v]
            })),
            ...redeemResults.map((v) => ({
              address,
              abi: vaultABI,
              functionName: 'previewWithdraw',
              args: [v]
            }))
          ],
          blockNumber
        })

        const foundInconsistency = valuesToCheck.find((v, i) => {
          if (testMulticallResults[i].status === 'success') {
            const result = testMulticallResults[i].result as bigint
            if (result < v) {
              return true
            }
          }

          if (testMulticallResults[valuesToCheck.length + i].status === 'success') {
            const result = testMulticallResults[valuesToCheck.length + i].result as bigint
            if (result > v) {
              return true
            }
          }
        })

        return !foundInconsistency
      }
    },
    enabled: !!chainId && !!address && !!publicClient,
    ...NO_REFETCH
  })
}
