import { GasCostEstimates } from '@shared/types'
import {
  calculatePercentageOfBigInt,
  DOLPHIN_ADDRESS,
  getGasFeeEstimate,
  NETWORK
} from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { formatUnits } from 'viem'
import { usePublicClient } from 'wagmi'
import { NO_REFETCH, QUERY_KEYS, useTokenPrices } from '..'

/**
 * Returns gas cost estimates in wei and ETH
 * @param chainId chain ID to get gas cost estimates for
 * @param tx the transaction to estimate gas costs for
 * @param options optional settings
 * @returns
 */
export const useGasCostEstimates = (
  chainId: NETWORK,
  tx: Parameters<typeof getGasFeeEstimate>[1],
  options?: {
    gasAmount?: bigint
    enabled?: boolean
    refetchInterval?: number
  }
) => {
  const publicClient = usePublicClient({ chainId })

  const { data: tokenPrices, isFetched: isFetchedTokenPrices } = useTokenPrices(chainId, [
    DOLPHIN_ADDRESS
  ])

  const tokenPrice = useMemo(() => {
    return tokenPrices?.[DOLPHIN_ADDRESS]
  }, [tokenPrices])

  const queryKey = [
    QUERY_KEYS.gasFeeEstimate,
    chainId,
    tx?.address,
    tx?.functionName,
    tx?.args?.map(String),
    tx?.account
  ]

  const { data: gasFeeEstimate, isFetched: isFetchedGasFeeEstimate } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!!publicClient) {
        return await getGasFeeEstimate(publicClient, tx, { gasAmount: options?.gasAmount })
      }
    },
    enabled: !!chainId && !!publicClient && !!tx && options?.enabled !== false,
    ...NO_REFETCH,
    refetchInterval: options?.refetchInterval ?? false
  })

  const isFetched = isFetchedTokenPrices && isFetchedGasFeeEstimate

  const data: GasCostEstimates | undefined = useMemo(() => {
    if (isFetched && tokenPrice !== undefined && gasFeeEstimate !== undefined) {
      return {
        totalGasWei: gasFeeEstimate,
        totalGasEth: parseFloat(
          formatUnits(calculatePercentageOfBigInt(gasFeeEstimate, tokenPrice), 18)
        )
      }
    }
  }, [isFetched, tokenPrice, gasFeeEstimate])

  return { data, isFetched }
}
