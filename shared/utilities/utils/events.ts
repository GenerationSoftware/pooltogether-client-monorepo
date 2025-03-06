import { DSKit } from 'dskit-eth'
import { Address, PublicClient } from 'viem'
import {
  LIQUIDATION_ROUTER_ADDRESSES,
  POOL_WIDE_TWAB_REWARDS_ADDRESSES,
  TWAB_REWARDS_ADDRESSES
} from '../constants'
import { getLiquidationPairAddresses } from './liquidations'

/**
 * Returns `Deposit` events
 * @param publicClient a public Viem client to query through
 * @param vaultAddresses vault addresses to get events for
 * @param options optional settings
 * @returns
 */
export const getDepositEvents = async (
  publicClient: PublicClient,
  vaultAddresses: Address[],
  options?: { sender?: Address[]; owner?: Address[]; fromBlock?: bigint; toBlock?: bigint }
) => {
  return await publicClient.getLogs({
    address: vaultAddresses,
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
    args: { sender: options?.sender ?? null, owner: options?.owner ?? null },
    fromBlock: options?.fromBlock,
    toBlock: options?.toBlock ?? 'latest',
    strict: true
  })
}

/**
 * Returns `Withdraw` events
 * @param publicClient a public Viem client to query through
 * @param vaultAddresses vault addresses to get events for
 * @param options optional settings
 * @returns
 */
export const getWithdrawEvents = async (
  publicClient: PublicClient,
  vaultAddresses: Address[],
  options?: {
    sender?: Address[]
    receiver?: Address[]
    owner?: Address[]
    fromBlock?: bigint
    toBlock?: bigint
  }
) => {
  return await publicClient.getLogs({
    address: vaultAddresses,
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
    args: {
      sender: options?.sender ?? null,
      receiver: options?.receiver ?? null,
      owner: options?.owner ?? null
    },
    fromBlock: options?.fromBlock,
    toBlock: options?.toBlock ?? 'latest',
    strict: true
  })
}

/**
 * Returns `DrawStarted` events from a draw manager contract
 * @param publicClient a public Viem client to query through
 * @param drawManagerAddress the address of a prize pool's draw manager to query events for
 * @param options optional settings
 * @returns
 */
