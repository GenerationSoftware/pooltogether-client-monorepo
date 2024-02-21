import {
  useAllUserClaimableRewards,
  useAllVaultPromotions,
  useVaults
} from '@generationsoftware/hyperstructure-react-hooks'
import { PartialPromotionInfo, VaultInfo } from '@shared/types'
import { useMemo } from 'react'
import { Address } from 'viem'
import { OLD_V5_VAULTS, SUPPORTED_NETWORKS, V5_PROMOTION_SETTINGS } from '@constants/config'

// TODO: need to be able to lookup different twab rewards addresses for different deployments
export const useAllUserV5ClaimableRewards = (userAddress: Address) => {
  const allVaultInfo = useMemo(() => {
    const info: VaultInfo[] = []

    SUPPORTED_NETWORKS.forEach((network) => {
      const vaultInfoArray = OLD_V5_VAULTS[network]?.map((entry) => entry.vault) ?? []
      info.push(...vaultInfoArray)
    })

    return info
  }, [])

  const vaults = useVaults(allVaultInfo)

  const {
    data: allPromotions,
    isFetched: isFetchedAllPromotions,
    isFetching: isFetchingAllPromotions
  } = useAllVaultPromotions(vaults, V5_PROMOTION_SETTINGS)

  const {
    data: allClaimableRewards,
    isFetched: isFetchedAllClaimableRewards,
    isFetching: isFetchingAllClaimableRewards,
    refetch: refetchAllClaimableRewards
  } = useAllUserClaimableRewards(userAddress, allPromotions)

  const isFetched = isFetchedAllPromotions && isFetchedAllClaimableRewards
  const isFetching = isFetchingAllPromotions || isFetchingAllClaimableRewards
  const refetch = refetchAllClaimableRewards

  const claimablePromotions = useMemo(() => {
    const claimablePromotions: ({
      chainId: number
      promotionId: bigint
      epochRewards: { [epochId: number]: bigint }
    } & PartialPromotionInfo)[] = []

    const chainIds = Object.keys(allClaimableRewards).map((k) => parseInt(k))

    chainIds.forEach((chainId) => {
      Object.entries(allClaimableRewards[chainId]).forEach(([id, epochRewards]) => {
        const promotionInfo = allPromotions[chainId]?.[id]

        if (!!promotionInfo) {
          const filteredEpochRewards: { [epochId: number]: bigint } = {}

          const epochIds = Object.keys(epochRewards).map((k) => parseInt(k))
          epochIds.forEach((epochId) => {
            if (epochRewards[epochId] > 0n) {
              filteredEpochRewards[epochId] = epochRewards[epochId]
            }
          })

          claimablePromotions.push({
            chainId,
            promotionId: BigInt(id),
            epochRewards: filteredEpochRewards,
            ...promotionInfo
          })
        }
      })
    })

    return claimablePromotions
  }, [isFetched, allPromotions, allClaimableRewards])

  const data = useMemo(() => {
    const entries: {
      promotionId: bigint
      chainId: number
      tokenAddress: `0x${Lowercase<string>}`
      vaultAddress: `0x${Lowercase<string>}`
      rewards: { [epochId: number]: bigint }
      total: bigint
    }[] = []

    claimablePromotions.forEach((promotion) => {
      entries.push({
        promotionId: promotion.promotionId,
        chainId: promotion.chainId,
        tokenAddress: promotion.token.toLowerCase() as `0x${Lowercase<string>}`,
        vaultAddress: promotion.vault.toLowerCase() as `0x${Lowercase<string>}`,
        rewards: promotion.epochRewards,
        total: Object.values(promotion.epochRewards).reduce((a, b) => a + b, 0n)
      })
    })

    return entries
  }, [claimablePromotions])

  return { data, isFetched, isFetching, refetch }
}

export const useUserV5ClaimableRewards = (
  chainId: number,
  vaultAddress: Address,
  userAddress: Address
) => {
  const allUserV5ClaimableRewards = useAllUserV5ClaimableRewards(userAddress)

  const vaultRewards = allUserV5ClaimableRewards.data.filter(
    (entry) => entry.chainId === chainId && entry.vaultAddress === vaultAddress.toLowerCase()
  )

  return { ...allUserV5ClaimableRewards, data: vaultRewards }
}
