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
import {
  Abi,
  encodeFunctionData,
  EstimateContractGasParameters,
  formatUnits,
  PublicClient
} from 'viem'
import { usePublicClient } from 'wagmi'
import { NO_REFETCH, QUERY_KEYS, useGasAmountEstimate, useGasPrice, useTokenPrices } from '..'

/**
 * Returns gas cost estimates in wei and ETH
 * @param chainId chain ID to get gas prices from
 * @param config either `gasAmount` or `tx` data
 * @param options optional settings
 * @returns
 */
export const useGasCostEstimates = <TAbi extends Abi>(
  chainId: NETWORK,
  config: {
    gasAmount?: bigint
    tx?: EstimateContractGasParameters<TAbi>
  },
  options?: {
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

  const { data: txGasAmount, isFetched: isFetchedTxGasAmount } = useGasAmountEstimate(
    chainId,
    config?.tx as EstimateContractGasParameters<TAbi>
  )

  const formattedArgs = ((config?.tx?.args as any[] | undefined)
    ?.filter((a) => typeof a === 'string' || typeof a === 'number' || typeof a === 'bigint')
    .map((a) => (typeof a === 'string' ? a : a.toString())) ?? []) as string[]

  const queryKey = [
    QUERY_KEYS.gasAmountEstimatesRollup,
    chainId,
    config?.tx?.address,
    config?.tx?.functionName,
    formattedArgs
  ]

  // TODO: include Arbitrum logic for L1 fee (should be similar to OP)
  const { data: txGasAmountRollup, isFetched: isFetchedTxGasAmountRollup } = useQuery(
    queryKey,
    async () => {
      if (!!config?.tx) {
        if (
          chainId === NETWORK.optimism ||
          chainId === NETWORK['optimism-goerli'] ||
          chainId === NETWORK['optimism-sepolia']
        ) {
          // @ts-ignore
          const txData = encodeFunctionData({
            abi: config.tx.abi,
            functionName: config.tx.functionName,
            args: config.tx.args
          })
          const l1Fee = await getOpL1GasAmount(publicClient, txData)
          return l1Fee
        }
      }

      return 0n
    },
    {
      enabled: !!chainId && !!config?.tx,
      ...NO_REFETCH
    }
  )

  const isFetched =
    isFetchedTokenPrices &&
    isFetchedGasPrice &&
    ((!!config && !!config.tx && isFetchedTxGasAmount && isFetchedTxGasAmountRollup) ||
      !!config.gasAmount)

  const data: GasCostEstimates | undefined = useMemo(() => {
    if (isFetched && !!tokenPrice && !!gasPrice) {
      const gasAmount =
        !!txGasAmount && txGasAmountRollup !== undefined
          ? txGasAmount + txGasAmountRollup
          : config.gasAmount

      if (!!gasAmount) {
        const totalGasWei = gasPrice * gasAmount
        const totalGasEth = Number(
          formatUnits(calculatePercentageOfBigInt(totalGasWei, tokenPrice), 18)
        )
        return { totalGasWei, totalGasEth }
      }
    }
  }, [config, tokenPrice, gasPrice, txGasAmount, txGasAmountRollup])

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
