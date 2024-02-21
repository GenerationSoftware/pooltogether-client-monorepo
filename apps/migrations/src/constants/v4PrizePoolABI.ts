export const v4PrizePoolABI = [
  {
    inputs: [],
    name: 'getTicket',
    outputs: [{ internalType: 'contract ITicket', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getToken',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_from', type: 'address' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' }
    ],
    name: 'withdrawFrom',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'yieldSource',
    outputs: [{ internalType: 'contract IYieldSource', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const
