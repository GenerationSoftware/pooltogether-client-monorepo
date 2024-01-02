import { GasCostEstimates } from '@shared/types'
import {
  calculatePercentageOfBigInt,
  DOLPHIN_ADDRESS,
  NETWORK,
  OP_GAS_ORACLE_ADDRESS,
  opGasOracleABI
} from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Abi, encodeFunctionData, formatUnits, PublicClient } from 'viem'
import { usePublicClient } from 'wagmi'
import { NO_REFETCH, QUERY_KEYS, useGasPrice, useTokenPrices } from '..'

/**
 * Returns gas cost estimates in wei and ETH
 *
 * NOTE: Include `tx` in `options` for accurate L2 gas cost estimates
 * @param chainId chain ID to get gas prices from
 * @param gasAmount the amount of gas estimated to be used
 * @param options optional settings
 * @returns
 */
export const useGasCostEstimates = (
  chainId: NETWORK,
  gasAmount: bigint,
  options?: {
    tx?: { abi: Abi; functionName: string; args: any[] }
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

  const { data: gasPrice, isFetched: isFetchedGasPrice } = useGasPrice(
    chainId,
    options?.refetchInterval
  )

  const txData = !!options?.tx ? encodeFunctionData(options.tx) : undefined
  const queryKey = [QUERY_KEYS.gasCostRollup, chainId, txData]

  // TODO: include Arbitrum logic for L1 fee (should be similar to OP)
  const { data: txL1GasCost, isFetched: isFetchedTxL1GasCost } = useQuery(
    queryKey,
    async () => {
      if (!!txData) {
        if (chainId === NETWORK.optimism || chainId === NETWORK.optimism_sepolia) {
          return await getOpL1GasAmount(publicClient, txData)
        }
      }

      return 0n
    },
    {
      enabled: !!chainId && !!txData,
      ...NO_REFETCH
    }
  )

  const isFetched =
    isFetchedTokenPrices && isFetchedGasPrice && (!options?.tx || isFetchedTxL1GasCost)

  const data: GasCostEstimates | undefined = useMemo(() => {
    if (isFetched && !!gasAmount && !!tokenPrice && !!gasPrice) {
      const totalGasWei = gasPrice * gasAmount + (txL1GasCost ?? 0n)
      const totalGasEth = Number(
        formatUnits(calculatePercentageOfBigInt(totalGasWei, tokenPrice), 18)
      )
      return { totalGasWei, totalGasEth }
    }
  }, [gasAmount, tokenPrice, gasPrice, txL1GasCost])

  return { data, isFetched }
}

const getOpL1GasAmount = async (publicClient: PublicClient, txData: `0x${string}`) => {
  return await publicClient.readContract({
    address: OP_GAS_ORACLE_ADDRESS,
    abi: opGasOracleABI,
    functionName: 'getL1Fee',
    args: [txData]
  })
}
