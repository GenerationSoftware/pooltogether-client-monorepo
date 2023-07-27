export const vaultFactory = [
  {
    constant: false,
    inputs: [
      { name: '_asset', type: 'address' },
      { name: '_name', type: 'string' },
      { name: '_symbol', type: 'string' },
      { name: '_twabController', type: 'address' },
      { name: '_yieldVault', type: 'address' },
      { name: '_prizePool', type: 'address' },
      { name: '_claimer', type: 'address' },
      { name: '_yieldFeeRecipient', type: 'address' },
      { name: '_yieldFeePercentage', type: 'uint256' },
      { name: '_owner', type: 'address' }
    ],
    name: 'deployVault',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const
