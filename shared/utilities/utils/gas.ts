import { PoolTogetherApiGasPrices } from '@shared/types'
import { POOLTOGETHER_API_URL } from '../constants'

/**
 * Returns gas prices for a given chain ID
 * @param chainId chain ID to get gas prices for
 * @returns
 */
export const getGasPrices = async (chainId: number) => {
  const result = await fetch(`${POOLTOGETHER_API_URL}/gas/${chainId}`)
  const jsonData = await result.json()
  const gasPrices: PoolTogetherApiGasPrices = jsonData?.result
  return gasPrices
}
