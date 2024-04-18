export const liquidationPairABI = [
  {
    inputs: [
      { internalType: 'contract ILiquidationSource', name: '_source', type: 'address' },
      { internalType: 'address', name: '__tokenIn', type: 'address' },
      { internalType: 'address', name: '__tokenOut', type: 'address' },
      { internalType: 'uint64', name: '_targetAuctionPeriod', type: 'uint64' },
      { internalType: 'uint192', name: '_targetAuctionPrice', type: 'uint192' },
      { internalType: 'uint256', name: '_smoothingFactor', type: 'uint256' }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'requested', type: 'uint256' },
      { internalType: 'uint256', name: 'available', type: 'uint256' }
    ],
    name: 'InsufficientBalance',
    type: 'error'
  },
  { inputs: [], name: 'ReceiverIsZero', type: 'error' },
  { inputs: [], name: 'SmoothingGteOne', type: 'error' },
  {
    inputs: [
      { internalType: 'uint256', name: 'amountInMax', type: 'uint256' },
      { internalType: 'uint256', name: 'amountIn', type: 'uint256' }
    ],
    name: 'SwapExceedsMax',
    type: 'error'
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
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'computeExactAmountIn',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'price', type: 'uint256' }],
    name: 'computeTimeForPrice',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'lastAuctionAt',
    outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'lastAuctionPrice',
    outputs: [{ internalType: 'uint192', name: '', type: 'uint192' }],
    stateMutability: 'view',
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
    name: 'smoothingFactor',
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
    name: 'targetAuctionPeriod',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
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
  }
] as const
