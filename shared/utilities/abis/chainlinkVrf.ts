export const chainlinkVrfABI = [
  {
    inputs: [],
    name: 'claimOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint32', name: 'requestId', type: 'uint32' }],
    name: 'completedAt',
    outputs: [{ internalType: 'uint64', name: 'completedAtTimestamp', type: 'uint64' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getCallbackGasLimit',
    outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getLastRequestId',
    outputs: [{ internalType: 'uint32', name: 'requestId', type: 'uint32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getRequestConfirmations',
    outputs: [{ internalType: 'uint16', name: '', type: 'uint16' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getRequestFee',
    outputs: [
      { internalType: 'address', name: 'feeToken', type: 'address' },
      { internalType: 'uint256', name: 'requestFee', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint32', name: '_internalRequestId', type: 'uint32' }],
    name: 'isRequestComplete',
    outputs: [{ internalType: 'bool', name: 'isCompleted', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'pendingOwner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint32', name: '_internalRequestId', type: 'uint32' }],
    name: 'randomNumber',
    outputs: [{ internalType: 'uint256', name: 'randomNum', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_requestId', type: 'uint256' },
      { internalType: 'uint256[]', name: '_randomWords', type: 'uint256[]' }
    ],
    name: 'rawFulfillRandomWords',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'requestRandomNumber',
    outputs: [
      { internalType: 'uint32', name: 'requestId', type: 'uint32' },
      { internalType: 'uint32', name: 'lockBlock', type: 'uint32' }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint32', name: 'callbackGasLimit_', type: 'uint32' }],
    name: 'setCallbackGasLimit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint16', name: 'requestConfirmations_', type: 'uint16' }],
    name: 'setRequestConfirmations',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: '_newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'vrfV2Wrapper',
    outputs: [{ internalType: 'contract VRFV2Wrapper', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: 'address', name: 'pendingOwner', type: 'address' }],
    name: 'OwnershipOffered',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint32', name: 'requestId', type: 'uint32' },
      { indexed: false, internalType: 'uint256', name: 'randomNumber', type: 'uint256' }
    ],
    name: 'RandomNumberCompleted',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint32', name: 'requestId', type: 'uint32' },
      { indexed: true, internalType: 'address', name: 'sender', type: 'address' }
    ],
    name: 'RandomNumberRequested',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: 'uint32', name: 'callbackGasLimit', type: 'uint32' }],
    name: 'SetCallbackGasLimit',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint16', name: 'requestConfirmations', type: 'uint16' }
    ],
    name: 'SetRequestConfirmations',
    type: 'event'
  },
  { inputs: [], name: 'CallbackGasLimitZero', type: 'error' },
  {
    inputs: [{ internalType: 'uint256', name: 'vrfRequestId', type: 'uint256' }],
    name: 'InvalidVrfRequestId',
    type: 'error'
  },
  { inputs: [], name: 'LinkTokenZeroAddress', type: 'error' },
  { inputs: [], name: 'RequestConfirmationsZero', type: 'error' },
  { inputs: [], name: 'VRFV2WrapperZeroAddress', type: 'error' }
] as const
