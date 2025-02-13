import {
  PartialPoolWidePromotionInfo,
  PartialPromotionInfo,
  PoolWidePromotionInfo,
  PromotionInfo,
  TokenWithPrice
} from '@shared/types'
import { Address, formatUnits, hexToBigInt, PublicClient } from 'viem'
import { poolWideTwabRewardsABI } from '../abis/poolWideTwabRewards'
import { twabRewardsABI } from '../abis/twabRewards'
import {
  POOL_WIDE_TWAB_REWARDS_ADDRESSES,
  SECONDS_PER_YEAR,
  TWAB_REWARDS_ADDRESSES
} from '../constants'
import { getSimpleMulticallResults } from './multicall'
import { getSecondsSinceEpoch } from './time'

/**
 * Returns promotion info for the given promotion IDs
 * @param publicClient a public Viem client to query through
 * @param promotionIds the promotion IDs to query info for
 * @param options optional settings
 * @returns
 */
export const getPromotions = async (
  publicClient: PublicClient,
  promotionIds: bigint[],
  options?: { twabRewardsAddress?: Address }
) => {
  const promotions: { [id: string]: PromotionInfo | undefined } = {}

  const chainId = await publicClient.getChainId()

  const twabRewardsAddress = options?.twabRewardsAddress ?? TWAB_REWARDS_ADDRESSES[chainId]

  if (!!twabRewardsAddress) {
    if (promotionIds.length > 0) {
      const calls = promotionIds.map((promotionId) => ({
        functionName: 'getPromotion',
        args: [promotionId]
      }))

      const multicallResults = await getSimpleMulticallResults(
        publicClient,
        twabRewardsAddress,
        twabRewardsABI,
        calls
      )

      promotionIds.forEach((promotionId, i) => {
        const result: PromotionInfo | undefined = multicallResults[i]
        const promotionInfo = typeof result === 'object' ? result : undefined
        promotions[promotionId.toString()] = promotionInfo
      })
    }
  } else {
    console.warn(`No TWAB rewards contract set for chain ID ${chainId}`)
  }

  return promotions
}

/**
 * Returns pool-wide promotion info for the given promotion IDs
 * @param publicClient a public Viem client to query through
 * @param promotionIds the promotion IDs to query info for
 * @returns
 */
export const getPoolWidePromotions = async (publicClient: PublicClient, promotionIds: bigint[]) => {
  const promotions: { [id: string]: PoolWidePromotionInfo | undefined } = {}

  const chainId = await publicClient.getChainId()

  if (!!POOL_WIDE_TWAB_REWARDS_ADDRESSES[chainId]) {
    if (promotionIds.length > 0) {
      const calls = promotionIds.map((promotionId) => ({
        functionName: 'getPromotion',
        args: [promotionId]
      }))

      const multicallResults = await getSimpleMulticallResults(
        publicClient,
        POOL_WIDE_TWAB_REWARDS_ADDRESSES[chainId],
        poolWideTwabRewardsABI,
        calls
      )

      promotionIds.forEach((promotionId, i) => {
        const result: PoolWidePromotionInfo | undefined = multicallResults[i]
        const promotionInfo = typeof result === 'object' ? result : undefined
        promotions[promotionId.toString()] = promotionInfo
      })
    }
  } else {
    console.warn(`No pool-wide TWAB rewards contract set for chain ID ${chainId}`)
  }

  return promotions
}

/**
 * Returns tokens distributed per epoch for a given vault through any pool-wide promotions
 * @param publicClient a public Viem client to query through
 * @param vaultAddress the vault to query distributions for
 * @param promotions info for the promotions to consider
 * @returns
 */
export const getPoolWidePromotionVaultTokensPerEpoch = async (
  publicClient: PublicClient,
  vaultAddress: Address,
  promotions: {
    [id: string]:
      | { startTimestamp?: bigint; numberOfEpochs?: number; epochDuration?: number }
      | undefined
  }
) => {
  const allVaultTokensPerEpoch: { [id: string]: bigint[] } = {}
  const promotionEpochs: { [id: string]: number[] } = {}

  const chainId = await publicClient.getChainId()

  if (!!POOL_WIDE_TWAB_REWARDS_ADDRESSES[chainId]) {
    Object.entries(promotions).forEach(([id, info]) => {
      if (!!info) {
        const epochs = getPromotionEpochs(info)
        if (epochs.length > 0) {
          promotionEpochs[id] = epochs
        }
      }
    })

    const promotionIds = Object.keys(promotionEpochs)
    if (promotionIds.length > 0) {
      const callArgs: [Address, bigint, number][] = []

      promotionIds.forEach((id) => {
        promotionEpochs[id].forEach((epoch) => {
          callArgs.push([vaultAddress, BigInt(id), epoch])
        })
      })

      const multicallResults = await getSimpleMulticallResults(
        publicClient,
        POOL_WIDE_TWAB_REWARDS_ADDRESSES[chainId],
        poolWideTwabRewardsABI,
        callArgs.map((args) => ({ functionName: 'getVaultRewardAmount', args }))
      )

      callArgs.forEach((args, i) => {
        const promotionId = String(args[1])

        const result: bigint | undefined = multicallResults[i]
        const epochRewards = typeof result === 'bigint' ? result : 0n

        if (allVaultTokensPerEpoch[promotionId] === undefined) {
          allVaultTokensPerEpoch[promotionId] = []
        }
        allVaultTokensPerEpoch[promotionId].push(epochRewards)
      })
    }
  } else {
    console.warn(`No pool-wide TWAB rewards contract set for chain ID ${chainId}`)
  }

  return allVaultTokensPerEpoch
}

