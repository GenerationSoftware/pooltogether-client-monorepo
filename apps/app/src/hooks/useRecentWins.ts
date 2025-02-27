import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import {
  getSecondsSinceEpoch,
  lower,
  SECONDS_PER_MONTH,
  SUBGRAPH_API_URLS
} from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'

export const useRecentWins = (
  prizePool: PrizePool,
  options?: {
    vaultAddress?: Address
    numWins?: number
    fromTimestamp?: number
  }
) => {
  const numWins = options?.numWins ?? 100

  return useQuery({
    queryKey: [
      'recentWins',
      prizePool?.id,
      !!options?.vaultAddress ? lower(options.vaultAddress) : undefined,
      numWins,
      options?.fromTimestamp
    ],
    queryFn: async () => {
      const subgraphUrl = SUBGRAPH_API_URLS[prizePool.chainId as keyof typeof SUBGRAPH_API_URLS]

      if (!subgraphUrl) {
        console.warn(`Could not find subgraph URL for chain ID: ${prizePool.chainId}`)
        return []
      }

      const headers = { 'Content-Type': 'application/json' }

      const body = JSON.stringify({
        query: `query($numWins: Int, $fromTimestamp: Int, $vaultAddress: Bytes, $orderBy: PrizeClaim_orderBy, $orderDirection: OrderDirection) {
          prizeClaims(first: $numWins, where: { payout_gt: 0, timestamp_gt: $fromTimestamp, prizeVault_contains: $vaultAddress } orderBy: $orderBy, orderDirection: $orderDirection) {
            winner
            payout
            timestamp
          }
        }`,
        variables: {
          numWins,
          fromTimestamp: options?.fromTimestamp ?? getSecondsSinceEpoch() - SECONDS_PER_MONTH,
          vaultAddress: options?.vaultAddress ?? '',
          orderBy: 'payout',
          orderDirection: 'desc'
        }
      })

      const result = await fetch(subgraphUrl, { method: 'POST', headers, body })
      const jsonData = await result.json()
      const wins: { winner: string; payout: string; timestamp: string }[] =
        jsonData?.data?.prizeClaims ?? []

      const formattedWins = wins.map((win) => ({
        winner: win.winner as Address,
        payout: BigInt(win.payout),
        timestamp: parseInt(win.timestamp)
      }))

      return formattedWins
    },
    enabled: !!prizePool,
    ...NO_REFETCH
  })
}
