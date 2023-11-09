import { Address, PublicClient } from 'viem'
import {
  LIQUIDATION_ROUTER_ADDRESSES,
  MSG_EXECUTOR_ADDRESSES,
  RNG_AUCTION,
  RNG_RELAY_ADDRESSES,
  TWAB_REWARDS_ADDRESSES
} from '../constants'
import { getLiquidationPairAddresses } from './liquidations'

/**
 * Returns `Deposit` events on a given vault
 * @param publicClient a public Viem client to query through
 * @param vaultAddress a vault address to get events for
 * @param options optional settings
 * @returns
 */
export const getDepositEvents = async (
  publicClient: PublicClient,
  vaultAddress: Address,
  options?: { fromBlock?: bigint; toBlock?: bigint }
) => {
  return await publicClient.getLogs({
    address: vaultAddress,
    event: {
      inputs: [
        { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
        { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
        { indexed: false, internalType: 'uint256', name: 'assets', type: 'uint256' },
        { indexed: false, internalType: 'uint256', name: 'shares', type: 'uint256' }
      ],
      name: 'Deposit',
      type: 'event'
    },
    fromBlock: options?.fromBlock,
    toBlock: options?.toBlock ?? 'latest',
    strict: true
  })
}

/**
 * Returns `Withdraw` events on a given vault
 * @param publicClient a public Viem client to query through
 * @param vaultAddress a vault address to get events for
 * @param options optional settings
 * @returns
 */
export const getWithdrawEvents = async (
  publicClient: PublicClient,
  vaultAddress: Address,
  options?: { fromBlock?: bigint; toBlock?: bigint }
) => {
  return await publicClient.getLogs({
    address: vaultAddress,
    event: {
      inputs: [
        { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
        { indexed: true, internalType: 'address', name: 'receiver', type: 'address' },
        { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
        { indexed: false, internalType: 'uint256', name: 'assets', type: 'uint256' },
        { indexed: false, internalType: 'uint256', name: 'shares', type: 'uint256' }
      ],
      name: 'Withdraw',
      type: 'event'
    },
    fromBlock: options?.fromBlock,
    toBlock: options?.toBlock ?? 'latest',
    strict: true
  })
}

/**
 * Returns `RelayedToDispatcher` events
 * @param publicClient a public Viem client to query through
 * @param options optional settings
 * @returns
 */
export const getRngL1RelayMsgEvents = async (
  publicClient: PublicClient,
  options?: { fromBlock?: bigint; toBlock?: bigint }
) => {
  const chainId = await publicClient.getChainId()

  const rngRelayContractAddress = RNG_RELAY_ADDRESSES[chainId]

  if (!rngRelayContractAddress)
    throw new Error(`No relay auction contract set for chain ID ${chainId}`)

  return await publicClient.getLogs({
    address: rngRelayContractAddress,
    event: {
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
    fromBlock: options?.fromBlock,
    toBlock: options?.toBlock ?? 'latest',
    strict: true
  })
}

/**
 * Returns `MessageIdExecuted` events
 * @param publicClient a public Viem client to query through
 * @param options optional settings
 * @returns
 */
export const getRngL2RelayMsgEvents = async (
  publicClient: PublicClient,
  options?: { fromBlock?: bigint; toBlock?: bigint }
) => {
  const chainId = await publicClient.getChainId()

  const msgExecutorContractAddress = MSG_EXECUTOR_ADDRESSES[chainId]

  if (!msgExecutorContractAddress)
    throw new Error(`No message executor contract set for chain ID ${chainId}`)

  return await publicClient.getLogs({
    address: msgExecutorContractAddress,
    event: {
      inputs: [
        { indexed: true, internalType: 'uint256', name: 'fromChainId', type: 'uint256' },
        { indexed: true, internalType: 'bytes32', name: 'messageId', type: 'bytes32' }
      ],
      name: 'MessageIdExecuted',
      type: 'event'
    },
    fromBlock: options?.fromBlock,
    toBlock: options?.toBlock ?? 'latest',
    strict: true
  })
}

/**
 * Returns `DrawAwarded` events
 * @param publicClient a public Viem client to query through
 * @param prizePoolAddress the address of the prize pool to query events for
 * @param options optional settings
 * @returns
 */
export const getDrawAwardedEvents = async (
  publicClient: PublicClient,
  prizePoolAddress: Address,
  options?: { fromBlock?: bigint; toBlock?: bigint }
) => {
  return await publicClient.getLogs({
    address: prizePoolAddress,
    event: {
      inputs: [
        { indexed: true, internalType: 'uint24', name: 'drawId', type: 'uint24' },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'winningRandomNumber',
          type: 'uint256'
        },
        { indexed: false, internalType: 'uint8', name: 'lastNumTiers', type: 'uint8' },
        { indexed: false, internalType: 'uint8', name: 'numTiers', type: 'uint8' },
        { indexed: false, internalType: 'uint104', name: 'reserve', type: 'uint104' },
        {
          indexed: false,
          internalType: 'UD34x4',
          name: 'prizeTokensPerShare',
          type: 'uint128'
        },
        { indexed: false, internalType: 'uint48', name: 'drawOpenedAt', type: 'uint48' }
      ],
      name: 'DrawAwarded',
      type: 'event'
    },
    fromBlock: options?.fromBlock,
    toBlock: options?.toBlock ?? 'latest',
    strict: true
  })
}

/**
 * Returns `SwappedExactAmountOut` events
 * @param publicClient a public Viem client to query through
 * @param options optional settings
 * @returns
 */
export const getLiquidationEvents = async (
  publicClient: PublicClient,
  options?: { fromBlock?: bigint; toBlock?: bigint }
): Promise<
  {
    address: Address
    args: {
      amountIn: bigint
      amountInMax: bigint
      amountOut: bigint
      sender: Address
      receiver: Address
      liquidationPair: Address
    }
    blockNumber: bigint
    logIndex: number
    transactionHash: `0x${string}`
  }[]
> => {
  const chainId = await publicClient.getChainId()

  const liqRouterContractAddress = LIQUIDATION_ROUTER_ADDRESSES[chainId]

  if (!liqRouterContractAddress)
    throw new Error(`No liquidation router contract set for chain ID ${chainId}`)

  const lpAddresses = await getLiquidationPairAddresses(publicClient)

  const lpEvents = !!lpAddresses.length
    ? await publicClient.getLogs({
        address: lpAddresses,
        event: {
          inputs: [
            { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
            { indexed: true, internalType: 'address', name: 'receiver', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'amountOut', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'amountInMax', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'amountIn', type: 'uint256' },
            { indexed: false, internalType: 'bytes', name: 'flashSwapData', type: 'bytes' }
          ],
          name: 'SwappedExactAmountOut',
          type: 'event'
        },
        fromBlock: options?.fromBlock,
        toBlock: options?.toBlock ?? 'latest',
        strict: true
      })
    : []

  const filteredLpEvents = lpEvents.filter(
    (lpEvent) => lpEvent.args.sender.toLowerCase() !== liqRouterContractAddress.toLowerCase()
  )
  const formattedLpEvents = filteredLpEvents.map((lpEvent) => ({
    ...lpEvent,
    args: { ...lpEvent.args, liquidationPair: lpEvent.address }
  }))

  const routerEvents = await publicClient.getLogs({
    address: liqRouterContractAddress,
    event: {
      inputs: [
        {
          indexed: true,
          internalType: 'contract LiquidationPair',
          name: 'liquidationPair',
          type: 'address'
        },
        { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
        { indexed: true, internalType: 'address', name: 'receiver', type: 'address' },
        { indexed: false, internalType: 'uint256', name: 'amountOut', type: 'uint256' },
        { indexed: false, internalType: 'uint256', name: 'amountInMax', type: 'uint256' },
        { indexed: false, internalType: 'uint256', name: 'amountIn', type: 'uint256' },
        { indexed: false, internalType: 'uint256', name: 'deadline', type: 'uint256' }
      ],
      name: 'SwappedExactAmountOut',
      type: 'event'
    },
    fromBlock: options?.fromBlock,
    toBlock: options?.toBlock ?? 'latest',
    strict: true
  })

  return [...routerEvents, ...formattedLpEvents].sort((a, b) =>
    Number(a.blockNumber - b.blockNumber)
  )
}

/**
 * Returns `ContributedReserve` events
 * @param publicClient a public Viem client to query through
 * @param prizePoolAddress the address of the prize pool to query events for
 * @param options optional settings
 * @returns
 */
export const getManualContributionEvents = async (
  publicClient: PublicClient,
  prizePoolAddress: Address,
  options?: { fromBlock?: bigint; toBlock?: bigint }
) => {
  return await publicClient.getLogs({
    address: prizePoolAddress,
    event: {
      inputs: [
        { indexed: true, internalType: 'address', name: 'user', type: 'address' },
        { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
      ],
      name: 'ContributedReserve',
      type: 'event'
    },
    fromBlock: options?.fromBlock,
    toBlock: options?.toBlock ?? 'latest',
    strict: true
  })
}

/**
 * Returns `ReserveConsumed` events
 * @param publicClient a public Viem client to query through
 * @param prizePoolAddress the address of the prize pool to query events for
 * @param options optional settings
 * @returns
 */
export const getPrizeBackstopEvents = async (
  publicClient: PublicClient,
  prizePoolAddress: Address,
  options?: { fromBlock?: bigint; toBlock?: bigint }
) => {
  return await publicClient.getLogs({
    address: prizePoolAddress,
    event: {
      inputs: [{ indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }],
      name: 'ReserveConsumed',
      type: 'event'
    },
    fromBlock: options?.fromBlock,
    toBlock: options?.toBlock ?? 'latest',
    strict: true
  })
}

/**
 * Returns `AuctionRewardAllocated` events
 * @param publicClient a public Viem client to query through
 * @param options optional settings
 * @returns
 */
export const getRelayAuctionEvents = async (
  publicClient: PublicClient,
  options?: { fromBlock?: bigint; toBlock?: bigint }
) => {
  const chainId = await publicClient.getChainId()

  const rngRelayContractAddress = RNG_RELAY_ADDRESSES[chainId]

  if (!rngRelayContractAddress)
    throw new Error(`No relay auction contract set for chain ID ${chainId}`)

  return await publicClient.getLogs({
    address: rngRelayContractAddress,
    event: {
      inputs: [
        { indexed: true, internalType: 'uint32', name: 'sequenceId', type: 'uint32' },
        { indexed: true, internalType: 'address', name: 'recipient', type: 'address' },
        { indexed: true, internalType: 'uint32', name: 'index', type: 'uint32' },
        { indexed: false, internalType: 'uint256', name: 'reward', type: 'uint256' }
      ],
      name: 'AuctionRewardAllocated',
      type: 'event'
    },
    fromBlock: options?.fromBlock,
    toBlock: options?.toBlock ?? 'latest',
    strict: true
  })
}

/**
 * Returns `RngAuctionCompleted` events
 * @param publicClient a public Viem client to query through
 * @param options optional settings
 * @returns
 */
export const getRngAuctionEvents = async (
  publicClient: PublicClient,
  options?: { fromBlock?: bigint; toBlock?: bigint }
) => {
  const chainId = await publicClient.getChainId()

  const rngAuctionContract = RNG_AUCTION[chainId]

  if (!rngAuctionContract) throw new Error(`No RNG auction contract set for chain ID ${chainId}`)

  return await publicClient.getLogs({
    address: rngAuctionContract.address,
    event: {
      inputs: [
        { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
        { indexed: true, internalType: 'address', name: 'recipient', type: 'address' },
        { indexed: true, internalType: 'uint32', name: 'sequenceId', type: 'uint32' },
        { indexed: false, internalType: 'contract RNGInterface', name: 'rng', type: 'address' },
        { indexed: false, internalType: 'uint32', name: 'rngRequestId', type: 'uint32' },
        { indexed: false, internalType: 'uint64', name: 'elapsedTime', type: 'uint64' },
        { indexed: false, internalType: 'UD2x18', name: 'rewardFraction', type: 'uint64' }
      ],
      name: 'RngAuctionCompleted',
      type: 'event'
    },
    fromBlock: options?.fromBlock,
    toBlock: options?.toBlock ?? 'latest',
    strict: true
  })
}

/**
 * Returns `Transfer` events for a given token
 * @param publicClient a public Viem client to query through
 * @param tokenAddress the token address to query transfers for
 * @param options optional settings
 * @returns
 */
export const getTokenTransferEvents = async (
  publicClient: PublicClient,
  tokenAddress: Address,
  options?: { from?: Address[]; to?: Address[]; fromBlock?: bigint; toBlock?: bigint }
) => {
  return await publicClient.getLogs({
    address: tokenAddress,
    event: {
      inputs: [
        { indexed: true, internalType: 'address', name: 'from', type: 'address' },
        { indexed: true, internalType: 'address', name: 'to', type: 'address' },
        { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' }
      ],
      name: 'Transfer',
      type: 'event'
    },
    args: {
      from: options?.from,
      to: options?.to
    },
    fromBlock: options?.fromBlock,
    toBlock: options?.toBlock ?? 'latest',
    strict: true
  })
}

/**
 * Returns `PromotionCreated` events
 * @param publicClient a public Viem client to query through
 * @param options optional settings
 * @returns
 */
export const getPromotionCreatedEvents = async (
  publicClient: PublicClient,
  options?: {
    vaultAddresses?: Address[]
    tokenAddresses?: Address[]
    fromBlock?: bigint
    toBlock?: bigint
  }
) => {
  const chainId = await publicClient.getChainId()

  const twabRewardsAddress = TWAB_REWARDS_ADDRESSES[chainId]

  if (!twabRewardsAddress) throw new Error(`No TWAB rewards contract set for chain ID ${chainId}`)

  return await publicClient.getLogs({
    address: twabRewardsAddress,
    event: {
      inputs: [
        { indexed: true, internalType: 'uint256', name: 'promotionId', type: 'uint256' },
        { indexed: true, internalType: 'address', name: 'vault', type: 'address' },
        { indexed: true, internalType: 'contract IERC20', name: 'token', type: 'address' }
      ],
      name: 'PromotionCreated',
      type: 'event'
    },
    args: {
      vault: options?.vaultAddresses,
      token: options?.tokenAddresses
    },
    fromBlock: options?.fromBlock,
    toBlock: options?.toBlock ?? 'latest',
    strict: true
  })
}

/**
 * Returns `RewardsClaimed` events
 * @param publicClient a public Viem client to query through
 * @param options optional settings
 * @returns
 */
export const getPromotionRewardsClaimedEvents = async (
  publicClient: PublicClient,
  options?: {
    promotionIds?: bigint[]
    userAddresses?: Address[]
    fromBlock?: bigint
    toBlock?: bigint
  }
) => {
  const chainId = await publicClient.getChainId()

  const twabRewardsAddress = TWAB_REWARDS_ADDRESSES[chainId]

  if (!twabRewardsAddress) throw new Error(`No TWAB rewards contract set for chain ID ${chainId}`)

  return await publicClient.getLogs({
    address: twabRewardsAddress,
    event: {
      inputs: [
        { indexed: true, internalType: 'uint256', name: 'promotionId', type: 'uint256' },
        { indexed: false, internalType: 'uint8[]', name: 'epochIds', type: 'uint8[]' },
        { indexed: true, internalType: 'address', name: 'user', type: 'address' },
        { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
      ],
      name: 'RewardsClaimed',
      type: 'event'
    },
    args: {
      promotionId: options?.promotionIds,
      user: options?.userAddresses
    },
    fromBlock: options?.fromBlock,
    toBlock: options?.toBlock ?? 'latest',
    strict: true
  })
}
