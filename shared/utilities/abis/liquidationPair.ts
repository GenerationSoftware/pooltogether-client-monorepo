export const liquidationPairABI = [
  {
    inputs: [],
    name: 'amountInForPeriod',
    outputs: [{ internalType: 'uint104', name: '', type: 'uint104' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'amountOutForPeriod',
    outputs: [{ internalType: 'uint104', name: '', type: 'uint104' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: '_amountOut', type: 'uint256' }],
    name: 'computeExactAmountIn',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'decayConstant',
    outputs: [{ internalType: 'SD59x18', name: '', type: 'int256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'emissionRate',
    outputs: [{ internalType: 'SD59x18', name: '', type: 'int256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'firstPeriodStartsAt',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getElapsedTime',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getPeriodEnd',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getPeriodStart',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'initialPrice',
    outputs: [{ internalType: 'SD59x18', name: '', type: 'int256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'lastAuctionTime',
    outputs: [{ internalType: 'uint48', name: '', type: 'uint48' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'lastNonZeroAmountIn',
    outputs: [{ internalType: 'uint112', name: '', type: 'uint112' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'lastNonZeroAmountOut',
    outputs: [{ internalType: 'uint112', name: '', type: 'uint112' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'maxAmountIn',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'maxAmountOut',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'minimumAuctionAmount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'periodLength',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'source',
    outputs: [{ internalType: 'contract ILiquidationSource', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_receiver', type: 'address' },
      { internalType: 'uint256', name: '_amountOut', type: 'uint256' },
      { internalType: 'uint256', name: '_amountInMax', type: 'uint256' },
      { internalType: 'bytes', name: '_flashSwapData', type: 'bytes' }
    ],
    name: 'swapExactAmountOut',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'target',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'targetFirstSaleTime',
    outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'tokenIn',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'tokenOut',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint104', name: 'lastNonZeroAmountIn', type: 'uint104' },
      { indexed: false, internalType: 'uint104', name: 'lastNonZeroAmountOut', type: 'uint104' },
      { indexed: false, internalType: 'uint48', name: 'lastAuctionTime', type: 'uint48' },
      { indexed: true, internalType: 'uint48', name: 'period', type: 'uint48' },
      { indexed: false, internalType: 'SD59x18', name: 'emissionRate', type: 'int256' },
      { indexed: false, internalType: 'SD59x18', name: 'initialPrice', type: 'int256' }
    ],
    name: 'StartedAuction',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
      { indexed: true, internalType: 'address', name: 'receiver', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amountOut', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'amountInMax', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'amountIn', type: 'uint256' },
      { indexed: false, internalType: 'bytes', name: 'flashSwapData', type: 'bytes' }
    ],
    name: 'SwappedExactAmountOut',
    type: 'event'
  },
  { inputs: [], name: 'AmountInZero', type: 'error' },
  { inputs: [], name: 'AmountOutZero', type: 'error' },
  {
    inputs: [
      { internalType: 'SD59x18', name: 'maxDecayConstant', type: 'int256' },
      { internalType: 'SD59x18', name: 'decayConstant', type: 'int256' }
    ],
    name: 'DecayConstantTooLarge',
    type: 'error'
  },
  { inputs: [], name: 'EmissionRateIsZero', type: 'error' },
  { inputs: [], name: 'LiquidationSourceZeroAddress', type: 'error' },
  {
    inputs: [
      { internalType: 'uint256', name: 'x', type: 'uint256' },
      { internalType: 'uint256', name: 'y', type: 'uint256' }
    ],
    name: 'PRBMath_MulDiv18_Overflow',
    type: 'error'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'x', type: 'uint256' },
      { internalType: 'uint256', name: 'y', type: 'uint256' },
      { internalType: 'uint256', name: 'denominator', type: 'uint256' }
    ],
    name: 'PRBMath_MulDiv_Overflow',
    type: 'error'
  },
  {
    inputs: [{ internalType: 'SD59x18', name: 'x', type: 'int256' }],
    name: 'PRBMath_SD59x18_Ceil_Overflow',
    type: 'error'
  },
  {
    inputs: [{ internalType: 'int256', name: 'x', type: 'int256' }],
    name: 'PRBMath_SD59x18_Convert_Overflow',
    type: 'error'
  },
  {
    inputs: [{ internalType: 'int256', name: 'x', type: 'int256' }],
    name: 'PRBMath_SD59x18_Convert_Underflow',
    type: 'error'
  },
  { inputs: [], name: 'PRBMath_SD59x18_Div_InputTooSmall', type: 'error' },
  {
    inputs: [
      { internalType: 'SD59x18', name: 'x', type: 'int256' },
      { internalType: 'SD59x18', name: 'y', type: 'int256' }
    ],
    name: 'PRBMath_SD59x18_Div_Overflow',
    type: 'error'
  },
  {
    inputs: [{ internalType: 'SD59x18', name: 'x', type: 'int256' }],
    name: 'PRBMath_SD59x18_Exp2_InputTooBig',
    type: 'error'
  },
  {
    inputs: [{ internalType: 'SD59x18', name: 'x', type: 'int256' }],
    name: 'PRBMath_SD59x18_Exp_InputTooBig',
    type: 'error'
  },
  { inputs: [], name: 'PRBMath_SD59x18_Mul_InputTooSmall', type: 'error' },
  {
    inputs: [
      { internalType: 'SD59x18', name: 'x', type: 'int256' },
      { internalType: 'SD59x18', name: 'y', type: 'int256' }
    ],
    name: 'PRBMath_SD59x18_Mul_Overflow',
    type: 'error'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'amountOut', type: 'uint256' }],
    name: 'PurchasePriceIsZero',
    type: 'error'
  },
  { inputs: [], name: 'ReceiverIsZero', type: 'error' },
  {
    inputs: [
      { internalType: 'uint256', name: 'amountOut', type: 'uint256' },
      { internalType: 'uint256', name: 'available', type: 'uint256' }
    ],
    name: 'SwapExceedsAvailable',
    type: 'error'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'amountInMax', type: 'uint256' },
      { internalType: 'uint256', name: 'amountIn', type: 'uint256' }
    ],
    name: 'SwapExceedsMax',
    type: 'error'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'passedTargetSaleTime', type: 'uint256' },
      { internalType: 'uint256', name: 'periodLength', type: 'uint256' }
    ],
    name: 'TargetFirstSaleTimeGePeriodLength',
    type: 'error'
  },
  { inputs: [], name: 'TokenInZeroAddress', type: 'error' },
  { inputs: [], name: 'TokenOutZeroAddress', type: 'error' }
] as const
