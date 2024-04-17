export const prizePoolABI = [
  {
    inputs: [
      {
        components: [
          { internalType: 'contract IERC20', name: 'prizeToken', type: 'address' },
          { internalType: 'contract TwabController', name: 'twabController', type: 'address' },
          { internalType: 'address', name: 'creator', type: 'address' },
          { internalType: 'uint256', name: 'tierLiquidityUtilizationRate', type: 'uint256' },
          { internalType: 'uint48', name: 'drawPeriodSeconds', type: 'uint48' },
          { internalType: 'uint48', name: 'firstDrawOpensAt', type: 'uint48' },
          { internalType: 'uint24', name: 'grandPrizePeriodDraws', type: 'uint24' },
          { internalType: 'uint8', name: 'numberOfTiers', type: 'uint8' },
          { internalType: 'uint8', name: 'tierShares', type: 'uint8' },
          { internalType: 'uint8', name: 'canaryShares', type: 'uint8' },
          { internalType: 'uint8', name: 'reserveShares', type: 'uint8' },
          { internalType: 'uint24', name: 'drawTimeout', type: 'uint24' }
        ],
        internalType: 'struct ConstructorParams',
        name: 'params',
        type: 'tuple'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  { inputs: [], name: 'AddToDrawZero', type: 'error' },
  {
    inputs: [
      { internalType: 'address', name: 'vault', type: 'address' },
      { internalType: 'address', name: 'winner', type: 'address' },
      { internalType: 'uint8', name: 'tier', type: 'uint8' },
      { internalType: 'uint32', name: 'prizeIndex', type: 'uint32' }
    ],
    name: 'AlreadyClaimed',
    type: 'error'
  },
  {
    inputs: [{ internalType: 'uint48', name: 'drawClosesAt', type: 'uint48' }],
    name: 'AwardingDrawNotClosed',
    type: 'error'
  },
  {
    inputs: [
      { internalType: 'address', name: 'caller', type: 'address' },
      { internalType: 'address', name: 'drawManager', type: 'address' }
    ],
    name: 'CallerNotDrawManager',
    type: 'error'
  },
  { inputs: [], name: 'ClaimPeriodExpired', type: 'error' },
  {
    inputs: [
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'uint256', name: 'available', type: 'uint256' }
    ],
    name: 'ContributionGTDeltaBalance',
    type: 'error'
  },
  { inputs: [], name: 'CreatorIsZeroAddress', type: 'error' },
  {
    inputs: [
      { internalType: 'address', name: 'vault', type: 'address' },
      { internalType: 'address', name: 'winner', type: 'address' },
      { internalType: 'uint8', name: 'tier', type: 'uint8' },
      { internalType: 'uint32', name: 'prizeIndex', type: 'uint32' }
    ],
    name: 'DidNotWin',
    type: 'error'
  },
  {
    inputs: [
      { internalType: 'uint24', name: 'drawId', type: 'uint24' },
      { internalType: 'uint24', name: 'newestDrawId', type: 'uint24' }
    ],
    name: 'DrawAwarded',
    type: 'error'
  },
  { inputs: [], name: 'DrawManagerAlreadySet', type: 'error' },
  { inputs: [], name: 'DrawTimeoutGTGrandPrizePeriodDraws', type: 'error' },
  { inputs: [], name: 'DrawTimeoutIsZero', type: 'error' },
  { inputs: [], name: 'FirstDrawOpensInPast', type: 'error' },
  {
    inputs: [
      { internalType: 'uint24', name: 'grandPrizePeriodDraws', type: 'uint24' },
      { internalType: 'uint24', name: 'maxGrandPrizePeriodDraws', type: 'uint24' }
    ],
    name: 'GrandPrizePeriodDrawsTooLarge',
    type: 'error'
  },
  { inputs: [], name: 'IncompatibleTwabPeriodLength', type: 'error' },
  { inputs: [], name: 'IncompatibleTwabPeriodOffset', type: 'error' },
  {
    inputs: [{ internalType: 'uint104', name: 'requestedLiquidity', type: 'uint104' }],
    name: 'InsufficientLiquidity',
    type: 'error'
  },
  {
    inputs: [
      { internalType: 'uint104', name: 'amount', type: 'uint104' },
      { internalType: 'uint104', name: 'reserve', type: 'uint104' }
    ],
    name: 'InsufficientReserve',
    type: 'error'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'requested', type: 'uint256' },
      { internalType: 'uint256', name: 'available', type: 'uint256' }
    ],
    name: 'InsufficientRewardsError',
    type: 'error'
  },
  {
    inputs: [
      { internalType: 'uint24', name: 'startDrawId', type: 'uint24' },
      { internalType: 'uint24', name: 'endDrawId', type: 'uint24' }
    ],
    name: 'InvalidDrawRange',
    type: 'error'
  },
  {
    inputs: [
      { internalType: 'uint32', name: 'invalidPrizeIndex', type: 'uint32' },
      { internalType: 'uint32', name: 'prizeCount', type: 'uint32' },
      { internalType: 'uint8', name: 'tier', type: 'uint8' }
    ],
    name: 'InvalidPrizeIndex',
    type: 'error'
  },
  {
    inputs: [
      { internalType: 'uint8', name: 'tier', type: 'uint8' },
      { internalType: 'uint8', name: 'numberOfTiers', type: 'uint8' }
    ],
    name: 'InvalidTier',
    type: 'error'
  },
  { inputs: [], name: 'NoDrawsAwarded', type: 'error' },
  {
    inputs: [{ internalType: 'uint8', name: 'numTiers', type: 'uint8' }],
    name: 'NumberOfTiersGreaterThanMaximum',
    type: 'error'
  },
  {
    inputs: [{ internalType: 'uint8', name: 'numTiers', type: 'uint8' }],
    name: 'NumberOfTiersLessThanMinimum',
    type: 'error'
  },
  { inputs: [], name: 'OnlyCreator', type: 'error' },
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
    inputs: [{ internalType: 'SD59x18', name: 'x', type: 'int256' }],
    name: 'PRBMath_SD59x18_Ceil_Overflow',
    type: 'error'
  },
  {
    inputs: [{ internalType: 'int256', name: 'x', type: 'int256' }],
    name: 'PRBMath_SD59x18_Convert_Overflow',
    type: 'error'
  },
  {
    inputs: [{ internalType: 'int256', name: 'x', type: 'int256' }],
    name: 'PRBMath_SD59x18_Convert_Underflow',
    type: 'error'
  },
  { inputs: [], name: 'PRBMath_SD59x18_Div_InputTooSmall', type: 'error' },
  {
    inputs: [
      { internalType: 'SD59x18', name: 'x', type: 'int256' },
      { internalType: 'SD59x18', name: 'y', type: 'int256' }
    ],
    name: 'PRBMath_SD59x18_Div_Overflow',
    type: 'error'
  },
  {
    inputs: [{ internalType: 'SD59x18', name: 'x', type: 'int256' }],
    name: 'PRBMath_SD59x18_Exp2_InputTooBig',
    type: 'error'
  },
  {
    inputs: [{ internalType: 'SD59x18', name: 'x', type: 'int256' }],
    name: 'PRBMath_SD59x18_Log_InputTooSmall',
    type: 'error'
  },
  { inputs: [], name: 'PRBMath_SD59x18_Mul_InputTooSmall', type: 'error' },
  {
    inputs: [
      { internalType: 'SD59x18', name: 'x', type: 'int256' },
      { internalType: 'SD59x18', name: 'y', type: 'int256' }
    ],
    name: 'PRBMath_SD59x18_Mul_Overflow',
    type: 'error'
  },
  {
    inputs: [{ internalType: 'SD59x18', name: 'x', type: 'int256' }],
    name: 'PRBMath_SD59x18_Sqrt_NegativeInput',
    type: 'error'
  },
  {
    inputs: [{ internalType: 'SD59x18', name: 'x', type: 'int256' }],
    name: 'PRBMath_SD59x18_Sqrt_Overflow',
    type: 'error'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'x', type: 'uint256' }],
    name: 'PRBMath_UD60x18_Convert_Overflow',
    type: 'error'
  },
  { inputs: [], name: 'PrizeIsZero', type: 'error' },
  { inputs: [], name: 'PrizePoolNotShutdown', type: 'error' },
  { inputs: [], name: 'PrizePoolShutdown', type: 'error' },
  { inputs: [], name: 'RandomNumberIsZero', type: 'error' },
  { inputs: [], name: 'RangeSizeZero', type: 'error' },
  { inputs: [], name: 'RewardRecipientZeroAddress', type: 'error' },
  {
    inputs: [
      { internalType: 'uint256', name: 'reward', type: 'uint256' },
      { internalType: 'uint256', name: 'maxReward', type: 'uint256' }
    ],
    name: 'RewardTooLarge',
    type: 'error'
  },
  { inputs: [], name: 'TierLiquidityUtilizationRateCannotBeZero', type: 'error' },
  { inputs: [], name: 'TierLiquidityUtilizationRateGreaterThanOne', type: 'error' },
  { inputs: [], name: 'UpperBoundGtZero', type: 'error' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'AllocateRewardFromReserve',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'vault', type: 'address' },
      { indexed: true, internalType: 'address', name: 'winner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'recipient', type: 'address' },
      { indexed: false, internalType: 'uint24', name: 'drawId', type: 'uint24' },
      { indexed: false, internalType: 'uint8', name: 'tier', type: 'uint8' },
      { indexed: false, internalType: 'uint32', name: 'prizeIndex', type: 'uint32' },
      { indexed: false, internalType: 'uint152', name: 'payout', type: 'uint152' },
      { indexed: false, internalType: 'uint96', name: 'claimReward', type: 'uint96' },
      { indexed: false, internalType: 'address', name: 'claimRewardRecipient', type: 'address' }
    ],
    name: 'ClaimedPrize',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'vault', type: 'address' },
      { indexed: true, internalType: 'uint24', name: 'drawId', type: 'uint24' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'ContributePrizeTokens',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'ContributedReserve',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint24', name: 'drawId', type: 'uint24' },
      { indexed: false, internalType: 'uint256', name: 'winningRandomNumber', type: 'uint256' },
      { indexed: false, internalType: 'uint8', name: 'lastNumTiers', type: 'uint8' },
      { indexed: false, internalType: 'uint8', name: 'numTiers', type: 'uint8' },
      { indexed: false, internalType: 'uint104', name: 'reserve', type: 'uint104' },
      { indexed: false, internalType: 'uint128', name: 'prizeTokensPerShare', type: 'uint128' },
      { indexed: false, internalType: 'uint48', name: 'drawOpenedAt', type: 'uint48' }
    ],
    name: 'DrawAwarded',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'IncreaseClaimRewards',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }],
    name: 'ReserveConsumed',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: 'address', name: 'drawManager', type: 'address' }],
    name: 'SetDrawManager',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'account', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'available', type: 'uint256' }
    ],
    name: 'WithdrawRewards',
    type: 'event'
  },
  {
    inputs: [],
    name: 'DONATOR',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'accountedBalance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_to', type: 'address' },
      { internalType: 'uint96', name: '_amount', type: 'uint96' }
    ],
    name: 'allocateRewardFromReserve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'winningRandomNumber_', type: 'uint256' }],
    name: 'awardDraw',
    outputs: [{ internalType: 'uint24', name: '', type: 'uint24' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'canaryShares',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'claimCount',
    outputs: [{ internalType: 'uint24', name: '', type: 'uint24' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_winner', type: 'address' },
      { internalType: 'uint8', name: '_tier', type: 'uint8' },
      { internalType: 'uint32', name: '_prizeIndex', type: 'uint32' },
      { internalType: 'address', name: '_prizeRecipient', type: 'address' },
      { internalType: 'uint96', name: '_claimReward', type: 'uint96' },
      { internalType: 'address', name: '_claimRewardRecipient', type: 'address' }
    ],
    name: 'claimPrize',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint32', name: '_claimCount', type: 'uint32' }],
    name: 'computeNextNumberOfTiers',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint24', name: '_endDrawIdInclusive', type: 'uint24' },
      { internalType: 'uint24', name: '_rangeSize', type: 'uint24' }
    ],
    name: 'computeRangeStartDrawIdInclusive',
    outputs: [{ internalType: 'uint24', name: '', type: 'uint24' }],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_vault', type: 'address' },
      { internalType: 'address', name: '_account', type: 'address' }
    ],
    name: 'computeShutdownPortion',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'numerator', type: 'uint256' },
          { internalType: 'uint256', name: 'denominator', type: 'uint256' }
        ],
        internalType: 'struct ShutdownPortion',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint8', name: '_numberOfTiers', type: 'uint8' }],
    name: 'computeTotalShares',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_prizeVault', type: 'address' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' }
    ],
    name: 'contributePrizeTokens',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint96', name: '_amount', type: 'uint96' }],
    name: 'contributeReserve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
    name: 'donatePrizeTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint24', name: 'drawId', type: 'uint24' }],
    name: 'drawClosesAt',
    outputs: [{ internalType: 'uint48', name: '', type: 'uint48' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'drawManager',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint24', name: 'drawId', type: 'uint24' }],
    name: 'drawOpensAt',
    outputs: [{ internalType: 'uint48', name: '', type: 'uint48' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'drawPeriodSeconds',
    outputs: [{ internalType: 'uint48', name: '', type: 'uint48' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'drawTimeout',
    outputs: [{ internalType: 'uint24', name: '', type: 'uint24' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'drawTimeoutAt',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'estimateNextNumberOfTiers',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint8', name: 'numTiers', type: 'uint8' }],
    name: 'estimatedPrizeCount',
    outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'estimatedPrizeCount',
    outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint8', name: 'numTiers', type: 'uint8' }],
    name: 'estimatedPrizeCountWithBothCanaries',
    outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'estimatedPrizeCountWithBothCanaries',
    outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'firstDrawOpensAt',
    outputs: [{ internalType: 'uint48', name: '', type: 'uint48' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_vault', type: 'address' },
      { internalType: 'uint24', name: '_startDrawIdInclusive', type: 'uint24' },
      { internalType: 'uint24', name: '_endDrawIdInclusive', type: 'uint24' }
    ],
    name: 'getContributedBetween',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint24', name: '_startDrawIdInclusive', type: 'uint24' },
      { internalType: 'uint24', name: '_endDrawIdInclusive', type: 'uint24' }
    ],
    name: 'getDonatedBetween',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: '_timestamp', type: 'uint256' }],
    name: 'getDrawId',
    outputs: [{ internalType: 'uint24', name: '', type: 'uint24' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getDrawIdToAward',
    outputs: [{ internalType: 'uint24', name: '', type: 'uint24' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getLastAwardedDrawId',
    outputs: [{ internalType: 'uint24', name: '', type: 'uint24' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getOpenDrawId',
    outputs: [{ internalType: 'uint24', name: '', type: 'uint24' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getShutdownDrawId',
    outputs: [{ internalType: 'uint24', name: '', type: 'uint24' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getShutdownInfo',
    outputs: [
      { internalType: 'uint256', name: 'balance', type: 'uint256' },
      {
        components: [
          { internalType: 'uint96', name: 'available', type: 'uint96' },
          { internalType: 'uint160', name: 'disbursed', type: 'uint160' }
        ],
        internalType: 'struct Observation',
        name: 'observation',
        type: 'tuple'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint8', name: '_tier', type: 'uint8' }],
    name: 'getTierAccrualDurationInDraws',
    outputs: [{ internalType: 'uint24', name: '', type: 'uint24' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint8', name: '_tier', type: 'uint8' },
      { internalType: 'uint8', name: '_numTiers', type: 'uint8' }
    ],
    name: 'getTierOdds',
    outputs: [{ internalType: 'SD59x18', name: '', type: 'int256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint8', name: '_tier', type: 'uint8' }],
    name: 'getTierPrizeCount',
    outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint8', name: '_tier', type: 'uint8' }],
    name: 'getTierPrizeSize',
    outputs: [{ internalType: 'uint104', name: '', type: 'uint104' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint8', name: '_tier', type: 'uint8' }],
    name: 'getTierRemainingLiquidity',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getTotalAccumulatorNewestObservation',
    outputs: [
      {
        components: [
          { internalType: 'uint96', name: 'available', type: 'uint96' },
          { internalType: 'uint160', name: 'disbursed', type: 'uint160' }
        ],
        internalType: 'struct Observation',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint24', name: '_startDrawIdInclusive', type: 'uint24' },
      { internalType: 'uint24', name: '_endDrawIdInclusive', type: 'uint24' }
    ],
    name: 'getTotalContributedBetween',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getTotalShares',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: '_vault', type: 'address' }],
    name: 'getVaultAccumulatorNewestObservation',
    outputs: [
      {
        components: [
          { internalType: 'uint96', name: 'available', type: 'uint96' },
          { internalType: 'uint160', name: 'disbursed', type: 'uint160' }
        ],
        internalType: 'struct Observation',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_vault', type: 'address' },
      { internalType: 'uint24', name: '_startDrawIdInclusive', type: 'uint24' },
      { internalType: 'uint24', name: '_endDrawIdInclusive', type: 'uint24' }
    ],
    name: 'getVaultPortion',
    outputs: [{ internalType: 'SD59x18', name: '', type: 'int256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_vault', type: 'address' },
      { internalType: 'address', name: '_user', type: 'address' },
      { internalType: 'uint24', name: '_startDrawIdInclusive', type: 'uint24' },
      { internalType: 'uint24', name: '_endDrawIdInclusive', type: 'uint24' }
    ],
    name: 'getVaultUserBalanceAndTotalSupplyTwab',
    outputs: [
      { internalType: 'uint256', name: 'twab', type: 'uint256' },
      { internalType: 'uint256', name: 'twabTotalSupply', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getWinningRandomNumber',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'grandPrizePeriodDraws',
    outputs: [{ internalType: 'uint24', name: '', type: 'uint24' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint8', name: '_tier', type: 'uint8' }],
    name: 'isCanaryTier',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint24', name: 'drawId', type: 'uint24' }],
    name: 'isDrawFinalized',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'isShutdown',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_vault', type: 'address' },
      { internalType: 'address', name: '_user', type: 'address' },
      { internalType: 'uint8', name: '_tier', type: 'uint8' },
      { internalType: 'uint32', name: '_prizeIndex', type: 'uint32' }
    ],
    name: 'isWinner',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'lastAwardedDrawAwardedAt',
    outputs: [{ internalType: 'uint48', name: '', type: 'uint48' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'numberOfTiers',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'pendingReserveContributions',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'prizeToken',
    outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'prizeTokenPerShare',
    outputs: [{ internalType: 'uint128', name: '', type: 'uint128' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'reserve',
    outputs: [{ internalType: 'uint96', name: '', type: 'uint96' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'reserveShares',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: '_recipient', type: 'address' }],
    name: 'rewardBalance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: '_drawManager', type: 'address' }],
    name: 'setDrawManager',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'shutdownAt',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_vault', type: 'address' },
      { internalType: 'address', name: '_account', type: 'address' }
    ],
    name: 'shutdownBalanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'tierLiquidityUtilizationRate',
    outputs: [{ internalType: 'UD60x18', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'tierShares',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'totalWithdrawn',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'twabController',
    outputs: [{ internalType: 'contract TwabController', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_vault', type: 'address' },
      { internalType: 'address', name: '_winner', type: 'address' },
      { internalType: 'uint8', name: '_tier', type: 'uint8' },
      { internalType: 'uint32', name: '_prizeIndex', type: 'uint32' }
    ],
    name: 'wasClaimed',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_vault', type: 'address' },
      { internalType: 'address', name: '_winner', type: 'address' },
      { internalType: 'uint24', name: '_drawId', type: 'uint24' },
      { internalType: 'uint8', name: '_tier', type: 'uint8' },
      { internalType: 'uint32', name: '_prizeIndex', type: 'uint32' }
    ],
    name: 'wasClaimed',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_to', type: 'address' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' }
    ],
    name: 'withdrawRewards',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_vault', type: 'address' },
      { internalType: 'address', name: '_recipient', type: 'address' }
    ],
    name: 'withdrawShutdownBalance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const
