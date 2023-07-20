import {
  calculatePercentageOfBigInt,
  GasCostEstimates,
  NETWORK,
  NULL_ADDRESS
} from '@pooltogether/hyperstructure-client-js'
import { formatUnits, parseUnits } from 'viem'
import { useGasPrices, useTokenPrices } from '..'

/**
 * Returns gas cost estimates in wei and ETH
 * @param chainId chain ID to get gas prices from
 * @param gasAmount amount of gas to be spent
 * @returns
 */
export const useGasCostEstimates = (
  chainId: NETWORK,
  gasAmount: bigint
): { data?: GasCostEstimates; isFetched: boolean } => {
  const { data: tokenPrices, isFetched: isFetchedTokenPrices } = useTokenPrices(chainId, [
    NULL_ADDRESS
  ])
  const tokenPrice = tokenPrices?.[NULL_ADDRESS]

  const { data: gasPrices, isFetched: isFetchedGasPrices } = useGasPrices(chainId)

  const isFetched = isFetchedTokenPrices && isFetchedGasPrices

  if (isFetched && tokenPrice && !!gasPrices) {
    const gasPriceWei =
      (BigInt(Math.round(gasPrices.ProposeGasPrice * 1_000)) * parseUnits('1', 9)) / BigInt(1_000)
    const totalGasWei = gasPriceWei * gasAmount

    const totalGasEth = formatUnits(calculatePercentageOfBigInt(totalGasWei, tokenPrice), 18)

    return { data: { totalGasWei, totalGasEth }, isFetched }
  } else {
    return { isFetched: false }
  }
}
