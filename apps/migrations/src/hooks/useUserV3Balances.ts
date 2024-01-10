import { useTokenBalancesAcrossChains } from '@generationsoftware/hyperstructure-react-hooks'
import { TokenWithAmount } from '@shared/types'
import { useMemo } from 'react'
import { Address } from 'viem'
import { SUPPORTED_NETWORKS, V3_POOLS } from '@constants/config'

export interface V3BalanceToMigrate {
  token: TokenWithAmount
  contractAddress: Address
  type: 'pool' | 'pod'
}

export const useUserV3Balances = (
  userAddress: Address
): {
  data: V3BalanceToMigrate[]
  isFetched: boolean
} => {
  const queryData = useMemo(() => {
    const networks: number[] = []
    const ticketAddresses: { [network: number]: Address[] } = {}

    SUPPORTED_NETWORKS.forEach((network) => {
      const addresses = V3_POOLS[network].map((pool) => pool.ticketAddress)

      if (!!addresses.length) {
        networks.push(network)
        ticketAddresses[network] = addresses
      }
    })

    return { networks, ticketAddresses }
  }, [])

  const { data: poolBalances, isFetched: isFetchedPoolBalances } = useTokenBalancesAcrossChains(
    queryData.networks,
    userAddress,
    queryData.ticketAddresses
  )

  // TODO: get pod balances
  const podBalances = {}
  const isFetchedPodBalances = true

  const data = useMemo(() => {
    const balancesToMigrate: V3BalanceToMigrate[] = []

    SUPPORTED_NETWORKS.forEach((network) => {
      if (isFetchedPoolBalances) {
        Object.values(poolBalances[network] ?? {}).forEach((token) => {
          if (!!token.amount) {
            const contractAddress = V3_POOLS[network].find(
              (entry) => entry.ticketAddress === token.address.toLowerCase()
            )?.address

            if (!!contractAddress) {
              balancesToMigrate.push({ token, contractAddress, type: 'pool' })
            }
          }
        })
      }

      if (isFetchedPodBalances) {
        // TODO: add pod balances
      }
    })

    return balancesToMigrate
  }, [poolBalances, podBalances, isFetchedPoolBalances, isFetchedPodBalances])

  const isFetched = isFetchedPoolBalances && isFetchedPodBalances

  return { data, isFetched }
}
