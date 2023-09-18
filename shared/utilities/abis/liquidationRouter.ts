export const liquidationRouterABI = [
  {
    inputs: [
      { internalType: 'address', name: '_sender', type: 'address' },
      { internalType: 'uint256', name: '_amountIn', type: 'uint256' },
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'bytes', name: '_flashSwapData', type: 'bytes' }
    ],
    name: 'flashSwapCallback',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'contract LiquidationPair', name: '_liquidationPair', type: 'address' },
      { internalType: 'address', name: '_receiver', type: 'address' },
      { internalType: 'uint256', name: '_amountOut', type: 'uint256' },
      { internalType: 'uint256', name: '_amountInMax', type: 'uint256' },
      { internalType: 'uint256', name: '_deadline', type: 'uint256' }
    ],
    name: 'swapExactAmountOut',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'contract LiquidationPairFactory',
        name: 'liquidationPairFactory',
        type: 'address'
      }
    ],
    name: 'LiquidationRouterCreated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'contract LiquidationPair',
        name: 'liquidationPair',
        type: 'address'
      },
      { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
      { indexed: true, internalType: 'address', name: 'receiver', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amountOut', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'amountInMax', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'amountIn', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'deadline', type: 'uint256' }
    ],
    name: 'SwappedExactAmountOut',
    type: 'event'
  },
  {
    inputs: [{ internalType: 'address', name: 'sender', type: 'address' }],
    name: 'InvalidSender',
    type: 'error'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'deadline', type: 'uint256' }],
    name: 'SwapExpired',
    type: 'error'
  },
  { inputs: [], name: 'UndefinedLiquidationPairFactory', type: 'error' },
  {
    inputs: [
      { internalType: 'contract LiquidationPair', name: 'liquidationPair', type: 'address' }
    ],
    name: 'UnknownLiquidationPair',
    type: 'error'
  }
] as const
