export interface ProtocolStats {
  uniqueWallets: number
  poolPrice: number
  tvl: number
  uniqueWinners: number
  totalPrizes: number
}

export interface PoolExplorerApiStats {
  totalPlayers: number
  pool: number
  tvl: { total: number }
  historicalWinners: number
}

export interface PoolExplorerApiHistory {
  i: number // Draw ID
  w: number // Winner Count
  p: number // Claimable Prize Count
  c: string // Claimable Prize Amount
  d: string // Dropped Prize Amount
  t: string // Total Prize Amount
}
