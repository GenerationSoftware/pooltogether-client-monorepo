export interface PrizeInfo {
  amount: { current: bigint; estimated: bigint }
  dailyFrequency: number
}

export interface DrawWithTimestamps {
  id: number
  openedAt: number
  closedAt: number
  finalizedAt: number
}

export type DrawStatus = 'open' | 'closed' | 'awarded' | 'finalized'

export interface Win {
  chainId: number
  drawId: number
  payout: bigint
  txHash: `0x${string}`
  timestamp: number
}
