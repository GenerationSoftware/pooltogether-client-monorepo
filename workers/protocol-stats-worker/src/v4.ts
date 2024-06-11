import { USD_PRICE_REF } from './constants'
import { getTokenPrices } from './prices'
import { ProtocolStats } from './types'

export const getV4Stats = async (): Promise<ProtocolStats> => {
  const users = 40_474 // Last Updated: June 11, 2024
  const tvlUsd = 1_984_022 // Last Updated: June 11, 2024
  const awardedUsd = 2_960_107 // Last Updated: June 11, 2024

  const usdTokenPrice = (await getTokenPrices(USD_PRICE_REF.chainId, [USD_PRICE_REF.address]))?.[
    USD_PRICE_REF.address
  ]

  const tvl = { eth: tvlUsd * usdTokenPrice, usd: tvlUsd }
  const awarded = { eth: awardedUsd * usdTokenPrice, usd: awardedUsd }

  return { current: { users, tvl }, awarded }
}
