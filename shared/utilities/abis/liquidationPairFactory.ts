export const liquidationPairFactoryABI = [
  {
    constant: false,
    inputs: [
      { name: '_source', type: 'address' },
      { name: '_tokenIn', type: 'address' },
      { name: '_tokenOut', type: 'address' },
      { name: '_periodLength', type: 'uint32' },
      { name: '_periodOffset', type: 'uint32' },
      { name: '_targetFirstSaleTime', type: 'uint32' },
      { name: '_decayConstant', type: 'int256' },
      { name: '_initialAmountIn', type: 'uint112' },
      { name: '_initialAmountOut', type: 'uint112' },
      { name: '_minimumAuctionAmount', type: 'uint256' }
    ],
    name: 'createPair',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'pair', type: 'address' },
      { indexed: true, internalType: 'address', name: 'source', type: 'address' },
      { indexed: true, internalType: 'address', name: 'tokenIn', type: 'address' },
      { indexed: true, internalType: 'address', name: 'tokenOut', type: 'address' },
      { indexed: true, internalType: 'uint32', name: 'periodLength', type: 'uint32' },
      { indexed: true, internalType: 'uint32', name: 'periodOffset', type: 'uint32' },
      { indexed: true, internalType: 'uint32', name: 'targetFirstSaleTime', type: 'uint32' },
      { indexed: true, internalType: 'int256', name: 'decayConstant', type: 'int256' },
      { indexed: true, internalType: 'uint112', name: 'initialAmountIn', type: 'uint112' },
      { indexed: true, internalType: 'uint112', name: 'initialAmountOut', type: 'uint112' },
      { indexed: true, internalType: 'uint256', name: 'minimumAuctionAmount', type: 'uint256' }
    ],
    name: 'PairCreated',
    type: 'event'
  }
] as const
