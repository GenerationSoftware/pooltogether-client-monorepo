export const poolWideTwabRewardsABI = [
  {
    inputs: [
      { internalType: 'contract TwabController', name: '_twabController', type: 'address' },
      { internalType: 'contract IPrizePool', name: '_prizePool', type: 'address' }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  { inputs: [], name: 'EpochDurationLtDrawPeriod', type: 'error' },
  { inputs: [], name: 'EpochDurationNotMultipleOfDrawPeriod', type: 'error' },
  {
    inputs: [{ internalType: 'uint64', name: 'epochEndTimestamp', type: 'uint64' }],
    name: 'EpochNotOver',
    type: 'error'
  },
  {
    inputs: [
      { internalType: 'uint8', name: 'epochExtension', type: 'uint8' },
      { internalType: 'uint8', name: 'currentEpochs', type: 'uint8' },
      { internalType: 'uint8', name: 'maxEpochs', type: 'uint8' }
    ],
    name: 'ExceedsMaxEpochs',
    type: 'error'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'gracePeriodEndTimestamp', type: 'uint256' }],
    name: 'GracePeriodActive',
    type: 'error'
  },
  {
    inputs: [
      { internalType: 'uint8', name: 'epochId', type: 'uint8' },
      { internalType: 'uint8', name: 'numberOfEpochs', type: 'uint8' }
    ],
    name: 'InvalidEpochId',
    type: 'error'
  },
  {
    inputs: [
      { internalType: 'uint8', name: 'startEpochId', type: 'uint8' },
      { internalType: 'uint8', name: 'currentEpochId', type: 'uint8' }
    ],
    name: 'NoEpochsToClaim',
    type: 'error'
  },
  {
    inputs: [
      { internalType: 'address', name: 'sender', type: 'address' },
      { internalType: 'address', name: 'creator', type: 'address' }
    ],
    name: 'OnlyPromotionCreator',
    type: 'error'
  },
  { inputs: [], name: 'PayeeZeroAddress', type: 'error' },
  { inputs: [], name: 'PrizePoolZeroAddress', type: 'error' },
  {
    inputs: [{ internalType: 'uint256', name: 'promotionId', type: 'uint256' }],
    name: 'PromotionInactive',
    type: 'error'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'promotionId', type: 'uint256' },
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'uint8', name: 'epochId', type: 'uint8' }
    ],
    name: 'RewardsAlreadyClaimed',
    type: 'error'
  },
  { inputs: [], name: 'StartTimeLtFirstDrawOpensAt', type: 'error' },
  { inputs: [], name: 'StartTimeNotAlignedWithDraws', type: 'error' },
  {
    inputs: [
      { internalType: 'uint256', name: 'received', type: 'uint256' },
      { internalType: 'uint256', name: 'expected', type: 'uint256' }
    ],
    name: 'TokensReceivedLessThanExpected',
    type: 'error'
  },
  { inputs: [], name: 'TwabControllerZeroAddress', type: 'error' },
  { inputs: [], name: 'ZeroEpochs', type: 'error' },
  { inputs: [], name: 'ZeroTokensPerEpoch', type: 'error' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'promotionId', type: 'uint256' },
      { indexed: true, internalType: 'contract IERC20', name: 'token', type: 'address' },
      { indexed: false, internalType: 'uint40', name: 'startTimestamp', type: 'uint40' },
      { indexed: false, internalType: 'uint104', name: 'tokensPerEpoch', type: 'uint104' },
      { indexed: false, internalType: 'uint40', name: 'epochDuration', type: 'uint40' },
      { indexed: false, internalType: 'uint8', name: 'initialNumberOfEpochs', type: 'uint8' }
    ],
    name: 'PromotionCreated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'promotionId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'recipient', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'PromotionDestroyed',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'promotionId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'recipient', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
      { indexed: false, internalType: 'uint8', name: 'epochNumber', type: 'uint8' }
    ],
    name: 'PromotionEnded',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'promotionId', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'numberOfEpochs', type: 'uint256' }
    ],
    name: 'PromotionExtended',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'promotionId', type: 'uint256' },
      { indexed: false, internalType: 'bytes32', name: 'epochClaimFlags', type: 'bytes32' },
      { indexed: true, internalType: 'address', name: 'vault', type: 'address' },
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'RewardsClaimed',
    type: 'event'
  },
  {
    inputs: [],
    name: 'GRACE_PERIOD',
    outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint64', name: '_timestamp', type: 'uint64' }],
    name: 'calculateDrawIdAt',
    outputs: [{ internalType: 'uint24', name: '', type: 'uint24' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_vault', type: 'address' },
      { internalType: 'address', name: '_user', type: 'address' },
      { internalType: 'uint256', name: '_promotionId', type: 'uint256' },
      { internalType: 'uint8[]', name: '_epochIds', type: 'uint8[]' }
    ],
    name: 'calculateRewards',
    outputs: [{ internalType: 'uint256[]', name: 'rewards', type: 'uint256[]' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_vault', type: 'address' },
      { internalType: 'address', name: '_user', type: 'address' },
      { internalType: 'uint256', name: '_promotionId', type: 'uint256' },
      { internalType: 'uint8', name: '_startEpochId', type: 'uint8' }
    ],
    name: 'claimRewardedEpochs',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_vault', type: 'address' },
      { internalType: 'address', name: '_user', type: 'address' },
      { internalType: 'uint256', name: '_promotionId', type: 'uint256' },
      { internalType: 'uint8[]', name: '_epochIds', type: 'uint8[]' }
    ],
    name: 'claimRewards',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'contract ITwabRewards', name: '_twabRewards', type: 'address' },
      { internalType: 'address', name: '_user', type: 'address' },
      { internalType: 'uint256', name: '_promotionId', type: 'uint256' },
      { internalType: 'uint8[]', name: '_epochIds', type: 'uint8[]' }
    ],
    name: 'claimTwabRewards',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'promotionId', type: 'uint256' },
      { internalType: 'address', name: 'vault', type: 'address' },
      { internalType: 'address', name: 'user', type: 'address' }
    ],
    name: 'claimedEpochs',
    outputs: [{ internalType: 'bytes32', name: 'claimMask', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'contract IERC20', name: '_token', type: 'address' },
      { internalType: 'uint40', name: '_startTimestamp', type: 'uint40' },
      { internalType: 'uint104', name: '_tokensPerEpoch', type: 'uint104' },
      { internalType: 'uint40', name: '_epochDuration', type: 'uint40' },
      { internalType: 'uint8', name: '_numberOfEpochs', type: 'uint8' }
    ],
    name: 'createPromotion',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_promotionId', type: 'uint256' },
      { internalType: 'address', name: '_to', type: 'address' }
    ],
    name: 'destroyPromotion',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_promotionId', type: 'uint256' },
      { internalType: 'address', name: '_to', type: 'address' }
    ],
    name: 'endPromotion',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'bytes32', name: '_epochClaimFlags', type: 'bytes32' }],
    name: 'epochBytesToIdArray',
    outputs: [{ internalType: 'uint8[]', name: '', type: 'uint8[]' }],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint8[]', name: '_epochIds', type: 'uint8[]' }],
    name: 'epochIdArrayToBytes',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint48', name: '_promotionStartTimestamp', type: 'uint48' },
      { internalType: 'uint48', name: '_promotionEpochDuration', type: 'uint48' },
      { internalType: 'uint8', name: '_epochId', type: 'uint8' }
    ],
    name: 'epochRanges',
    outputs: [
      { internalType: 'uint48', name: 'epochStartTimestamp', type: 'uint48' },
      { internalType: 'uint48', name: 'epochEndTimestamp', type: 'uint48' },
      { internalType: 'uint24', name: 'epochStartDrawId', type: 'uint24' },
      { internalType: 'uint24', name: 'epochEndDrawId', type: 'uint24' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_promotionId', type: 'uint256' },
      { internalType: 'uint8', name: '_epochId', type: 'uint8' }
    ],
    name: 'epochRangesForPromotion',
    outputs: [
      { internalType: 'uint48', name: 'epochStartTimestamp', type: 'uint48' },
      { internalType: 'uint48', name: 'epochEndTimestamp', type: 'uint48' },
      { internalType: 'uint24', name: 'epochStartDrawId', type: 'uint24' },
      { internalType: 'uint24', name: 'epochEndDrawId', type: 'uint24' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_promotionId', type: 'uint256' },
      { internalType: 'uint8', name: '_numberOfEpochs', type: 'uint8' }
    ],
    name: 'extendPromotion',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_promotionId', type: 'uint256' },
      { internalType: 'uint256', name: '_timestamp', type: 'uint256' }
    ],
    name: 'getEpochIdAt',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: '_promotionId', type: 'uint256' }],
    name: 'getEpochIdNow',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: '_promotionId', type: 'uint256' }],
    name: 'getPromotion',
    outputs: [
      {
        components: [
          { internalType: 'contract IERC20', name: 'token', type: 'address' },
          { internalType: 'uint40', name: 'epochDuration', type: 'uint40' },
          { internalType: 'uint40', name: 'createdAt', type: 'uint40' },
          { internalType: 'uint8', name: 'numberOfEpochs', type: 'uint8' },
          { internalType: 'uint40', name: 'startTimestamp', type: 'uint40' },
          { internalType: 'uint104', name: 'tokensPerEpoch', type: 'uint104' },
          { internalType: 'uint112', name: 'rewardsUnclaimed', type: 'uint112' }
        ],
        internalType: 'struct Promotion',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: '_promotionId', type: 'uint256' }],
    name: 'getRemainingRewards',
    outputs: [{ internalType: 'uint128', name: '', type: 'uint128' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_vault', type: 'address' },
      { internalType: 'uint256', name: '_promotionId', type: 'uint256' },
      { internalType: 'uint8', name: '_epochId', type: 'uint8' }
    ],
    name: 'getVaultRewardAmount',
    outputs: [{ internalType: 'uint128', name: '', type: 'uint128' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'latestPromotionId',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'bytes[]', name: 'data', type: 'bytes[]' }],
    name: 'multicall',
    outputs: [{ internalType: 'bytes[]', name: 'results', type: 'bytes[]' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'prizePool',
    outputs: [{ internalType: 'contract IPrizePool', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'promotionCreators',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'twabController',
    outputs: [{ internalType: 'contract TwabController', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const
