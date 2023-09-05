import { GasCostEstimates } from '@shared/types'
import { calculatePercentageOfBigInt, NETWORK, NULL_ADDRESS } from '@shared/utilities'
import { useMemo } from 'react'
import { formatUnits } from 'viem'
import { useGasPrice, useTokenPrices } from '..'

/**
 * Returns gas cost estimates in wei and ETH
 * @param chainId chain ID to get gas prices from
 * @param gasAmount amount of gas to be spent
 * @param refetchInterval optional refetch interval in ms
 * @returns
 */
export const useGasCostEstimates = (
  chainId: NETWORK,
  gasAmount: bigint,
  refetchInterval?: number
): { data?: GasCostEstimates; isFetched: boolean } => {
  const { data: tokenPrices, isFetched: isFetchedTokenPrices } = useTokenPrices(chainId, [
    NULL_ADDRESS
  ])

  const tokenPrice = useMemo(() => {
    return tokenPrices?.[NULL_ADDRESS]
  }, [tokenPrices])

  const { data: gasPrice, isFetched: isFetchedGasPrice } = useGasPrice(chainId, refetchInterval)

  const isFetched = isFetchedTokenPrices && isFetchedGasPrice

  if (isFetched && tokenPrice && !!gasPrice) {
    const totalGasWei = gasPrice * gasAmount

    const totalGasEth = Number(
      formatUnits(calculatePercentageOfBigInt(totalGasWei, tokenPrice), 18)
    )

    return { data: { totalGasWei, totalGasEth }, isFetched }
  } else {
    return { isFetched: false }
  }
}
