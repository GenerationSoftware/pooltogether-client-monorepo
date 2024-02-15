import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { Abi, EstimateContractGasParameters } from 'viem'
import { usePublicClient } from 'wagmi'
import { QUERY_KEYS } from '../constants'

/**
 * Returns a gas amount estimate for a contract write
 * @param chainId chain ID
 * @param tx transaction parameters to get gas amount estimate for
 * @param options optional settings
 * @returns
 */
export const useGasAmountEstimate = <TAbi extends Abi>(
  chainId: number,
  tx: EstimateContractGasParameters<TAbi>,
  options?: {
    enabled?: boolean
  }
): UseQueryResult<bigint, unknown> => {
  const publicClient = usePublicClient({ chainId })

  const _enabled =
    !!chainId &&
    !!publicClient &&
    !!tx &&
    !!tx.account &&
    (options?.enabled || options?.enabled === undefined)

  const formattedArgs = ((tx?.args as any[] | undefined)
    ?.filter((a) => typeof a === 'string' || typeof a === 'number' || typeof a === 'bigint')
    .map((a) => (typeof a === 'string' ? a : a.toString())) ?? []) as string[]

  const queryKey = [
    QUERY_KEYS.gasAmountEstimates,
    chainId,
    tx?.address,
    tx?.functionName,
    formattedArgs
  ]

  return useQuery(
    queryKey,
    async () => {
      if (!!publicClient) {
        return await publicClient.estimateContractGas(tx)
      }
    },
    {
      enabled: _enabled,
      ...NO_REFETCH
    }
  )
}