export const getDrawStartedEvents = async (
  publicClient: PublicClient,
  drawManagerAddress: Address,
  options?: { fromBlock?: bigint; toBlock?: bigint }
) => {
  return await publicClient.getLogs({
    address: drawManagerAddress,
    event: {
      inputs: [
        { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
        { indexed: true, internalType: 'address', name: 'recipient', type: 'address' },
        { indexed: true, internalType: 'uint24', name: 'drawId', type: 'uint24' },
        { indexed: false, internalType: 'uint48', name: 'elapsedTime', type: 'uint48' },
        { indexed: false, internalType: 'uint256', name: 'reward', type: 'uint256' },
        { indexed: false, internalType: 'uint32', name: 'rngRequestId', type: 'uint32' },
        { indexed: false, internalType: 'uint64', name: 'count', type: 'uint64' }
      ],
      name: 'DrawStarted',
      type: 'event'
    },
    fromBlock: options?.fromBlock,
    toBlock: options?.toBlock ?? 'latest',
    strict: true
  })
}

/**
 * Returns `DrawAwarded` events from a prize pool contract
 * @param publicClient a public Viem client to query through
 * @param prizePoolAddress the address of a prize pool to query events for
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
    fromBlock: options?.fromBlock,
    toBlock: options?.toBlock ?? 'latest',
    strict: true
  })
}

/**
 * Returns `DrawFinished` events from a draw manager contract
 * @param publicClient a public Viem client to query through
 * @param drawManagerAddress the address of a prize pool's draw manager to query events for
 * @param options optional settings
 * @returns
 */
export const getDrawFinishedEvents = async (
  publicClient: PublicClient,
  drawManagerAddress: Address,
  options?: { fromBlock?: bigint; toBlock?: bigint }
) => {
  return await publicClient.getLogs({
    address: drawManagerAddress,
    event: {
      inputs: [
        { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
        { indexed: true, internalType: 'address', name: 'recipient', type: 'address' },
        { indexed: true, internalType: 'uint24', name: 'drawId', type: 'uint24' },
        { indexed: false, internalType: 'uint48', name: 'elapsedTime', type: 'uint48' },
        { indexed: false, internalType: 'uint256', name: 'reward', type: 'uint256' },
        { indexed: false, internalType: 'uint256', name: 'contribution', type: 'uint256' }
      ],
      name: 'DrawFinished',
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

  if (!liqRouterContractAddress) {
    console.warn(`No liquidation router contract set for chain ID ${chainId}`)
    return []
  }

  const lpAddresses = await getLiquidationPairAddresses(publicClient)

  // @ts-ignore
  const dskit = new DSKit({ viemPublicClient: publicClient })

  const lpEvents = !!lpAddresses.length
    ? await dskit.event.query({
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
        fromBlock: options?.fromBlock ?? 1n,
        toBlock: options?.toBlock ?? 'latest'
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
          internalType: 'contract TpdaLiquidationPair',
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
 * Returns `ContributePrizeTokens` events
 * @param publicClient a public Viem client to query through
 * @param prizePoolAddress the address of the prize pool to query events for
 * @param options optional settings (recommended `vaultAddress` param)
 * @returns
 */
export const getVaultContributionEvents = async (
  publicClient: PublicClient,
  prizePoolAddress: Address,
  options?: { vaultAddress?: Address; fromBlock?: bigint; toBlock?: bigint }
) => {
  return await publicClient.getLogs({
    address: prizePoolAddress,
    event: {
      inputs: [
        { indexed: true, internalType: 'address', name: 'vault', type: 'address' },
        { indexed: true, internalType: 'uint24', name: 'drawId', type: 'uint24' },
        { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
      ],
      name: 'ContributePrizeTokens',
      type: 'event'
    },
    args: { vault: options?.vaultAddress ?? null },
    fromBlock: options?.fromBlock,
    toBlock: options?.toBlock ?? 'latest',
    strict: true
  })
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
      from: options?.from ?? null,
      to: options?.to ?? null
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
    promotionIds?: bigint[]
    vaultAddresses?: Address[]
    tokenAddresses?: Address[]
    fromBlock?: bigint
    toBlock?: bigint
    twabRewardsAddress?: Address
  }
) => {
  const chainId = await publicClient.getChainId()

  const twabRewardsAddress = options?.twabRewardsAddress ?? TWAB_REWARDS_ADDRESSES[chainId]

  if (!twabRewardsAddress) {
    console.warn(`No TWAB rewards contract set for chain ID ${chainId}`)
    return []
  }

  return await publicClient.getLogs({
    address: twabRewardsAddress,
    event: {
      inputs: [
        { indexed: true, internalType: 'uint256', name: 'promotionId', type: 'uint256' },
        { indexed: true, internalType: 'address', name: 'vault', type: 'address' },
        { indexed: true, internalType: 'contract IERC20', name: 'token', type: 'address' },
        { indexed: false, internalType: 'uint64', name: 'startTimestamp', type: 'uint64' },
        { indexed: false, internalType: 'uint256', name: 'tokensPerEpoch', type: 'uint256' },
        { indexed: false, internalType: 'uint48', name: 'epochDuration', type: 'uint48' },
        { indexed: false, internalType: 'uint8', name: 'initialNumberOfEpochs', type: 'uint8' }
      ],
      name: 'PromotionCreated',
      type: 'event'
    },
    args: {
      promotionId: options?.promotionIds ?? null,
      vault: options?.vaultAddresses ?? null,
      token: options?.tokenAddresses ?? null
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
    twabRewardsAddress?: Address
  }
) => {
  const chainId = await publicClient.getChainId()

  const twabRewardsAddress = options?.twabRewardsAddress ?? TWAB_REWARDS_ADDRESSES[chainId]

  if (!twabRewardsAddress) {
    console.warn(`No TWAB rewards contract set for chain ID ${chainId}`)
    return []
  }

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
      promotionId: options?.promotionIds ?? null,
      user: options?.userAddresses ?? null
    },
    fromBlock: options?.fromBlock,
    toBlock: options?.toBlock ?? 'latest',
    strict: true
  })
}

/**
 * Returns pool-wide `PromotionCreated` events
 * @param publicClient a public Viem client to query through
 * @param options optional settings
 * @returns
 */
export const getPoolWidePromotionCreatedEvents = async (
  publicClient: PublicClient,
  options?: {
    promotionIds?: bigint[]
    tokenAddresses?: Address[]
    fromBlock?: bigint
    toBlock?: bigint
  }
) => {
  const chainId = await publicClient.getChainId()

  if (!POOL_WIDE_TWAB_REWARDS_ADDRESSES[chainId]) {
    return []
  }

  return await publicClient.getLogs({
    address: POOL_WIDE_TWAB_REWARDS_ADDRESSES[chainId],
    event: {
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
    args: {
      promotionId: options?.promotionIds ?? null,
      token: options?.tokenAddresses ?? null
    },
    fromBlock: options?.fromBlock,
    toBlock: options?.toBlock ?? 'latest',
    strict: true
  })
}

/**
 * Returns pool-wide `RewardsClaimed` events
 * @param publicClient a public Viem client to query through
 * @param options optional settings
 * @returns
 */
export const getPoolWidePromotionRewardsClaimedEvents = async (
  publicClient: PublicClient,
  options?: {
    promotionIds?: bigint[]
    userAddresses?: Address[]
    vaultAddresses?: Address[]
    fromBlock?: bigint
    toBlock?: bigint
  }
) => {
  const chainId = await publicClient.getChainId()

  if (!POOL_WIDE_TWAB_REWARDS_ADDRESSES[chainId]) {
    return []
  }

  return await publicClient.getLogs({
    address: POOL_WIDE_TWAB_REWARDS_ADDRESSES[chainId],
    event: {
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
    args: {
      promotionId: options?.promotionIds ?? null,
      user: options?.userAddresses ?? null,
      vault: options?.vaultAddresses ?? null
    },
    fromBlock: options?.fromBlock,
    toBlock: options?.toBlock ?? 'latest',
    strict: true
  })
}
