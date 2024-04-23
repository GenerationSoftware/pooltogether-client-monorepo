export const v3FaucetABI = [
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'claim',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'userStates',
    outputs: [
      { internalType: 'uint128', name: 'lastExchangeRateMantissa', type: 'uint128' },
      { internalType: 'uint128', name: 'balance', type: 'uint128' }
    ],
    stateMutability: 'view',
    type: 'function'
  }
] as const
