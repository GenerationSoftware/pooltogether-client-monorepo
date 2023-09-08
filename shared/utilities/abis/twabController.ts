export const twabControllerABI = [
  {
    inputs: [],
    name: 'PERIOD_LENGTH',
    outputs: [{ internalType: 'uint48', name: '', type: 'uint48' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'PERIOD_OFFSET',
    outputs: [{ internalType: 'uint48', name: '', type: 'uint48' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'vault', type: 'address' },
      { internalType: 'address', name: 'user', type: 'address' }
    ],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_from', type: 'address' },
      { internalType: 'uint112', name: '_amount', type: 'uint112' }
    ],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'currentOverwritePeriodStartedAt',
    outputs: [{ internalType: 'uint48', name: '', type: 'uint48' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_vault', type: 'address' },
      { internalType: 'address', name: '_to', type: 'address' }
    ],
    name: 'delegate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'vault', type: 'address' },
      { internalType: 'address', name: 'user', type: 'address' }
    ],
    name: 'delegateBalanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'vault', type: 'address' },
      { internalType: 'address', name: 'user', type: 'address' }
    ],
    name: 'delegateOf',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'vault', type: 'address' },
      { internalType: 'address', name: 'user', type: 'address' }
    ],
    name: 'getAccount',
    outputs: [
      {
        components: [
          {
            components: [
              { internalType: 'uint112', name: 'balance', type: 'uint112' },
              { internalType: 'uint112', name: 'delegateBalance', type: 'uint112' },
              { internalType: 'uint16', name: 'nextObservationIndex', type: 'uint16' },
              { internalType: 'uint16', name: 'cardinality', type: 'uint16' }
            ],
            internalType: 'struct TwabLib.AccountDetails',
            name: 'details',
            type: 'tuple'
          },
          {
            components: [
              { internalType: 'uint160', name: 'cumulativeBalance', type: 'uint160' },
              { internalType: 'uint48', name: 'timestamp', type: 'uint48' }
            ],
            internalType: 'struct ObservationLib.Observation[9600]',
            name: 'observations',
            type: 'tuple[9600]'
          }
        ],
        internalType: 'struct TwabLib.Account',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'vault', type: 'address' },
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'uint48', name: 'periodEndOnOrAfterTime', type: 'uint48' }
    ],
    name: 'getBalanceAt',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'vault', type: 'address' },
      { internalType: 'address', name: 'user', type: 'address' }
    ],
    name: 'getNewestObservation',
    outputs: [
      { internalType: 'uint16', name: '', type: 'uint16' },
      {
        components: [
          { internalType: 'uint160', name: 'cumulativeBalance', type: 'uint160' },
          { internalType: 'uint48', name: 'timestamp', type: 'uint48' }
        ],
        internalType: 'struct ObservationLib.Observation',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'vault', type: 'address' }],
    name: 'getNewestTotalSupplyObservation',
    outputs: [
      { internalType: 'uint16', name: '', type: 'uint16' },
      {
        components: [
          { internalType: 'uint160', name: 'cumulativeBalance', type: 'uint160' },
          { internalType: 'uint48', name: 'timestamp', type: 'uint48' }
        ],
        internalType: 'struct ObservationLib.Observation',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'vault', type: 'address' },
      { internalType: 'address', name: 'user', type: 'address' }
    ],
    name: 'getOldestObservation',
    outputs: [
      { internalType: 'uint16', name: '', type: 'uint16' },
      {
        components: [
          { internalType: 'uint160', name: 'cumulativeBalance', type: 'uint160' },
          { internalType: 'uint48', name: 'timestamp', type: 'uint48' }
        ],
        internalType: 'struct ObservationLib.Observation',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'vault', type: 'address' }],
    name: 'getOldestTotalSupplyObservation',
    outputs: [
      { internalType: 'uint16', name: '', type: 'uint16' },
      {
        components: [
          { internalType: 'uint160', name: 'cumulativeBalance', type: 'uint160' },
          { internalType: 'uint48', name: 'timestamp', type: 'uint48' }
        ],
        internalType: 'struct ObservationLib.Observation',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint48', name: 'time', type: 'uint48' }],
    name: 'getTimestampPeriod',
    outputs: [{ internalType: 'uint48', name: '', type: 'uint48' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'vault', type: 'address' }],
    name: 'getTotalSupplyAccount',
    outputs: [
      {
        components: [
          {
            components: [
              { internalType: 'uint112', name: 'balance', type: 'uint112' },
              { internalType: 'uint112', name: 'delegateBalance', type: 'uint112' },
              { internalType: 'uint16', name: 'nextObservationIndex', type: 'uint16' },
              { internalType: 'uint16', name: 'cardinality', type: 'uint16' }
            ],
            internalType: 'struct TwabLib.AccountDetails',
            name: 'details',
            type: 'tuple'
          },
          {
            components: [
              { internalType: 'uint160', name: 'cumulativeBalance', type: 'uint160' },
              { internalType: 'uint48', name: 'timestamp', type: 'uint48' }
            ],
            internalType: 'struct ObservationLib.Observation[9600]',
            name: 'observations',
            type: 'tuple[9600]'
          }
        ],
        internalType: 'struct TwabLib.Account',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'vault', type: 'address' },
      { internalType: 'uint48', name: 'periodEndOnOrAfterTime', type: 'uint48' }
    ],
    name: 'getTotalSupplyAt',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'vault', type: 'address' },
      { internalType: 'uint48', name: 'startTime', type: 'uint48' },
      { internalType: 'uint48', name: 'endTime', type: 'uint48' }
    ],
    name: 'getTotalSupplyTwabBetween',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'vault', type: 'address' },
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'uint48', name: 'startTime', type: 'uint48' },
      { internalType: 'uint48', name: 'endTime', type: 'uint48' }
    ],
    name: 'getTwabBetween',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint48', name: 'time', type: 'uint48' }],
    name: 'hasFinalized',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_to', type: 'address' },
      { internalType: 'uint112', name: '_amount', type: 'uint112' }
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint48', name: '_timestamp', type: 'uint48' }],
    name: 'periodEndOnOrAfter',
    outputs: [{ internalType: 'uint48', name: '', type: 'uint48' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: '_from', type: 'address' }],
    name: 'sponsor',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'vault', type: 'address' }],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'vault', type: 'address' }],
    name: 'totalSupplyDelegateBalance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_from', type: 'address' },
      { internalType: 'address', name: '_to', type: 'address' },
      { internalType: 'uint112', name: '_amount', type: 'uint112' }
    ],
    name: 'transfer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'vault', type: 'address' },
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'uint112', name: 'amount', type: 'uint112' },
      { indexed: false, internalType: 'uint112', name: 'delegateAmount', type: 'uint112' }
    ],
    name: 'DecreasedBalance',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'vault', type: 'address' },
      { indexed: false, internalType: 'uint112', name: 'amount', type: 'uint112' },
      { indexed: false, internalType: 'uint112', name: 'delegateAmount', type: 'uint112' }
    ],
    name: 'DecreasedTotalSupply',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'vault', type: 'address' },
      { indexed: true, internalType: 'address', name: 'delegator', type: 'address' },
      { indexed: true, internalType: 'address', name: 'delegate', type: 'address' }
    ],
    name: 'Delegated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'vault', type: 'address' },
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'uint112', name: 'amount', type: 'uint112' },
      { indexed: false, internalType: 'uint112', name: 'delegateAmount', type: 'uint112' }
    ],
    name: 'IncreasedBalance',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'vault', type: 'address' },
      { indexed: false, internalType: 'uint112', name: 'amount', type: 'uint112' },
      { indexed: false, internalType: 'uint112', name: 'delegateAmount', type: 'uint112' }
    ],
    name: 'IncreasedTotalSupply',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'vault', type: 'address' },
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'uint112', name: 'balance', type: 'uint112' },
      { indexed: false, internalType: 'uint112', name: 'delegateBalance', type: 'uint112' },
      { indexed: false, internalType: 'bool', name: 'isNew', type: 'bool' },
      {
        components: [
          { internalType: 'uint160', name: 'cumulativeBalance', type: 'uint160' },
          { internalType: 'uint48', name: 'timestamp', type: 'uint48' }
        ],
        indexed: false,
        internalType: 'struct ObservationLib.Observation',
        name: 'observation',
        type: 'tuple'
      }
    ],
    name: 'ObservationRecorded',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'vault', type: 'address' },
      { indexed: false, internalType: 'uint112', name: 'balance', type: 'uint112' },
      { indexed: false, internalType: 'uint112', name: 'delegateBalance', type: 'uint112' },
      { indexed: false, internalType: 'bool', name: 'isNew', type: 'bool' },
      {
        components: [
          { internalType: 'uint160', name: 'cumulativeBalance', type: 'uint160' },
          { internalType: 'uint48', name: 'timestamp', type: 'uint48' }
        ],
        indexed: false,
        internalType: 'struct ObservationLib.Observation',
        name: 'observation',
        type: 'tuple'
      }
    ],
    name: 'TotalSupplyObservationRecorded',
    type: 'event'
  },
  {
    inputs: [
      { internalType: 'uint112', name: 'balance', type: 'uint112' },
      { internalType: 'uint112', name: 'amount', type: 'uint112' },
      { internalType: 'string', name: 'message', type: 'string' }
    ],
    name: 'BalanceLTAmount',
    type: 'error'
  },
  { inputs: [], name: 'CannotTransferToSponsorshipAddress', type: 'error' },
  {
    inputs: [
      { internalType: 'uint112', name: 'delegateBalance', type: 'uint112' },
      { internalType: 'uint112', name: 'delegateAmount', type: 'uint112' },
      { internalType: 'string', name: 'message', type: 'string' }
    ],
    name: 'DelegateBalanceLTAmount',
    type: 'error'
  },
  {
    inputs: [
      { internalType: 'uint48', name: 'requestedTimestamp', type: 'uint48' },
      { internalType: 'uint48', name: 'oldestTimestamp', type: 'uint48' }
    ],
    name: 'InsufficientHistory',
    type: 'error'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'start', type: 'uint256' },
      { internalType: 'uint256', name: 'end', type: 'uint256' }
    ],
    name: 'InvalidTimeRange',
    type: 'error'
  },
  { inputs: [], name: 'PeriodLengthTooShort', type: 'error' },
  {
    inputs: [{ internalType: 'uint48', name: 'periodOffset', type: 'uint48' }],
    name: 'PeriodOffsetInFuture',
    type: 'error'
  },
  {
    inputs: [{ internalType: 'address', name: 'delegate', type: 'address' }],
    name: 'SameDelegateAlreadySet',
    type: 'error'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'timestamp', type: 'uint256' },
      { internalType: 'uint256', name: 'currentOverwritePeriodStartedAt', type: 'uint256' }
    ],
    name: 'TimestampNotFinalized',
    type: 'error'
  },
  { inputs: [], name: 'TransferToZeroAddress', type: 'error' }
] as const
