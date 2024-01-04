import { getSecondsSinceEpoch } from '@shared/utilities'
import { useMemo } from 'react'
import { Promotion, PromotionStatus } from 'src/types'
import { useGracePeriod } from './useGracePeriod'

/**
 * Returns the status of a promotion
 * @returns
 */
export const usePromotionStatus = (
  promotion: Promotion
): { status?: PromotionStatus; endsAt?: number; canDestroy?: boolean } => {
  const { data: gracePeriod } = useGracePeriod(promotion?.chainId)

  return useMemo(() => {
    if (!!promotion && !!gracePeriod) {
      const promotionEndsAt = !!promotion.numberOfEpochs
        ? Number(promotion.startTimestamp) + promotion.numberOfEpochs * promotion.epochDuration
        : undefined

      if (!!promotionEndsAt) {
        const currentTimestamp = getSecondsSinceEpoch()

        if (promotionEndsAt > currentTimestamp) {
          return { status: 'active', endsAt: promotionEndsAt, canDestroy: false }
        } else {
          return {
            status: 'ended',
            endsAt: promotionEndsAt,
            canDestroy: currentTimestamp >= promotionEndsAt + gracePeriod
          }
        }
      } else {
        return { status: 'destroyed', canDestroy: false }
      }
    } else {
      return {}
    }
  }, [promotion, gracePeriod])
}
