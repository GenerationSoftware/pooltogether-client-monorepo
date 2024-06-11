export type AggregatedProtocolStats = {
  total: ProtocolStats
  v3?: ProtocolStats
  v4?: ProtocolStats
  v5?: ProtocolStats
}

export interface ProtocolStats {
  current: { users: number; tvl: { eth: number; usd: number } }
  awarded: { eth: number; usd: number }
}

export interface V5SubgraphUserData {
  id: string
}

export interface V5SubgraphVaultData {
  id: string
  address: `0x${string}`
  balance: bigint
}

export interface V5SubgraphPrizeData {
  id: string
  payout: bigint
}

export interface TokenPricesApiResponse {
  [address: `0x${string}`]: [{ date: string; price: number }]
}
