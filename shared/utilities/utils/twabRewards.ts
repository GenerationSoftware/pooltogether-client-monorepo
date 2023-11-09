import { PromotionInfo } from '@shared/types'
import { PublicClient } from 'viem'
import { twabRewardsABI } from '../abis/twabRewards'
import { TWAB_REWARDS_ADDRESSES } from '../constants'
import { getSimpleMulticallResults } from './multicall'

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

  if (!twabRewardsAddress) throw new Error(`No TWAB rewards contract set for chain ID ${chainId}`)

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

  return promotions
}
