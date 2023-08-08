export const prizePoolABI = [
  {
    inputs: [],
    name: 'accountedBalance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: '_claimer', type: 'address' }],
    name: 'balanceOfClaimRewards',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint8', name: '_tier', type: 'uint8' }],
    name: 'calculateTierTwabTimestamps',
    outputs: [
      { internalType: 'uint64', name: 'startTimestamp', type: 'uint64' },
      { internalType: 'uint64', name: 'endTimestamp', type: 'uint64' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'canaryClaimCount',
    outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint8', name: '_numTiers', type: 'uint8' }],
    name: 'canaryPrizeCount',
    outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'canaryPrizeCount',
    outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint8', name: 'numTiers', type: 'uint8' }],
    name: 'canaryPrizeCountFractional',
    outputs: [{ internalType: 'UD60x18', name: '', type: 'uint256' }],
    stateMutability: 'view',
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
    outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'claimExpansionThreshold',
    outputs: [{ internalType: 'UD2x18', name: '', type: 'uint64' }],
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
    inputs: [{ internalType: 'uint256', name: 'winningRandomNumber_', type: 'uint256' }],
    name: 'closeDraw',
    outputs: [{ internalType: 'uint16', name: '', type: 'uint16' }],
    stateMutability: 'nonpayable',
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
    inputs: [],
    name: 'drawManager',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'drawPeriodSeconds',
    outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint8', name: 'numTiers', type: 'uint8' }],
    name: 'estimatedPrizeCount',
    outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
    stateMutability: 'pure',
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
    name: 'firstDrawStartsAt',
    outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_vault', type: 'address' },
      { internalType: 'uint16', name: '_startDrawIdInclusive', type: 'uint16' },
      { internalType: 'uint16', name: '_endDrawIdInclusive', type: 'uint16' }
    ],
    name: 'getContributedBetween',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getLastClosedDrawId',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getOpenDrawId',
    outputs: [{ internalType: 'uint16', name: '', type: 'uint16' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint8', name: '_tier', type: 'uint8' }],
    name: 'getTierAccrualDurationInDraws',
    outputs: [{ internalType: 'uint16', name: '', type: 'uint16' }],
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
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint8', name: '_tier', type: 'uint8' },
      { internalType: 'uint8', name: '_numberOfTiers', type: 'uint8' }
    ],
    name: 'getTierPrizeCount',
    outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
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
    outputs: [{ internalType: 'uint96', name: '', type: 'uint96' }],
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
      { internalType: 'uint16', name: '_startDrawIdInclusive', type: 'uint16' },
      { internalType: 'uint16', name: '_endDrawIdInclusive', type: 'uint16' }
    ],
    name: 'getTotalContributedBetween',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getTotalContributionsForClosedDraw',
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
      { internalType: 'uint16', name: '_startDrawId', type: 'uint16' },
      { internalType: 'uint16', name: '_endDrawId', type: 'uint16' }
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
    name: 'hasOpenDrawFinished',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint104', name: '_amount', type: 'uint104' }],
    name: 'increaseReserve',
    outputs: [],
    stateMutability: 'nonpayable',
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
    name: 'largestTierClaimed',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'lastClosedDrawAwardedAt',
    outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'lastClosedDrawEndedAt',
    outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'lastClosedDrawStartedAt',
    outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'nextNumberOfTiers',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
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
    name: 'openDrawEndsAt',
    outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'openDrawStartedAt',
    outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
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
    name: 'reserve',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'reserveForOpenDraw',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
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
    name: 'withdrawClaimRewards',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_to', type: 'address' },
      { internalType: 'uint104', name: '_amount', type: 'uint104' }
    ],
    name: 'withdrawReserve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'vault',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'winner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'recipient',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint16',
        name: 'drawId',
        type: 'uint16'
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: 'tier',
        type: 'uint8'
      },
      {
        indexed: false,
        internalType: 'uint32',
        name: 'prizeIndex',
        type: 'uint32'
      },
      {
        indexed: false,
        internalType: 'uint152',
        name: 'payout',
        type: 'uint152'
      },
      {
        indexed: false,
        internalType: 'uint96',
        name: 'fee',
        type: 'uint96'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'feeRecipient',
        type: 'address'
      }
    ],
    name: 'ClaimedPrize',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'vault',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'uint16',
        name: 'drawId',
        type: 'uint16'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'ContributePrizeTokens',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint16',
        name: 'drawId',
        type: 'uint16'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'winningRandomNumber',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: 'numTiers',
        type: 'uint8'
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: 'nextNumTiers',
        type: 'uint8'
      },
      {
        indexed: false,
        internalType: 'uint104',
        name: 'reserve',
        type: 'uint104'
      },
      {
        indexed: false,
        internalType: 'UD34x4',
        name: 'prizeTokensPerShare',
        type: 'uint128'
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'drawStartedAt',
        type: 'uint64'
      }
    ],
    name: 'DrawClosed',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'drawManager',
        type: 'address'
      }
    ],
    name: 'DrawManagerSet',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'IncreaseClaimRewards',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'IncreaseReserve',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'ReserveConsumed',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'available',
        type: 'uint256'
      }
    ],
    name: 'WithdrawClaimRewards',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'WithdrawReserve',
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
  { inputs: [], name: 'RngRelayerZeroAddress', type: 'error' },
  { inputs: [], name: 'SequenceAlreadyCompleted', type: 'error' }
] as const
