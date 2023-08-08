export const liquidationPairFactoryABI = [
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'allPairs',
    outputs: [{ internalType: 'contract LiquidationPair', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'contract ILiquidationSource', name: '_source', type: 'address' },
      { internalType: 'address', name: '_tokenIn', type: 'address' },
      { internalType: 'address', name: '_tokenOut', type: 'address' },
      { internalType: 'uint32', name: '_periodLength', type: 'uint32' },
      { internalType: 'uint32', name: '_periodOffset', type: 'uint32' },
      { internalType: 'uint32', name: '_targetFirstSaleTime', type: 'uint32' },
      { internalType: 'SD59x18', name: '_decayConstant', type: 'int256' },
      { internalType: 'uint112', name: '_initialAmountIn', type: 'uint112' },
      { internalType: 'uint112', name: '_initialAmountOut', type: 'uint112' },
      { internalType: 'uint256', name: '_minimumAuctionAmount', type: 'uint256' }
    ],
    name: 'createPair',
    outputs: [{ internalType: 'contract LiquidationPair', name: '', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'contract LiquidationPair', name: '', type: 'address' }],
    name: 'deployedPairs',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'totalPairs',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'contract LiquidationPair', name: 'pair', type: 'address' },
      {
        indexed: false,
        internalType: 'contract ILiquidationSource',
        name: 'source',
        type: 'address'
      },
      { indexed: false, internalType: 'address', name: 'tokenIn', type: 'address' },
      { indexed: false, internalType: 'address', name: 'tokenOut', type: 'address' },
      { indexed: false, internalType: 'uint32', name: 'periodLength', type: 'uint32' },
      { indexed: false, internalType: 'uint32', name: 'periodOffset', type: 'uint32' },
      { indexed: false, internalType: 'uint32', name: 'targetFirstSaleTime', type: 'uint32' },
      { indexed: false, internalType: 'SD59x18', name: 'decayConstant', type: 'int256' },
      { indexed: false, internalType: 'uint112', name: 'initialAmountIn', type: 'uint112' },
      { indexed: false, internalType: 'uint112', name: 'initialAmountOut', type: 'uint112' },
      { indexed: false, internalType: 'uint256', name: 'minimumAuctionAmount', type: 'uint256' }
    ],
    name: 'PairCreated',
    type: 'event'
  }
] as const
