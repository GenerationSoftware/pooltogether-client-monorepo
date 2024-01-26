import { createPublicClient, formatUnits, http } from 'viem'
import {
  RPC_URLS,
  USD_PRICE_REF,
  V4_NETWORKS,
  V4_TICKET_ABI,
  V4_TICKETS,
  VIEM_CHAINS
} from './constants'
import { getTokenPrices } from './prices'
import { getPaginatedV4SubgraphUserData, getV4SubgraphPrizeData } from './subgraphs'
import { ProtocolStats } from './types'

export const getV4Stats = async (): Promise<ProtocolStats> => {
  let users = 0
  let tvlUsd = 0
  let awardedUsd = 0

  await Promise.all(
    V4_NETWORKS.map(async (network) => {
      const networkUsers = await getUserCount(network)
      const networkTvlUsd = await getTvl(network)
      const networkAwardedUsd = await getPrizesAwarded(network)

      users += networkUsers
      tvlUsd += networkTvlUsd
      awardedUsd += networkAwardedUsd
    })
  )

  const usdTokenPrice = (await getTokenPrices(USD_PRICE_REF.chainId, [USD_PRICE_REF.address]))?.[
    USD_PRICE_REF.address
  ]

  const tvl = { eth: tvlUsd * usdTokenPrice, usd: tvlUsd }
  const awarded = { eth: awardedUsd * usdTokenPrice, usd: awardedUsd }

  return { current: { users, tvl }, awarded }
}

const getUserCount = async (chainId: (typeof V4_NETWORKS)[number]) => {
  const userData = await getPaginatedV4SubgraphUserData(chainId)
  return userData.length
}

const getTvl = async (chainId: (typeof V4_NETWORKS)[number]) => {
  const totalSupply = await getV4TicketTotalSupply(chainId)
  return totalSupply ?? 0
}

const getPrizesAwarded = async (chainId: (typeof V4_NETWORKS)[number]) => {
  const prizeData = await getV4SubgraphPrizeData(chainId)
  return parseFloat(formatUnits(prizeData.totalClaimed, V4_TICKETS[chainId].decimals))
}

const getV4TicketTotalSupply = async (chainId: (typeof V4_NETWORKS)[number]) => {
  if (!!RPC_URLS[chainId]) {
    const publicClient = createPublicClient({
      chain: VIEM_CHAINS[chainId],
      transport: http(RPC_URLS[chainId])
    })

    const totalSupply = await publicClient.readContract({
      address: V4_TICKETS[chainId].address,
      abi: V4_TICKET_ABI,
      functionName: 'totalSupply'
    })

    return parseFloat(formatUnits(totalSupply, V4_TICKETS[chainId].decimals))
  }
}
