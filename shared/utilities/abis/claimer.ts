export const claimerABI = [
  {
    inputs: [
      { internalType: 'contract PrizePool', name: '_prizePool', type: 'address' },
      { internalType: 'uint256', name: '_timeToReachMaxFee', type: 'uint256' },
      { internalType: 'UD2x18', name: '_maxFeePortionOfPrize', type: 'uint64' }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'winnersLength', type: 'uint256' },
      { internalType: 'uint256', name: 'prizeIndicesLength', type: 'uint256' }
    ],
    name: 'ClaimArraySizeMismatch',
    type: 'error'
  },
  { inputs: [], name: 'FeeRecipientZeroAddress', type: 'error' },
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
    inputs: [{ internalType: 'uint256', name: 'x', type: 'uint256' }],
    name: 'PRBMath_UD60x18_Convert_Overflow',
    type: 'error'
  },
  { inputs: [], name: 'PrizePoolZeroAddress', type: 'error' },
  { inputs: [], name: 'TimeToReachMaxFeeZero', type: 'error' },
  {
    inputs: [
      { internalType: 'uint256', name: 'minFee', type: 'uint256' },
      { internalType: 'uint256', name: 'fee', type: 'uint256' }
    ],
    name: 'VrgdaClaimFeeBelowMin',
    type: 'error'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'contract IClaimable', name: 'vault', type: 'address' },
      { indexed: true, internalType: 'uint8', name: 'tier', type: 'uint8' },
      { indexed: true, internalType: 'address', name: 'winner', type: 'address' },
      { indexed: false, internalType: 'uint32', name: 'prizeIndex', type: 'uint32' },
      { indexed: false, internalType: 'bytes', name: 'reason', type: 'bytes' }
    ],
    name: 'ClaimError',
    type: 'event'
  },
  {
    inputs: [
      { internalType: 'contract IClaimable', name: '_vault', type: 'address' },
      { internalType: 'uint8', name: '_tier', type: 'uint8' },
      { internalType: 'address[]', name: '_winners', type: 'address[]' },
      { internalType: 'uint32[][]', name: '_prizeIndices', type: 'uint32[][]' },
      { internalType: 'address', name: '_feeRecipient', type: 'address' },
      { internalType: 'uint256', name: '_minFeePerClaim', type: 'uint256' }
    ],
    name: 'claimPrizes',
    outputs: [{ internalType: 'uint256', name: 'totalFees', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint8', name: '_tier', type: 'uint8' },
      { internalType: 'uint256', name: '_claimCount', type: 'uint256' }
    ],
    name: 'computeFeePerClaim',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint8', name: '_tier', type: 'uint8' }],
    name: 'computeMaxFee',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint8', name: '_tier', type: 'uint8' },
      { internalType: 'uint256', name: '_claimCount', type: 'uint256' }
    ],
    name: 'computeTotalFees',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint8', name: '_tier', type: 'uint8' },
      { internalType: 'uint256', name: '_claimCount', type: 'uint256' },
      { internalType: 'uint256', name: '_claimedCount', type: 'uint256' }
    ],
    name: 'computeTotalFees',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'maxFeePortionOfPrize',
    outputs: [{ internalType: 'UD2x18', name: '', type: 'uint64' }],
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
    name: 'timeToReachMaxFee',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const
