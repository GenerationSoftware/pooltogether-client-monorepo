export const rngRelayABI = [
  {
    inputs: [
      { internalType: 'contract IMessageDispatcher', name: '_messageDispatcher', type: 'address' },
      { internalType: 'uint256', name: '_remoteOwnerChainId', type: 'uint256' },
      { internalType: 'contract RemoteOwner', name: '_remoteOwner', type: 'address' },
      {
        internalType: 'contract IRngAuctionRelayListener',
        name: '_remoteRngAuctionRelayListener',
        type: 'address'
      },
      { internalType: 'address', name: '_rewardRecipient', type: 'address' }
    ],
    name: 'relay',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: '_destination', type: 'address' }],
    name: 'remapTo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: '_addr', type: 'address' }],
    name: 'remappingOf',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'rngAuction',
    outputs: [{ internalType: 'contract RngAuction', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'caller', type: 'address' },
      { indexed: true, internalType: 'address', name: 'destination', type: 'address' }
    ],
    name: 'AddressRemapped',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'contract IMessageDispatcher',
        name: 'messageDispatcher',
        type: 'address'
      },
      { indexed: true, internalType: 'uint256', name: 'remoteOwnerChainId', type: 'uint256' },
      {
        indexed: false,
        internalType: 'contract RemoteOwner',
        name: 'remoteOwner',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'contract IRngAuctionRelayListener',
        name: 'remoteRngAuctionRelayListener',
        type: 'address'
      },
      { indexed: true, internalType: 'address', name: 'rewardRecipient', type: 'address' },
      { indexed: true, internalType: 'bytes32', name: 'messageId', type: 'bytes32' }
    ],
    name: 'RelayedToDispatcher',
    type: 'event'
  },
  { inputs: [], name: 'MessageDispatcherIsZeroAddress', type: 'error' },
  { inputs: [], name: 'RemoteOwnerIsZeroAddress', type: 'error' },
  { inputs: [], name: 'RemoteRngAuctionRelayListenerIsZeroAddress', type: 'error' },
  { inputs: [], name: 'RewardRecipientIsZeroAddress', type: 'error' },
  { inputs: [], name: 'RngAuctionIsZeroAddress', type: 'error' },
  { inputs: [], name: 'RngNotCompleted', type: 'error' }
] as const
