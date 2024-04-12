export const drawManagerABI = [
  {
    inputs: [
      { internalType: 'contract PrizePool', name: '_prizePool', type: 'address' },
      { internalType: 'contract IRng', name: '_rng', type: 'address' },
      { internalType: 'uint48', name: '_auctionDuration', type: 'uint48' },
      { internalType: 'uint48', name: '_auctionTargetTime', type: 'uint48' },
      { internalType: 'UD2x18', name: '_firstStartDrawTargetFraction', type: 'uint64' },
      { internalType: 'UD2x18', name: '_firstFinishDrawTargetFraction', type: 'uint64' },
      { internalType: 'uint256', name: '_maxRewards', type: 'uint256' },
      { internalType: 'uint256', name: '_maxRetries', type: 'uint256' },
      { internalType: 'address', name: '_vaultBeneficiary', type: 'address' }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  { inputs: [], name: 'AlreadyStartedDraw', type: 'error' },
  {
    inputs: [{ internalType: 'uint48', name: 'auctionDuration', type: 'uint48' }],
    name: 'AuctionDurationGTDrawPeriodSeconds',
    type: 'error'
  },
  { inputs: [], name: 'AuctionExpired', type: 'error' },
  {
    inputs: [
      { internalType: 'uint48', name: 'auctionTargetTime', type: 'uint48' },
      { internalType: 'uint48', name: 'auctionDuration', type: 'uint48' }
    ],
    name: 'AuctionTargetTimeExceedsDuration',
    type: 'error'
  },
  { inputs: [], name: 'DrawHasFinalized', type: 'error' },
  { inputs: [], name: 'DrawHasNotClosed', type: 'error' },
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
  { inputs: [], name: 'RetryLimitReached', type: 'error' },
  { inputs: [], name: 'RewardRecipientIsZero', type: 'error' },
  { inputs: [], name: 'RngRequestNotComplete', type: 'error' },
  { inputs: [], name: 'RngRequestNotInSameBlock', type: 'error' },
  { inputs: [], name: 'StaleRngRequest', type: 'error' },
  { inputs: [], name: 'TargetRewardFractionGTOne', type: 'error' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
      { indexed: true, internalType: 'address', name: 'recipient', type: 'address' },
      { indexed: true, internalType: 'uint24', name: 'drawId', type: 'uint24' },
      { indexed: false, internalType: 'uint48', name: 'elapsedTime', type: 'uint48' },
      { indexed: false, internalType: 'uint256', name: 'reward', type: 'uint256' }
    ],
    name: 'DrawFinished',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
      { indexed: true, internalType: 'address', name: 'recipient', type: 'address' },
      { indexed: true, internalType: 'uint24', name: 'drawId', type: 'uint24' },
      { indexed: false, internalType: 'uint48', name: 'elapsedTime', type: 'uint48' },
      { indexed: false, internalType: 'uint256', name: 'reward', type: 'uint256' },
      { indexed: false, internalType: 'uint32', name: 'rngRequestId', type: 'uint32' },
      { indexed: false, internalType: 'uint64', name: 'count', type: 'uint64' }
    ],
    name: 'DrawStarted',
    type: 'event'
  },
  {
    inputs: [],
    name: 'auctionDuration',
    outputs: [{ internalType: 'uint48', name: '', type: 'uint48' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'auctionTargetTime',
    outputs: [{ internalType: 'uint48', name: '', type: 'uint48' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'canFinishDraw',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'canStartDraw',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: '_rewardRecipient', type: 'address' }],
    name: 'finishDraw',
    outputs: [{ internalType: 'uint24', name: '', type: 'uint24' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'finishDrawReward',
    outputs: [{ internalType: 'uint256', name: 'reward', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getLastStartDrawAuction',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'recipient', type: 'address' },
          { internalType: 'uint40', name: 'closedAt', type: 'uint40' },
          { internalType: 'uint24', name: 'drawId', type: 'uint24' },
          { internalType: 'uint32', name: 'rngRequestId', type: 'uint32' }
        ],
        internalType: 'struct StartDrawAuction',
        name: 'result',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: '_index', type: 'uint256' }],
    name: 'getStartDrawAuction',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'recipient', type: 'address' },
          { internalType: 'uint40', name: 'closedAt', type: 'uint40' },
          { internalType: 'uint24', name: 'drawId', type: 'uint24' },
          { internalType: 'uint32', name: 'rngRequestId', type: 'uint32' }
        ],
        internalType: 'struct StartDrawAuction',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getStartDrawAuctionCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'lastFinishDrawFraction',
    outputs: [{ internalType: 'UD2x18', name: '', type: 'uint64' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'lastStartDrawFraction',
    outputs: [{ internalType: 'UD2x18', name: '', type: 'uint64' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'maxRetries',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
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
    name: 'rng',
    outputs: [{ internalType: 'contract IRng', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_rewardRecipient', type: 'address' },
      { internalType: 'uint32', name: '_rngRequestId', type: 'uint32' }
    ],
    name: 'startDraw',
    outputs: [{ internalType: 'uint24', name: '', type: 'uint24' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'startDrawReward',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'vaultBeneficiary',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const
