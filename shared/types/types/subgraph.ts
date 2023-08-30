export interface SubgraphDraw {
  id: number
  prizeClaims: {
    id: string
    winner: `0x${string}`
    recipient: `0x${string}`
    tier: number
    prizeIndex: number
    payout: bigint
    fee: bigint
    feeRecipient: `0x${string}`
    timestamp: number
  }[]
}

export interface SubgraphDrawTimestamp {
  id: number
  timestamp: number
}

export interface SubgraphPrize {
  id: string
  drawId: number
  tier: number
  prizeIndex: number
  payout: bigint
  fee: bigint
  feeRecipient: `0x${string}`
  timestamp: number
}

export interface SubgraphObservation {
  balance: bigint
  delegateBalance: bigint
  timestamp: number
  isNew: boolean
}
