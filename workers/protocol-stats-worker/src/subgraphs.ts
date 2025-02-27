import { NETWORK, V5_SUBGRAPH_API_URLS } from './constants'
import { V5SubgraphUserData, V5SubgraphVaultData } from './types'

export const getV5SubgraphUserData = async (
  chainId: NETWORK,
  options: { maxUsersPerPage: number; lastUserId?: string }
) => {
  if (chainId in V5_SUBGRAPH_API_URLS) {
    const subgraphUrl = V5_SUBGRAPH_API_URLS[chainId as keyof typeof V5_SUBGRAPH_API_URLS]

    const result = await fetch(subgraphUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query($maxUsersPerPage: Int, $lastUserId: Bytes) {
          users(first: $maxUsersPerPage, where: { accounts_: { balance_gt: 0 }, id_gt: $lastUserId }) {
            id
          }
        }`,
        variables: {
          maxUsersPerPage: options.maxUsersPerPage,
          lastUserId: options.lastUserId ?? ''
        }
      })
    })

    const data =
      (await result.json<{ data?: { users?: V5SubgraphUserData[] } }>())?.data?.users ?? []

    return data
  } else {
    return []
  }
}

export const getPaginatedV5SubgraphUserData = async (
  chainId: NETWORK,
  options?: { maxPageSize?: number }
) => {
  const data: V5SubgraphUserData[] = []
  let lastUserId = ''

  const maxUsersPerPage = options?.maxPageSize ?? 1_000

  while (true) {
    const newPage = await getV5SubgraphUserData(chainId, { maxUsersPerPage, lastUserId })

    data.push(...newPage)

    if (newPage.length < maxUsersPerPage) {
      break
    } else {
      lastUserId = newPage[newPage.length - 1].id
    }
  }

  return data
}

export const getV5SubgraphVaultData = async (
  chainId: NETWORK,
  options: { maxVaultsPerPage: number; lastVaultId?: string }
) => {
  if (chainId in V5_SUBGRAPH_API_URLS) {
    const subgraphUrl = V5_SUBGRAPH_API_URLS[chainId as keyof typeof V5_SUBGRAPH_API_URLS]

    const result = await fetch(subgraphUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query($maxVaultsPerPage: Int, $lastVaultId: Bytes) {
          prizeVaults(first: $maxVaultsPerPage, where: { balance_gt: 0, id_gt: $lastVaultId }) {
            id
            address
            balance
          }
        }`,
        variables: {
          maxVaultsPerPage: options.maxVaultsPerPage,
          lastVaultId: options.lastVaultId ?? ''
        }
      })
    })

    const data =
      (
        await result.json<{
          data?: { prizeVaults?: { id: string; address: string; balance: string }[] }
        }>()
      )?.data?.prizeVaults ?? []

    const formattedData: V5SubgraphVaultData[] = data.map((entry) => ({
      id: entry.id,
      address: entry.address as `0x${string}`,
      balance: BigInt(entry.balance)
    }))

    return formattedData
  } else {
    return []
  }
}

export const getPaginatedV5SubgraphVaultData = async (
  chainId: NETWORK,
  options?: { maxPageSize?: number }
) => {
  const data: V5SubgraphVaultData[] = []
  let lastVaultId = ''

  const maxVaultsPerPage = options?.maxPageSize ?? 100

  while (true) {
    const newPage = await getV5SubgraphVaultData(chainId, { maxVaultsPerPage, lastVaultId })

    data.push(...newPage)

    if (newPage.length < maxVaultsPerPage) {
      break
    } else {
      lastVaultId = newPage[newPage.length - 1].id
    }
  }

  return data
}
