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
  }
] as const
