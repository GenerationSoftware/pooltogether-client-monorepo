export const rngRelayABI = [
  {
    inputs: [],
    name: 'auctionDuration',
    outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint64', name: '_auctionElapsedTime', type: 'uint64' }],
    name: 'computeRewardFraction',
    outputs: [{ internalType: 'UD2x18', name: '', type: 'uint64' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'recipient', type: 'address' },
          { internalType: 'UD2x18', name: 'rewardFraction', type: 'uint64' }
        ],
        internalType: 'struct AuctionResult[]',
        name: '__auctionResults',
        type: 'tuple[]'
      }
    ],
    name: 'computeRewards',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'recipient', type: 'address' },
          { internalType: 'UD2x18', name: 'rewardFraction', type: 'uint64' }
        ],
        internalType: 'struct AuctionResult[]',
        name: '__auctionResults',
        type: 'tuple[]'
      },
      { internalType: 'uint256', name: '_totalReserve', type: 'uint256' }
    ],
    name: 'computeRewardsWithTotal',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'pure',
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
    inputs: [
      { internalType: 'uint32', name: '_sequenceId', type: 'uint32' },
      { internalType: 'uint256', name: '_rngCompletedAt', type: 'uint256' }
    ],
    name: 'isAuctionOpen',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint32', name: '_sequenceId', type: 'uint32' }],
    name: 'isSequenceCompleted',
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
    name: 'maxRewards',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'prizePool',
    outputs: [{ internalType: 'contract PrizePool', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'rngAuctionRelayer',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_randomNumber', type: 'uint256' },
      { internalType: 'uint256', name: '_rngCompletedAt', type: 'uint256' },
      { internalType: 'address', name: '_rewardRecipient', type: 'address' },
      { internalType: 'uint32', name: '_sequenceId', type: 'uint32' },
      {
        components: [
          { internalType: 'address', name: 'recipient', type: 'address' },
          { internalType: 'UD2x18', name: 'rewardFraction', type: 'uint64' }
        ],
        internalType: 'struct AuctionResult',
        name: '_rngAuctionResult',
        type: 'tuple'
      }
    ],
    name: 'rngComplete',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint32', name: 'sequenceId', type: 'uint32' },
      { indexed: true, internalType: 'address', name: 'recipient', type: 'address' },
      { indexed: true, internalType: 'uint32', name: 'index', type: 'uint32' },
      { indexed: false, internalType: 'uint256', name: 'reward', type: 'uint256' }
    ],
    name: 'AuctionRewardDistributed',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint32', name: 'sequenceId', type: 'uint32' },
      { indexed: true, internalType: 'uint32', name: 'drawId', type: 'uint32' }
    ],
    name: 'RngSequenceCompleted',
    type: 'event'
  },
  { inputs: [], name: 'AuctionDurationZero', type: 'error' },
  { inputs: [], name: 'AuctionExpired', type: 'error' },
  {
    inputs: [
      { internalType: 'uint64', name: 'auctionDuration', type: 'uint64' },
      { internalType: 'uint64', name: 'auctionTargetTime', type: 'uint64' }
    ],
    name: 'AuctionTargetTimeExceedsDuration',
    type: 'error'
  },
  { inputs: [], name: 'AuctionTargetTimeZero', type: 'error' },
  { inputs: [], name: 'MaxRewardIsZero', type: 'error' },
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
  { inputs: [], name: 'PrizePoolZeroAddress', type: 'error' },
  { inputs: [], name: 'RewardRecipientIsZeroAddress', type: 'error' },
  { inputs: [], name: 'RngRelayerZeroAddress', type: 'error' },
  { inputs: [], name: 'SequenceAlreadyCompleted', type: 'error' },
  {
    inputs: [{ internalType: 'address', name: 'relayer', type: 'address' }],
    name: 'UnauthorizedRelayer',
    type: 'error'
  }
] as const
