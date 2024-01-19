import { useTokenBalancesAcrossChains } from '@generationsoftware/hyperstructure-react-hooks'
import { TokenWithAmount } from '@shared/types'
import { useMemo } from 'react'
import { Address } from 'viem'
import { SUPPORTED_NETWORKS, SupportedNetwork, V3_POOLS } from '@constants/config'

export interface V3BalanceToMigrate {
  token: TokenWithAmount
  contractAddress: Address
  type: 'pool' | 'pod'
  destination: { chainId: SupportedNetwork; address: Lowercase<Address> }
}

export const useUserV3Balances = (
  userAddress: Address
): {
  data: V3BalanceToMigrate[]
  isFetched: boolean
} => {
  const queryData = useMemo(() => {
    const ticketAddresses: { [network: number]: Address[] } = {}
    const podAddresses: { [network: number]: Address[] } = {}

    SUPPORTED_NETWORKS.forEach((network) => {
      const pools = V3_POOLS[network]

      pools.forEach((pool) => {
        if (ticketAddresses[network] === undefined) {
          ticketAddresses[network] = [pool.ticketAddress]
        } else {
          ticketAddresses[network].push(pool.ticketAddress)
        }

        if (!!pool.podAddress) {
          if (podAddresses[network] === undefined) {
            podAddresses[network] = [pool.podAddress]
          } else {
            podAddresses[network].push(pool.podAddress)
          }
        }
      })
    })

    return { ticketAddresses, podAddresses }
  }, [])

  const { data: poolBalances, isFetched: isFetchedPoolBalances } = useTokenBalancesAcrossChains(
    Object.keys(queryData.ticketAddresses).map((k) => parseInt(k)),
    userAddress,
    queryData.ticketAddresses
  )

  const { data: podBalances, isFetched: isFetchedPodBalances } = useTokenBalancesAcrossChains(
    Object.keys(queryData.podAddresses).map((k) => parseInt(k)),
    userAddress,
    queryData.podAddresses
  )

  const data = useMemo(() => {
    const balancesToMigrate: V3BalanceToMigrate[] = []

    SUPPORTED_NETWORKS.forEach((network) => {
      if (isFetchedPoolBalances) {
        Object.values(poolBalances[network] ?? {}).forEach((token) => {
          if (!!token.amount) {
            const v3Pool = V3_POOLS[network].find(
              (entry) => entry.ticketAddress === token.address.toLowerCase()
            )

            if (!!v3Pool) {
              balancesToMigrate.push({
                token,
                contractAddress: v3Pool.address,
                type: 'pool',
                destination: v3Pool.migrateTo
              })
            }
          }
        })
      }

      if (isFetchedPodBalances) {
        Object.values(podBalances[network] ?? {}).forEach((token) => {
          if (!!token.amount) {
            const v3Pool = V3_POOLS[network].find(
              (entry) => entry.podAddress === token.address.toLowerCase()
            )

            if (!!v3Pool) {
              balancesToMigrate.push({
                token,
                contractAddress: v3Pool.address,
                type: 'pod',
                destination: v3Pool.migrateTo
              })
            }
          }
        })
      }
    })

    return balancesToMigrate
  }, [poolBalances, podBalances, isFetchedPoolBalances, isFetchedPodBalances])

  const isFetched = isFetchedPoolBalances && isFetchedPodBalances

  return { data, isFetched }
}
