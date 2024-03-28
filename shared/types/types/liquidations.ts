export interface PairCreateInfo {
  chainId: number
  source: `0x${string}`
  tokenIn: `0x${string}`
  tokenOut: `0x${string}`
  targetAuctionPeriod: number
  targetAuctionPrice: bigint
  smoothingFactor: number
}