/**
 * Returns a user's claimable rewards for the given promotions
 * @param publicClient a public Viem client to query through
 * @param userAddress the address to query rewards for
 * @param promotions info for the promotions to consider
 * @param options optional settings
 * @returns
 */
export const getClaimableRewards = async (
  publicClient: PublicClient,
  userAddress: Address,
  promotions: {
    [id: string]: { startTimestamp?: bigint; numberOfEpochs?: number; epochDuration?: number }
  },
  options?: { twabRewardsAddress?: Address }
) => {
  const claimableRewards: { [id: string]: { [epochId: number]: bigint } } = {}
  const promotionEpochs: { [id: string]: number[] } = {}

  const chainId = await publicClient.getChainId()

  const twabRewardsAddress = options?.twabRewardsAddress ?? TWAB_REWARDS_ADDRESSES[chainId]

  if (!!twabRewardsAddress) {
    Object.entries(promotions).forEach(([id, info]) => {
      const epochs = getPromotionEpochs(info)
      if (epochs.length > 0) {
        promotionEpochs[id] = epochs
      }
    })

    const promotionIds = Object.keys(promotionEpochs)
    if (promotionIds.length > 0) {
      const calls = promotionIds.map((id) => ({
        functionName: 'getRewardsAmount',
        args: [userAddress, BigInt(id), promotionEpochs[id]]
      }))

      const multicallResults = await getSimpleMulticallResults(
        publicClient,
        twabRewardsAddress,
        twabRewardsABI,
        calls
      )

      promotionIds.forEach((id, i) => {
        const result: bigint[] | undefined = multicallResults[i]
        const epochRewards = typeof result === 'object' ? result : undefined
        if (!!epochRewards) {
          promotionEpochs[id].forEach((epochId, j) => {
            if (epochRewards[j] > 0n) {
              if (claimableRewards[id] === undefined) {
                claimableRewards[id] = {}
              }
              claimableRewards[id][epochId] = epochRewards[j]
            }
          })
        }
      })
    }
  } else {
    console.warn(`No TWAB rewards contract set for chain ID ${chainId}`)
  }

  return claimableRewards
}

/**
 * Returns a user's claimable rewards for the given pool-wide promotions
 * @param publicClient a public Viem client to query through
 * @param userAddress the address to query rewards for
 * @param vaultAddresses the prize vault addresses to consider
 * @param promotions info for the promotions to consider
 * @returns
 */
export const getPoolWideClaimableRewards = async (
  publicClient: PublicClient,
  userAddress: Address,
  vaultAddresses: Address[],
  promotions: {
    [id: string]: { startTimestamp?: bigint; numberOfEpochs?: number; epochDuration?: number }
  }
) => {
  const claimableRewards: { [id: string]: { [epochId: number]: bigint } } = {}
  const promotionEpochs: { [id: string]: number[] } = {}

  const chainId = await publicClient.getChainId()

  if (!!POOL_WIDE_TWAB_REWARDS_ADDRESSES[chainId]) {
    Object.entries(promotions).forEach(([id, info]) => {
      const epochs = getPromotionEpochs(info)
      if (epochs.length > 0) {
        promotionEpochs[id] = epochs
      }
    })

    const promotionIds = Object.keys(promotionEpochs)
    if (vaultAddresses.length > 0 && promotionIds.length > 0) {
      const callArgs: [Address, Address, bigint, number[]][] = []

      vaultAddresses.forEach((vaultAddress) => {
        promotionIds.forEach((id) => {
          callArgs.push([vaultAddress, userAddress, BigInt(id), promotionEpochs[id]])
        })
      })

      const multicallResults = await getSimpleMulticallResults(
        publicClient,
        POOL_WIDE_TWAB_REWARDS_ADDRESSES[chainId],
        poolWideTwabRewardsABI,
        callArgs.map((args) => ({ functionName: 'calculateRewards', args }))
      )

      vaultAddresses.forEach((_vaultAddress, i) => {
        promotionIds.forEach((id, j) => {
          const result: bigint[] | undefined = multicallResults[i * promotionIds.length + j]
          const epochRewards = typeof result === 'object' ? result : undefined

          if (!!epochRewards) {
            promotionEpochs[id].forEach((epochId, k) => {
              if (epochRewards[k] > 0n) {
                if (claimableRewards[id] === undefined) {
                  claimableRewards[id] = {}
                }
                claimableRewards[id][epochId] = epochRewards[k]
              }
            })
          }
        })
      })
    }
  } else {
    console.warn(`No pool-wide TWAB rewards contract set for chain ID ${chainId}`)
  }

  return claimableRewards
}

