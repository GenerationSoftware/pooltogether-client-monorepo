export const drawManagerABI = [
  {
    inputs: [
      { internalType: 'uint256', name: '_timestamp', type: 'uint256' },
      { internalType: 'uint256', name: '_drawClosedAt', type: 'uint256' }
    ],
    name: '_elapsedTimeSinceDrawClosed',
    outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'auctionDuration',
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
    inputs: [{ internalType: 'address', name: '_rewardRecipient', type: 'address' }],
    name: 'awardDraw',
    outputs: [{ internalType: 'uint24', name: '', type: 'uint24' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'awardDrawFee',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'canAwardDraw',
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
    inputs: [],
    name: 'elapsedTimeSinceDrawClosed',
    outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
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
          { internalType: 'uint40', name: 'startedAt', type: 'uint40' },
          { internalType: 'uint24', name: 'drawId', type: 'uint24' },
          { internalType: 'uint32', name: 'rngRequestId', type: 'uint32' }
        ],
        internalType: 'struct StartRngRequestAuction',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'lastAwardDrawFraction',
    outputs: [{ internalType: 'UD2x18', name: '', type: 'uint64' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'lastStartRngRequestFraction',
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
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'startDrawFee',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint24', name: 'drawId', type: 'uint24' },
      { indexed: true, internalType: 'address', name: 'startRecipient', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'startReward', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'awardRecipient', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'awardReward', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'remainingReserve', type: 'uint256' }
    ],
    name: 'DrawAwarded',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
      { indexed: true, internalType: 'address', name: 'recipient', type: 'address' },
      { indexed: false, internalType: 'uint24', name: 'drawId', type: 'uint24' },
      { indexed: false, internalType: 'uint32', name: 'rngRequestId', type: 'uint32' },
      { indexed: false, internalType: 'uint64', name: 'elapsedTime', type: 'uint64' }
    ],
    name: 'RngAuctionCompleted',
    type: 'event'
  },
  {
    inputs: [{ internalType: 'uint64', name: 'auctionDuration', type: 'uint64' }],
    name: 'AuctionDurationGTDrawPeriodSeconds',
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
  { inputs: [], name: 'CannotStartRngRequest', type: 'error' },
  { inputs: [], name: 'DrawHasExpired', type: 'error' },
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
  { inputs: [], name: 'RewardRecipientIsZeroAddress', type: 'error' },
  { inputs: [], name: 'RngRequestNotComplete', type: 'error' },
  { inputs: [], name: 'RngRequestNotInSameBlock', type: 'error' },
  { inputs: [], name: 'TargetRewardFractionGTOne', type: 'error' }
] as const
