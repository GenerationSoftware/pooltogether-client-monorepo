import { PromotionInfo } from '@shared/types'
import { Address, PublicClient } from 'viem'
import { twabRewardsABI } from '../abis/twabRewards'
import { TWAB_REWARDS_ADDRESSES } from '../constants'
import { getSimpleMulticallResults } from './multicall'
import { getSecondsSinceEpoch } from './time'

/**
 * Returns promotion info for the given promotion IDs
 * @param publicClient a public Viem client to query through
 * @param promotionIds the promotion IDs to query info for
 * @returns
 */
export const getPromotions = async (publicClient: PublicClient, promotionIds: bigint[]) => {
  const promotions: { [id: string]: PromotionInfo | undefined } = {}

  const chainId = await publicClient.getChainId()

  const twabRewardsAddress = TWAB_REWARDS_ADDRESSES[chainId]

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
        // TODO: need to check for reverts/failures in case of destroyed promotions (maybe doesnt return undefined?)
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
 * Returns a user's claimable rewards for the given promotions
 * @param publicClient a public Viem client to query through
 * @param userAddress the address to query rewards for
 * @param promotions info for the promotions to consider
 * @returns
 */
export const getClaimableRewards = async (
  publicClient: PublicClient,
  userAddress: Address,
  promotions: {
    [id: string]: { startTimestamp?: bigint; numberOfEpochs?: number; epochDuration?: number }
  }
) => {
  const claimableRewards: { [id: string]: { [epochId: number]: bigint } } = {}
  const promotionEpochs: { [id: string]: number[] } = {}

  const chainId = await publicClient.getChainId()

  const twabRewardsAddress = TWAB_REWARDS_ADDRESSES[chainId]

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
          claimableRewards[id] = epochRewards
        }
      })
    }
  } else {
    console.warn(`No TWAB rewards contract set for chain ID ${chainId}`)
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

    for (let i = 1; i <= info.numberOfEpochs; i++) {
      const epochEndsAt = Number(info.startTimestamp) + info.epochDuration * i
      if (epochEndsAt > currentTimestamp) {
        break
      } else {
        epochs.push(i)
      }
    }
  }

  return epochs
}
