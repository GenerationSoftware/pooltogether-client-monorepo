export interface PromotionInfo {
  creator: `0x${string}`
  startTimestamp: bigint
  numberOfEpochs: number
  vault: `0x${string}`
  epochDuration: number
  createdAt: number
  token: `0x${string}`
  tokensPerEpoch: bigint
  rewardsUnclaimed: bigint
}

export interface PartialPromotionInfo {
  creator?: `0x${string}`
  startTimestamp: bigint
  numberOfEpochs?: number
  vault: `0x${string}`
  epochDuration: number
  createdAt?: number
  createdAtBlockNumber: bigint
  token: `0x${string}`
  tokensPerEpoch: bigint
  rewardsUnclaimed?: bigint
}

export interface PoolWidePromotionInfo {
  creator: `0x${string}`
  startTimestamp: bigint
  numberOfEpochs: number
  epochDuration: number
  createdAt: number
  token: `0x${string}`
  tokensPerEpoch: bigint
  rewardsUnclaimed: bigint
}

export interface PartialPoolWidePromotionInfo extends PartialPromotionInfo {
  vaultTokensPerEpoch: bigint[]
}
