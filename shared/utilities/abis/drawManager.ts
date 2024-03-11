export const drawManagerABI = [
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
    inputs: [{ internalType: 'uint48', name: '_elapsedTime', type: 'uint48' }],
    name: 'computeFinishDrawRewardFraction',
    outputs: [{ internalType: 'UD2x18', name: '', type: 'uint64' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'UD2x18[]', name: '_rewardFractions', type: 'uint64[]' },
      { internalType: 'uint256', name: '_reserve', type: 'uint256' }
    ],
    name: 'computeRewards',
    outputs: [{ internalType: 'uint256[]', name: 'rewardAmounts', type: 'uint256[]' }],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint48', name: '_startDrawElapsedTime', type: 'uint48' },
      { internalType: 'uint48', name: '_finishDrawElapsedTime', type: 'uint48' },
      { internalType: 'uint256', name: '_totalReserve', type: 'uint256' }
    ],
    name: 'computeRewards',
    outputs: [
      { internalType: 'uint256[]', name: 'rewards', type: 'uint256[]' },
      { internalType: 'uint256', name: 'remainingReserve', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint48', name: '_startDrawElapsedTime', type: 'uint48' },
      { internalType: 'uint256', name: '_totalReserve', type: 'uint256' }
    ],
    name: 'computeStartDrawReward',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint48', name: '_elapsedTime', type: 'uint48' }],
    name: 'computeStartDrawRewardFraction',
    outputs: [{ internalType: 'UD2x18', name: '', type: 'uint64' }],
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
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
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
          { internalType: 'uint40', name: 'startedAt', type: 'uint40' },
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
    name: 'remainingRewardsRecipient',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
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
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint24', name: 'drawId', type: 'uint24' },
      { indexed: false, internalType: 'uint256', name: 'elapsedTime', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'startRecipient', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'startReward', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'finishRecipient', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'finishReward', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'remainingReserve', type: 'uint256' }
    ],
    name: 'DrawFinished',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
      { indexed: true, internalType: 'address', name: 'recipient', type: 'address' },
      { indexed: false, internalType: 'uint24', name: 'drawId', type: 'uint24' },
      { indexed: false, internalType: 'uint32', name: 'rngRequestId', type: 'uint32' },
      { indexed: false, internalType: 'uint48', name: 'elapsedTime', type: 'uint48' }
    ],
    name: 'DrawStarted',
    type: 'event'
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
  { inputs: [], name: 'RewardRecipientIsZero', type: 'error' },
  { inputs: [], name: 'RngRequestNotComplete', type: 'error' },
  { inputs: [], name: 'RngRequestNotInSameBlock', type: 'error' },
  { inputs: [], name: 'TargetRewardFractionGTOne', type: 'error' }
] as const
