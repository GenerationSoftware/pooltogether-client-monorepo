import { usePublicClientsByChain } from '@generationsoftware/hyperstructure-react-hooks'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQueries, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Address, PublicClient } from 'viem'
import { usePublicClient } from 'wagmi'
import { SUPPORTED_NETWORKS, SupportedNetwork, V3_POOLS } from '@constants/config'
import { v3FaucetABI } from '@constants/v3FaucetABI'

export const useAllUserV3ClaimableRewards = (userAddress: Address) => {
  const publicClients = usePublicClientsByChain()

  const pools: ((typeof V3_POOLS)[SupportedNetwork][number] & { chainId: SupportedNetwork })[] = []
  SUPPORTED_NETWORKS.forEach((network) => {
    V3_POOLS[network].forEach((entry) => {
      pools.push({ chainId: network, ...entry })
    })
  })

  const results = useQueries({
    queries: pools.map((pool) => {
      return {
        queryKey: ['userV3ClaimableRewards', pool.chainId, pool.ticketAddress, userAddress],
        queryFn: async () => {
          const rewards = await getClaimableRewards(
            publicClients[pool.chainId],
            pool.ticketAddress,
            userAddress
          )
          return { chainId: pool.chainId, ticketAddress: pool.ticketAddress, rewards }
        },
        enabled: !!pool && !!userAddress,
        ...NO_REFETCH
      }
    })
  })

  return useMemo(() => {
    const isFetched = results?.every((result) => result.isFetched)
    const isFetching = results?.some((result) => result.isFetching)
    const refetch = () => results?.forEach((result) => result.refetch())

    const data: {
      chainId: SupportedNetwork
      ticketAddress: Lowercase<Address>
      rewards: Awaited<ReturnType<typeof getClaimableRewards>>
    }[] = []

    results.forEach((result) => {
      if (!!result.data && !!result.data.rewards.amount) {
        data.push(result.data)
      }
    })

    return { data, isFetched, isFetching, refetch }
  }, [results])
}

export const useUserV3ClaimableRewards = (
  chainId: number,
  ticketAddress: Lowercase<Address>,
  userAddress: Address
) => {
  const publicClient = usePublicClient({ chainId })

  const queryKey = ['userV3ClaimableRewards', chainId, ticketAddress, userAddress]

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!!publicClient) {
        const rewards = await getClaimableRewards(publicClient, ticketAddress, userAddress)
        return { chainId, ticketAddress, rewards }
      }
    },
    enabled: !!chainId && !!publicClient && !!ticketAddress && !!userAddress,
    ...NO_REFETCH
  })
}

export const getClaimableRewards = async (
  publicClient: PublicClient,
  ticketAddress: Lowercase<Address>,
  userAddress: Address
) => {
  const rewards: { address?: Lowercase<Address>; amount: bigint } = { amount: 0n }

  const chainId = await publicClient.getChainId()

  rewards.address = V3_POOLS[chainId as SupportedNetwork].find(
    (e) => e.ticketAddress === ticketAddress
  )?.rewardsAddress

  if (!!rewards.address) {
    const userState = await publicClient.readContract({
      address: rewards.address,
      abi: v3FaucetABI,
      functionName: 'userStates',
      args: [userAddress]
    })

    rewards.amount = userState[1]
  }

  return rewards
}
