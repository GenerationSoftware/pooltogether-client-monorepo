export const prizePoolABI = [
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
    name: 'claimCount',
    outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_winner', type: 'address' },
      { internalType: 'uint8', name: '_tier', type: 'uint8' },
      { internalType: 'uint32', name: '_prizeIndex', type: 'uint32' },
      { internalType: 'address', name: '_prizeRecipient', type: 'address' },
      { internalType: 'uint96', name: '_fee', type: 'uint96' },
      { internalType: 'address', name: '_feeRecipient', type: 'address' }
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
    stateMutability: 'view',
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
    inputs: [
      { internalType: 'address', name: '_vault', type: 'address' },
      { internalType: 'uint24', name: '_startDrawId', type: 'uint24' },
      { internalType: 'uint24', name: '_endDrawId', type: 'uint24' }
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
      { internalType: 'uint256', name: '_drawDuration', type: 'uint256' }
    ],
    name: 'getVaultUserBalanceAndTotalSupplyTwab',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'uint256', name: '', type: 'uint256' }
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
    inputs: [{ internalType: 'uint24', name: 'drawId', type: 'uint24' }],
    name: 'isDrawFinalized',
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
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
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
    outputs: [{ internalType: 'UD34x4', name: '', type: 'uint128' }],
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
    name: 'smoothing',
    outputs: [{ internalType: 'SD1x18', name: '', type: 'int64' }],
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
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
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
      { internalType: 'address', name: '_to', type: 'address' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' }
    ],
    name: 'withdrawRewards',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
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
      { indexed: false, internalType: 'uint96', name: 'fee', type: 'uint96' },
      { indexed: false, internalType: 'address', name: 'feeRecipient', type: 'address' }
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
      { indexed: false, internalType: 'UD34x4', name: 'prizeTokensPerShare', type: 'uint128' },
      { indexed: false, internalType: 'uint48', name: 'drawOpenedAt', type: 'uint48' }
    ],
    name: 'DrawAwarded',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: 'address', name: 'drawManager', type: 'address' }],
    name: 'DrawManagerSet',
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
    inputs: [
      { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' }
    ],
    name: 'OwnershipTransferred',
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
    inputs: [
      { indexed: true, internalType: 'address', name: 'account', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'available', type: 'uint256' }
    ],
    name: 'WithdrawRewards',
    type: 'event'
  },
  { inputs: [], name: 'AddToDrawZero', type: 'error' },
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
  { inputs: [], name: 'DrawManagerIsZeroAddress', type: 'error' },
  { inputs: [], name: 'FeeRecipientZeroAddress', type: 'error' },
  {
    inputs: [
      { internalType: 'uint256', name: 'fee', type: 'uint256' },
      { internalType: 'uint256', name: 'maxFee', type: 'uint256' }
    ],
    name: 'FeeTooLarge',
    type: 'error'
  },
  { inputs: [], name: 'FirstDrawOpensInPast', type: 'error' },
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
    inputs: [{ internalType: 'uint256', name: 'x', type: 'uint256' }],
    name: 'PRBMath_UD34x4_fromUD60x18_Convert_Overflow',
    type: 'error'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'x', type: 'uint256' }],
    name: 'PRBMath_UD60x18_Convert_Overflow',
    type: 'error'
  },
  { inputs: [], name: 'PrizeIsZero', type: 'error' },
  { inputs: [], name: 'RandomNumberIsZero', type: 'error' },
  {
    inputs: [{ internalType: 'int64', name: 'smoothing', type: 'int64' }],
    name: 'SmoothingGTEOne',
    type: 'error'
  },
  { inputs: [], name: 'UpperBoundGtZero', type: 'error' }
] as const
