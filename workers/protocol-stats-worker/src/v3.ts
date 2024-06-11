import { USD_PRICE_REF } from './constants'
import { getTokenPrices } from './prices'
import { ProtocolStats } from './types'

export const getV3Stats = async (): Promise<ProtocolStats> => {
  const users = 29_765 // Last Updated: June 11, 2024
  const tvlEth = 183.156 // Last Updated: June 11, 2024
  const awardedEth = 479.464 // Last Updated: June 11, 2024

  const usdTokenPrice = (await getTokenPrices(USD_PRICE_REF.chainId, [USD_PRICE_REF.address]))?.[
    USD_PRICE_REF.address
  ]

  const tvl = { eth: tvlEth, usd: tvlEth / usdTokenPrice }
  const awarded = { eth: awardedEth, usd: awardedEth / usdTokenPrice }

  return { current: { users, tvl }, awarded }
}
