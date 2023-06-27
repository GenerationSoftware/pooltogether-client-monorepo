export interface PrizeInfo {
  amount: bigint
  dailyFrequency: number
}

export interface SubgraphPrizePoolDraw {
  id: string
  prizeClaims: {
    id: string
    winner: { id: string }
    tier: number
    payout: string
    fee: string
    feeRecipient: { id: string }
    timestamp: string
  }[]
}

export interface SubgraphPrizePoolAccount {
  id: string
  prizesReceived: {
    id: string
    draw: { id: string }
    tier: number
    payout: string
    fee: string
    feeRecipient: { id: string }
    timestamp: string
  }[]
}