/**
 * Returns valid epochs for a given promotion
 * @param info promotion info
 * @returns
 */
export const getPromotionEpochs = (info: {
  startTimestamp?: bigint
  numberOfEpochs?: number
  epochDuration?: number
}) => {
  const epochs: number[] = []

  if (!!info.startTimestamp && !!info.epochDuration && !!info.numberOfEpochs) {
    const currentTimestamp = getSecondsSinceEpoch()

    for (let i = 0; i < info.numberOfEpochs; i++) {
      const epochEndsAt = Number(info.startTimestamp) + info.epochDuration * (i + 1)
      if (epochEndsAt > currentTimestamp) {
        break
      } else {
        epochs.push(i)
      }
    }
  }

  return epochs
}

/**
 * Returns an APR estimate for a given promotion for a vault
 * @param promotion the promotion to consider
 * @param rewardToken the promotion's reward token
 * @param tvl the current tvl of the vault
 * @param options optional settings
 * @returns
 */
export const calculateRewardsApr = (
  promotion: PartialPromotionInfo,
  rewardToken: TokenWithPrice,
  tvl: number,
  options?: { currentTimestamp?: number }
) => {
  const startsAt = Number(promotion.startTimestamp)
  const numberOfEpochs = promotion.numberOfEpochs ?? 0
  const endsAt = startsAt + numberOfEpochs * promotion.epochDuration

  const currentTimestamp = options?.currentTimestamp ?? getSecondsSinceEpoch()

  if (
    !!startsAt &&
    !!numberOfEpochs &&
    !!endsAt &&
    startsAt < currentTimestamp &&
    endsAt > currentTimestamp
  ) {
    for (let i = 0; i < numberOfEpochs; i++) {
      const epochStartsAt = startsAt + promotion.epochDuration * i
      const epochEndsAt = epochStartsAt + promotion.epochDuration

      if (epochStartsAt < currentTimestamp && epochEndsAt > currentTimestamp) {
        const tokenRewards = parseFloat(formatUnits(promotion.tokensPerEpoch, rewardToken.decimals))

        const tokenRewardsValue = tokenRewards * (rewardToken.price ?? 0)
        const yearlyRewardsValue = tokenRewardsValue * (SECONDS_PER_YEAR / promotion.epochDuration)

        return (yearlyRewardsValue / tvl) * 100
      }
    }
  }

  return 0
}

/**
 * Returns an APR estimate for a given pool-wide promotion for a vault
 * @param promotion the promotion to consider
 * @param rewardToken the promotion's reward token
 * @param tvl the current tvl of the vault
 * @param options optional settings
 * @returns
 */
export const calculatePoolWideRewardsApr = (
  promotion: PartialPoolWidePromotionInfo,
  rewardToken: TokenWithPrice,
  tvl: number,
  options?: { currentTimestamp?: number }
) => {
  const startsAt = Number(promotion.startTimestamp)
  const numberOfEpochs = promotion.numberOfEpochs ?? 0
  const endsAt = startsAt + numberOfEpochs * promotion.epochDuration

  const currentTimestamp = options?.currentTimestamp ?? getSecondsSinceEpoch()

  if (
    !!startsAt &&
    !!numberOfEpochs &&
    !!endsAt &&
    startsAt < currentTimestamp &&
    endsAt > currentTimestamp
  ) {
    // TODO: consider a limited timespan to avoid lagging apr during long-lasting promotions
    const tokenRewards = parseFloat(
      formatUnits(
        promotion.vaultTokensPerEpoch.reduce((a, b) => a + b),
        rewardToken.decimals
      )
    )

    const tokenRewardsValue = tokenRewards * (rewardToken.price ?? 0)
    const yearlyRewardsValue =
      tokenRewardsValue *
      (SECONDS_PER_YEAR / (promotion.epochDuration * promotion.vaultTokensPerEpoch.length))

    return (yearlyRewardsValue / tvl) * 100
  }

  return 0
}

/**
 * Decodes claim flags from `RewardsClaimed` events into epoch IDs
 * @param claimFlags claim flags from a pool-wide TWAB rewards contract
 * @returns
 */
export const decodePoolWideRewardsClaimFlags = (claimFlags: `0x${string}`) => {
  const epochIds: number[] = []

  const parsedValue = hexToBigInt(claimFlags)

  for (let epochId = 1n; epochId < 256n; epochId++) {
    if (((parsedValue >> epochId) & 1n) === 1n) {
      epochIds.push(Number(epochId))
    }
  }

  return epochIds
}
