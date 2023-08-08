export const vaultFactoryABI = [
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'allVaults',
    outputs: [{ internalType: 'contract Vault', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'contract IERC20', name: '_asset', type: 'address' },
      { internalType: 'string', name: '_name', type: 'string' },
      { internalType: 'string', name: '_symbol', type: 'string' },
      { internalType: 'contract TwabController', name: '_twabController', type: 'address' },
      { internalType: 'contract IERC4626', name: '_yieldVault', type: 'address' },
      { internalType: 'contract PrizePool', name: '_prizePool', type: 'address' },
      { internalType: 'address', name: '_claimer', type: 'address' },
      { internalType: 'address', name: '_yieldFeeRecipient', type: 'address' },
      { internalType: 'uint256', name: '_yieldFeePercentage', type: 'uint256' },
      { internalType: 'address', name: '_owner', type: 'address' }
    ],
    name: 'deployVault',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'contract Vault', name: '', type: 'address' }],
    name: 'deployedVaults',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'totalVaults',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'contract Vault', name: 'vault', type: 'address' },
      {
        indexed: true,
        internalType: 'contract VaultFactory',
        name: 'vaultFactory',
        type: 'address'
      }
    ],
    name: 'NewFactoryVault',
    type: 'event'
  }
] as const
