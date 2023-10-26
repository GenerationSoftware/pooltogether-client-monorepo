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
