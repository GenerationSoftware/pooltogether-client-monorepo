export const liquidationPairFactoryABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'contract TpdaLiquidationPair',
        name: 'pair',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'contract ILiquidationSource',
        name: 'source',
        type: 'address'
      },
      { indexed: true, internalType: 'address', name: 'tokenIn', type: 'address' },
      { indexed: true, internalType: 'address', name: 'tokenOut', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'targetAuctionPeriod', type: 'uint256' },
      { indexed: false, internalType: 'uint192', name: 'minimumAuctionAmount', type: 'uint192' },
      { indexed: false, internalType: 'uint256', name: 'smoothingFactor', type: 'uint256' }
    ],
    name: 'PairCreated',
    type: 'event'
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'allPairs',
    outputs: [{ internalType: 'contract TpdaLiquidationPair', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'contract ILiquidationSource', name: '_source', type: 'address' },
      { internalType: 'address', name: '_tokenIn', type: 'address' },
      { internalType: 'address', name: '_tokenOut', type: 'address' },
      { internalType: 'uint256', name: '_targetAuctionPeriod', type: 'uint256' },
      { internalType: 'uint192', name: '_minimumAuctionAmount', type: 'uint192' },
      { internalType: 'uint256', name: '_smoothingFactor', type: 'uint256' }
    ],
    name: 'createPair',
    outputs: [{ internalType: 'contract TpdaLiquidationPair', name: '', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'contract TpdaLiquidationPair', name: '', type: 'address' }],
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
  }
] as const
