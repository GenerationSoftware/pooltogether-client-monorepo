import {
  calculatePercentageOfBigInt,
  GasCostEstimates,
  NETWORK,
  NULL_ADDRESS
} from '@pooltogether/hyperstructure-client-js'
import { useMemo } from 'react'
import { formatUnits, parseUnits } from 'viem'
import { useGasPrices, useTokenPrices } from '..'

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

  const { data: gasPrices, isFetched: isFetchedGasPrices } = useGasPrices(chainId, refetchInterval)

  const isFetched = isFetchedTokenPrices && isFetchedGasPrices

  if (isFetched && tokenPrice && !!gasPrices) {
    const gasPriceWei =
      (BigInt(Math.round(gasPrices.ProposeGasPrice * 1_000)) * parseUnits('1', 9)) / BigInt(1_000)
    const totalGasWei = gasPriceWei * gasAmount

    const totalGasEth = Number(
      formatUnits(calculatePercentageOfBigInt(totalGasWei, tokenPrice), 18)
    )

    return { data: { totalGasWei, totalGasEth }, isFetched }
  } else {
    return { isFetched: false }
  }
}
