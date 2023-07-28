export interface PairCreateInfo {
  chainId: number
  source: `0x${string}`
  tokenIn: `0x${string}`
  tokenOut: `0x${string}`
  periodLength: number
  periodOffset: number
  targetFirstSaleTime: number
  decayConstant: bigint
  initialAmountIn: bigint
  initialAmountOut: bigint
  minimumAuctionAmount: bigint
}
