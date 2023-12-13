export const flashLiquidatorABI = [
  {
    inputs: [
      { internalType: 'contract ILiquidationPair', name: '_liquidationPair', type: 'address' },
      { internalType: 'bytes', name: '_path', type: 'bytes' }
    ],
    name: 'findBestQuoteStatic',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
          { internalType: 'uint256', name: 'amountOut', type: 'uint256' },
          { internalType: 'uint256', name: 'profit', type: 'uint256' },
          { internalType: 'bool', name: 'success', type: 'bool' }
        ],
        internalType: 'struct UniswapFlashLiquidation.ProfitInfo',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'contract ILiquidationPair', name: '_liquidationPair', type: 'address' },
      { internalType: 'address', name: '_receiver', type: 'address' },
      { internalType: 'uint256', name: '_amountOut', type: 'uint256' },
      { internalType: 'uint256', name: '_amountInMax', type: 'uint256' },
      { internalType: 'uint256', name: '_profitMin', type: 'uint256' },
      { internalType: 'uint256', name: '_deadline', type: 'uint256' },
      { internalType: 'bytes', name: '_path', type: 'bytes' }
    ],
    name: 'flashLiquidate',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'uint256', name: '_amountIn', type: 'uint256' },
      { internalType: 'uint256', name: '_amountOut', type: 'uint256' },
      { internalType: 'bytes', name: '_path', type: 'bytes' }
    ],
    name: 'flashSwapCallback',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_amountOut', type: 'uint256' },
      { internalType: 'contract ILiquidationPair', name: '_liquidationPair', type: 'address' },
      { internalType: 'bytes', name: '_path', type: 'bytes' }
    ],
    name: 'getProfitInfoStatic',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
          { internalType: 'uint256', name: 'amountOut', type: 'uint256' },
          { internalType: 'uint256', name: 'profit', type: 'uint256' },
          { internalType: 'bool', name: 'success', type: 'bool' }
        ],
        internalType: 'struct UniswapFlashLiquidation.ProfitInfo',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'quoter',
    outputs: [{ internalType: 'contract IUniswapV3StaticQuoter', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'router',
    outputs: [{ internalType: 'contract IV3SwapRouter', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'receiver', type: 'address' },
      {
        indexed: true,
        internalType: 'contract ILiquidationPair',
        name: 'liquidationPair',
        type: 'address'
      },
      { indexed: false, internalType: 'bytes', name: 'path', type: 'bytes' },
      { indexed: false, internalType: 'uint256', name: 'profit', type: 'uint256' }
    ],
    name: 'FlashSwapLiquidation',
    type: 'event'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'timestamp', type: 'uint256' },
      { internalType: 'uint256', name: 'deadline', type: 'uint256' }
    ],
    name: 'FlashLiquidationExpired',
    type: 'error'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'profit', type: 'uint256' },
      { internalType: 'uint256', name: 'minProfit', type: 'uint256' }
    ],
    name: 'InsufficientProfit',
    type: 'error'
  },
  { inputs: [], name: 'QuoterZeroAddress', type: 'error' },
  { inputs: [], name: 'RouterZeroAddress', type: 'error' }
] as const
