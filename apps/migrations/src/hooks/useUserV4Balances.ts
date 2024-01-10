import { useTokenBalancesAcrossChains } from '@generationsoftware/hyperstructure-react-hooks'
import { TokenWithAmount } from '@shared/types'
import { useMemo } from 'react'
import { Address } from 'viem'
import { SUPPORTED_NETWORKS, V4_POOLS } from '@constants/config'

export interface V4BalanceToMigrate {
  token: TokenWithAmount
  contractAddress: Address
}

export const useUserV4Balances = (
  userAddress: Address
): {
  data: V4BalanceToMigrate[]
  isFetched: boolean
} => {
  const queryData = useMemo(() => {
    const networks: number[] = []
    const ticketAddresses: { [network: number]: Address[] } = {}

    SUPPORTED_NETWORKS.forEach((network) => {
      const ticketAddress = V4_POOLS[network]?.ticketAddress

      if (!!ticketAddress) {
        networks.push(network)
        ticketAddresses[network] = [ticketAddress]
      }
    })

    return { networks, ticketAddresses }
  }, [])

  const { data: poolBalances, isFetched: isFetchedPoolBalances } = useTokenBalancesAcrossChains(
    queryData.networks,
    userAddress,
    queryData.ticketAddresses
  )

  const data = useMemo(() => {
    const balancesToMigrate: V4BalanceToMigrate[] = []

    if (isFetchedPoolBalances) {
      SUPPORTED_NETWORKS.forEach((network) => {
        Object.values(poolBalances[network] ?? {}).forEach((token) => {
          if (!!token.amount) {
            balancesToMigrate.push({ token, contractAddress: V4_POOLS[network].address })
          }
        })
      })
    }

    return balancesToMigrate
  }, [poolBalances, isFetchedPoolBalances])

  return { data, isFetched: isFetchedPoolBalances }
}
