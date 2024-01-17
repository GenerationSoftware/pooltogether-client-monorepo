import { NO_REFETCH } from '@shared/generic-react-hooks'
import { getPromotionEpochs, getSimpleMulticallResults, twabRewardsABI } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { Address, PublicClient } from 'viem'
import { usePublicClient } from 'wagmi'
import { V4_PROMOTIONS } from '@constants/config'

export const useUserV4ClaimableRewards = (chainId: number, userAddress: Address) => {
  const publicClient = usePublicClient({ chainId })

  const token = V4_PROMOTIONS[chainId]?.token

  const queryKey = ['userV4ClaimableRewards', chainId, userAddress]

  return useQuery(
    queryKey,
    async () => {
      const rewards = await getClaimableRewards(publicClient, userAddress)
      return { token, rewards }
    },
    {
      enabled: !!chainId && !!publicClient && !!userAddress && !!token,
      ...NO_REFETCH
    }
  )
}

export const getClaimableRewards = async (publicClient: PublicClient, userAddress: Address) => {
  const claimableRewards: { [id: string]: { [epochId: number]: bigint } } = {}
  const promotionEpochs: { [id: string]: number[] } = {}

  const chainId = await publicClient.getChainId()

  if (!!V4_PROMOTIONS[chainId]) {
    Object.entries(V4_PROMOTIONS[chainId].promotions).forEach(([id, info]) => {
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
        V4_PROMOTIONS[chainId].twabRewardsAddress,
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
