export const rngAuctionABI = [
  {
    inputs: [],
    name: 'auctionDuration',
    outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'auctionElapsedTime',
    outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'auctionTargetTime',
    outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'canStartNextSequence',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'claimOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint64', name: '__auctionElapsedTime', type: 'uint64' }],
    name: 'computeRewardFraction',
    outputs: [{ internalType: 'UD2x18', name: '', type: 'uint64' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'currentFractionalReward',
    outputs: [{ internalType: 'UD2x18', name: '', type: 'uint64' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getLastAuction',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'recipient', type: 'address' },
          { internalType: 'UD2x18', name: 'rewardFraction', type: 'uint64' },
          { internalType: 'uint32', name: 'sequenceId', type: 'uint32' },
          { internalType: 'contract RNGInterface', name: 'rng', type: 'address' },
          { internalType: 'uint32', name: 'rngRequestId', type: 'uint32' }
        ],
        internalType: 'struct RngAuctionResult',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getLastAuctionResult',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'recipient', type: 'address' },
          { internalType: 'UD2x18', name: 'rewardFraction', type: 'uint64' }
        ],
        internalType: 'struct AuctionResult',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getLastRngService',
    outputs: [{ internalType: 'contract RNGInterface', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getNextRngService',
    outputs: [{ internalType: 'contract RNGInterface', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getRngResults',
    outputs: [
      { internalType: 'uint256', name: 'randomNumber', type: 'uint256' },
      { internalType: 'uint64', name: 'rngCompletedAt', type: 'uint64' }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'isAuctionOpen',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'isRngComplete',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'lastSequenceId',
    outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'openSequenceId',
    outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
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
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'sequenceOffset',
    outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'sequencePeriod',
    outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'contract RNGInterface', name: '_rngService', type: 'address' }],
    name: 'setNextRngService',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: '_rewardRecipient', type: 'address' }],
    name: 'startRngRequest',
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
      { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
      { indexed: true, internalType: 'address', name: 'recipient', type: 'address' },
      { indexed: true, internalType: 'uint32', name: 'sequenceId', type: 'uint32' },
      { indexed: false, internalType: 'contract RNGInterface', name: 'rng', type: 'address' },
      { indexed: false, internalType: 'uint32', name: 'rngRequestId', type: 'uint32' },
      { indexed: false, internalType: 'uint64', name: 'elapsedTime', type: 'uint64' },
      { indexed: false, internalType: 'UD2x18', name: 'rewardFraction', type: 'uint64' }
    ],
    name: 'RngAuctionCompleted',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'contract RNGInterface', name: 'rngService', type: 'address' }
    ],
    name: 'SetNextRngService',
    type: 'event'
  },
  {
    inputs: [
      { internalType: 'uint64', name: 'auctionDuration', type: 'uint64' },
      { internalType: 'uint64', name: 'sequencePeriod', type: 'uint64' }
    ],
    name: 'AuctionDurationGtSequencePeriod',
    type: 'error'
  },
  { inputs: [], name: 'AuctionExpired', type: 'error' },
  {
    inputs: [
      { internalType: 'uint64', name: 'auctionTargetTime', type: 'uint64' },
      { internalType: 'uint64', name: 'auctionDuration', type: 'uint64' }
    ],
    name: 'AuctionTargetTimeExceedsDuration',
    type: 'error'
  },
  { inputs: [], name: 'CannotStartNextSequence', type: 'error' },
  { inputs: [], name: 'OwnerZeroAddress', type: 'error' },
  {
    inputs: [
      { internalType: 'uint256', name: 'x', type: 'uint256' },
      { internalType: 'uint256', name: 'y', type: 'uint256' }
    ],
    name: 'PRBMath_MulDiv18_Overflow',
    type: 'error'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'x', type: 'uint256' },
      { internalType: 'uint256', name: 'y', type: 'uint256' },
      { internalType: 'uint256', name: 'denominator', type: 'uint256' }
    ],
    name: 'PRBMath_MulDiv_Overflow',
    type: 'error'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'x', type: 'uint256' }],
    name: 'PRBMath_UD60x18_Convert_Overflow',
    type: 'error'
  },
  {
    inputs: [{ internalType: 'UD60x18', name: 'x', type: 'uint256' }],
    name: 'PRBMath_UD60x18_IntoUD2x18_Overflow',
    type: 'error'
  },
  { inputs: [], name: 'RewardRecipientIsZero', type: 'error' },
  { inputs: [], name: 'RngZeroAddress', type: 'error' },
  { inputs: [], name: 'SequencePeriodZero', type: 'error' }
] as const
