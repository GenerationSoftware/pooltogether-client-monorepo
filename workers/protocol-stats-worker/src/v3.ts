import { formatUnits } from 'viem'
import { USD_PRICE_REF, V3_NETWORKS, V3_TOKEN_PRICE_FALLBACKS } from './constants'
import { getTokenPrices } from './prices'
import { getPaginatedV3SubgraphPoolData, getPaginatedV3SubgraphUserData } from './subgraphs'
import { ProtocolStats } from './types'

export const getV3Stats = async (): Promise<ProtocolStats> => {
  let users = 0
  let tvlEth = 0
  let awardedEth = 0

  await Promise.all(
    V3_NETWORKS.map(async (network) => {
      const networkUsers = await getUserCount(network)
      const [networkTvlEth, networkAwardedEth] = await getPoolData(network)

      users += networkUsers
      tvlEth += networkTvlEth
      awardedEth += networkAwardedEth
    })
  )

  const usdTokenPrice = (await getTokenPrices(USD_PRICE_REF.chainId, [USD_PRICE_REF.address]))?.[
    USD_PRICE_REF.address
  ]

  const tvl = { eth: tvlEth, usd: tvlEth / usdTokenPrice }
  const awarded = { eth: awardedEth, usd: awardedEth / usdTokenPrice }

  return { current: { users, tvl }, awarded }
}

const getUserCount = async (chainId: (typeof V3_NETWORKS)[number]) => {
  const userData = await getPaginatedV3SubgraphUserData(chainId)
  return userData.length
}

const getPoolData = async (chainId: (typeof V3_NETWORKS)[number]): Promise<[number, number]> => {
  let tvl = 0
  let awarded = 0

  const poolData = await getPaginatedV3SubgraphPoolData(chainId)

  const tokenAddresses = new Set<Lowercase<`0x${string}`>>(
    poolData.map((p) => p.underlyingCollateralToken.toLowerCase() as Lowercase<`0x${string}`>)
  )
  const tokenPrices = await getTokenPrices(chainId, [...tokenAddresses])

  poolData.forEach((pool) => {
    const tokenAddress = pool.underlyingCollateralToken.toLowerCase() as Lowercase<`0x${string}`>
    const tokenPrice = tokenPrices[tokenAddress] || V3_TOKEN_PRICE_FALLBACKS[chainId][tokenAddress]

    if (!!tokenPrice) {
      const totalSupply = pool.controlledTokens.reduce((a, b) => a + b.totalSupply, 0n)
      const tokenBalance = parseFloat(formatUnits(totalSupply, pool.underlyingCollateralDecimals))

      const prizeAmount = parseFloat(
        formatUnits(pool.cumulativePrizeGross, pool.underlyingCollateralDecimals)
      )

      tvl += tokenBalance * tokenPrice
      awarded += prizeAmount * tokenPrice
    }
  })

  return [tvl, awarded]
}
