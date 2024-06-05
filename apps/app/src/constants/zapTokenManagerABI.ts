export const zapTokenManagerABI = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  {
    inputs: [
      { internalType: 'address', name: 'target', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'bytes', name: 'callData', type: 'bytes' }
    ],
    name: 'CallFailed',
    type: 'error'
  },
  {
    inputs: [{ internalType: 'address', name: 'caller', type: 'address' }],
    name: 'CallerNotZap',
    type: 'error'
  },
  {
    inputs: [{ internalType: 'address', name: 'recipient', type: 'address' }],
    name: 'EtherTransferFailed',
    type: 'error'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'balance', type: 'uint256' },
      { internalType: 'uint256', name: 'relayValue', type: 'uint256' }
    ],
    name: 'InsufficientRelayValue',
    type: 'error'
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'caller', type: 'address' }
    ],
    name: 'InvalidCaller',
    type: 'error'
  },
  {
    inputs: [
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'uint256', name: 'minAmountOut', type: 'uint256' },
      { internalType: 'uint256', name: 'balance', type: 'uint256' }
    ],
    name: 'Slippage',
    type: 'error'
  },
  {
    inputs: [{ internalType: 'address', name: 'target', type: 'address' }],
    name: 'TargetingInvalidContract',
    type: 'error'
  },
  {
    inputs: [
      { internalType: 'address', name: '_user', type: 'address' },
      {
        components: [
          { internalType: 'address', name: 'token', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' }
        ],
        internalType: 'struct IBeefyZapRouter.Input[]',
        name: '_inputs',
        type: 'tuple[]'
      }
    ],
    name: 'pullTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'zap',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const
