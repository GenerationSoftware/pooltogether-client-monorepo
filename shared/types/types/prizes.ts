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

export interface Prize {
  chainId: number
  drawId: number
  vault: `0x${string}`
  winner: `0x${string}`
  tier: number
  prizeIndex: number
  amount?: bigint
}

export interface Win {
  chainId: number
  drawId: number
  vault: `0x${string}`
  payout: bigint
  txHash: `0x${string}`
  timestamp: number
}
