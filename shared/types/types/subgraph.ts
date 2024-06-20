export interface SubgraphDraw {
  id: number
  prizeClaims: {
    id: string
    winner: `0x${string}`
    recipient: `0x${string}`
    vaultAddress: `0x${string}`
    tier: number
    prizeIndex: number
    payout: bigint
    claimReward: bigint
    claimRewardRecipient: `0x${string}`
    timestamp: number
    txHash: `0x${string}`
  }[]
}

export interface SubgraphPrize {
  id: string
  drawId: number
  vaultAddress: `0x${string}`
  tier: number
  prizeIndex: number
  payout: bigint
  claimReward: bigint
  claimRewardRecipient: `0x${string}`
  timestamp: number
  txHash: `0x${string}`
}

export interface SubgraphObservation {
  balance: bigint
  delegateBalance: bigint
  timestamp: number
  isNew: boolean
}
