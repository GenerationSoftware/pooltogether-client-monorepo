import {
  SubgraphDraw,
  SubgraphDrawTimestamps,
  SubgraphObservation,
  SubgraphPrize
} from '@shared/types'
import { Address } from 'viem'
import { PRIZE_POOL_GRAPH_API_URLS, TWAB_GRAPH_API_URLS } from '../constants'

/**
 * Returns past draws from the given network's subgraph
 *
 * NOTE: By default queries the last 1k draws, with a max of 1k prizes in each
 * @param chainId the network's chain ID
 * @param options optional parameters
 * @returns
 */
export const getSubgraphDraws = async (
  chainId: number,
  options?: {
    numDraws?: number
    numPrizes?: number
    offsetDraws?: number
    offsetPrizes?: number
    orderDirection?: 'asc' | 'desc'
  }
): Promise<SubgraphDraw[]> => {
  if (chainId in PRIZE_POOL_GRAPH_API_URLS) {
    const subgraphUrl = PRIZE_POOL_GRAPH_API_URLS[chainId as keyof typeof PRIZE_POOL_GRAPH_API_URLS]

    const headers = { 'Content-Type': 'application/json' }

    const body = JSON.stringify({
      query: `query($numDraws: Int, $numPrizes: Int, $offsetDraws: Int, $offsetPrizes: Int, $orderDirection: OrderDirection, $orderBy: Draw_orderBy, $prizeOrderDirection: OrderDirection, $prizeOrderBy: PrizeClaim_orderBy) {
        draws(first: $numDraws, skip: $offsetDraws, orderDirection: $orderDirection, orderBy: $orderBy) {
          id
          prizeClaims(first: $numPrizes, skip: $offsetPrizes, orderDirection: $prizeOrderDirection, orderBy: $prizeOrderBy) {
            id
            winner { id }
            recipient { id }
            tier
            prizeIndex
            payout
            fee
            feeRecipient { id }
            timestamp
          }
        }
      }`,
      variables: {
        numDraws: options?.numDraws ?? 1_000,
        numPrizes: options?.numPrizes ?? 1_000,
        offsetDraws: options?.offsetDraws ?? 0,
        offsetPrizes: options?.offsetPrizes ?? 0,
        orderDirection: options?.orderDirection ?? 'desc',
        orderBy: 'id',
        prizeOrderDirection: 'asc',
        prizeOrderBy: 'timestamp'
      }
    })

    const result = await fetch(subgraphUrl, { method: 'POST', headers, body })
    const jsonData = await result.json()
    const draws: {
      id: string
      prizeClaims: {
        id: string
        winner: { id: string }
        recipient: { id: string }
        tier: number
        prizeIndex: string
        payout: string
        fee: string
        feeRecipient: { id: string }
        timestamp: string
      }[]
    }[] = jsonData?.data?.draws ?? []

    const formattedDraws = draws.map((draw) => ({
      id: parseInt(draw.id),
      prizeClaims: draw.prizeClaims.map((claim) => ({
        id: claim.id,
        winner: claim.winner.id as Address,
        recipient: claim.recipient.id as Address,
        tier: claim.tier,
        prizeIndex: parseInt(claim.prizeIndex),
        payout: BigInt(claim.payout),
        fee: BigInt(claim.fee),
        feeRecipient: claim.feeRecipient.id as Address,
        timestamp: parseInt(claim.timestamp)
      }))
    }))

    return formattedDraws
  } else {
    console.warn(`Could not find subgraph URL for chain ID: ${chainId}`)
    return []
  }
}

/**
 * Returns past draws from the given network's subgraph
 *
 * NOTE: Wraps {@link getSubgraphDraws} to fetch all results regardless of number of entries
 * @param chainId the network's chain ID
 * @param options optional parameters
 */
export const getPaginatedSubgraphDraws = async (
  chainId: number,
  options?: { pageSize?: number }
) => {
  const draws: SubgraphDraw[] = []
  const drawIds: number[] = []
  const pageSize = options?.pageSize ?? 1_000
  let drawsPage = 0

  while (true) {
    let prizesPage = 0

    while (true) {
      let needsNewPrizesPage = false

      const newPage = await getSubgraphDraws(chainId, {
        numDraws: pageSize,
        numPrizes: pageSize,
        offsetDraws: drawsPage * pageSize,
        offsetPrizes: prizesPage * pageSize,
        orderDirection: 'asc'
      })

      newPage.forEach((draw) => {
        if (drawIds.includes(draw.id)) {
          if (draw.prizeClaims.length > 0) {
            const drawIndex = draws.findIndex((d) => d.id === draw.id)
            draws[drawIndex].prizeClaims.push(...draw.prizeClaims)
          }
        } else {
          draws.push(draw)
          drawIds.push(draw.id)
        }

        if (draw.prizeClaims.length >= pageSize) {
          needsNewPrizesPage = true
        }
      })

      if (needsNewPrizesPage) {
        prizesPage++
      } else {
        break
      }
    }

    if (draws.length < (drawsPage + 1) * pageSize) {
      break
    } else {
      drawsPage++
    }
  }

  // TODO: this sorting is not necessary if the subgraph would sort them correctly on ID
  draws.sort((a, b) => a.id - b.id)

  return draws
}

/**
 * Returns a user's prize history from the given network's subgraph
 *
 * NOTE: By default queries the last 1k prizes
 * @param chainId the network's chain ID
 * @param userAddress the user's wallet address
 * @param options optional parameters
 * @returns
 */
export const getUserSubgraphPrizes = async (
  chainId: number,
  userAddress: string,
  options?: {
    numPrizes?: number
    offsetPrizes?: number
  }
): Promise<SubgraphPrize[]> => {
  if (chainId in PRIZE_POOL_GRAPH_API_URLS) {
    const subgraphUrl = PRIZE_POOL_GRAPH_API_URLS[chainId as keyof typeof PRIZE_POOL_GRAPH_API_URLS]

    const headers = { 'Content-Type': 'application/json' }

    const body = JSON.stringify({
      query: `query($id: Bytes, $numPrizes: Int, $offsetPrizes: Int, $orderDirection: OrderDirection, $orderBy: PrizeClaim_orderBy) {
        account(id: $id) {
          prizesReceived(first: $numPrizes, skip: $offsetPrizes, orderDirection: $orderDirection, orderBy: $orderBy) {
            id
            draw { id }
            tier
            prizeIndex
            payout
            fee
            feeRecipient { id }
            timestamp
          }
        }
      }`,
      variables: {
        id: userAddress,
        numPrizes: options?.numPrizes ?? 1_000,
        offsetPrizes: options?.offsetPrizes ?? 0,
        orderDirection: 'asc',
        orderBy: 'timestamp'
      }
    })

    const result = await fetch(subgraphUrl, { method: 'POST', headers, body })
    const jsonData = await result.json()
    const wins: {
      id: string
      draw: { id: string }
      tier: number
      prizeIndex: string
      payout: string
      fee: string
      feeRecipient: { id: string }
      timestamp: string
    }[] = jsonData?.data?.account?.prizesReceived ?? []

    const formattedWins = wins.map((win) => ({
      id: win.id,
      drawId: parseInt(win.draw.id),
      tier: win.tier,
      prizeIndex: parseInt(win.prizeIndex),
      payout: BigInt(win.payout),
      fee: BigInt(win.fee),
      feeRecipient: win.feeRecipient.id as Address,
      timestamp: parseInt(win.timestamp)
    }))

    return formattedWins
  } else {
    console.warn(`Could not find subgraph URL for chain ID: ${chainId}`)
    return []
  }
}

/**
 * Returns a user's prize history from the given network's subgraph
 *
 * NOTE: Wraps {@link getUserSubgraphPrizes} to fetch all results regardless of number of entries
 * @param chainId the network's chain ID
 * @param userAddress the user's wallet address
 * @param options optional parameters
 */
export const getPaginatedUserSubgraphPrizes = async (
  chainId: number,
  userAddress: string,
  options?: { pageSize?: number }
) => {
  const userPrizes: SubgraphPrize[] = []
  const pageSize = options?.pageSize ?? 1_000
  let page = 0

  while (true) {
    const newPage = await getUserSubgraphPrizes(chainId, userAddress, {
      numPrizes: pageSize,
      offsetPrizes: page * pageSize
    })

    userPrizes.push(...newPage)

    if (newPage.length < pageSize) {
      break
    } else {
      page++
    }
  }

  return userPrizes
}

/**
 * Returns a user's TWAB observations from the given network's subgraph
 *
 * NOTE: By default queries the last 1k observations for a max of 1k vaults
 * @param chainId the network's chain ID
 * @param userAddress the user's wallet address
 * @param options optional parameters
 * @returns
 */
export const getUserSubgraphObservations = async (
  chainId: number,
  userAddress: string,
  options?: {
    numVaults?: number
    numObservations?: number
    offsetVaults?: number
    offsetObservations?: number
  }
): Promise<{ [vaultAddress: `0x${string}`]: SubgraphObservation[] }> => {
  if (chainId in TWAB_GRAPH_API_URLS) {
    const subgraphUrl = TWAB_GRAPH_API_URLS[chainId as keyof typeof TWAB_GRAPH_API_URLS]

    const headers = { 'Content-Type': 'application/json' }

    const body = JSON.stringify({
      query: `query($id: Bytes, $numVaults: Int, $numObservations: Int, $offsetVaults: Int, $offsetObservations: Int, $orderDirection: OrderDirection, $orderBy: AccountObservation_orderBy) {
        user(id: $id) {
          accounts(first: $numVaults, skip: $offsetVaults) {
            vault { id }
            observations(first: $numObservations, skip: $offsetObservations, orderDirection: $orderDirection, orderBy: $orderBy) {
              balance
              delegateBalance
              timestamp
              isNew
            }
          }
        }
      }`,
      variables: {
        id: userAddress,
        numVaults: options?.numVaults ?? 1_000,
        numObservations: options?.numObservations ?? 1_000,
        offsetVaults: options?.offsetVaults ?? 0,
        offsetObservations: options?.offsetObservations ?? 0,
        orderDirection: 'desc',
        orderBy: 'timestamp'
      }
    })

    const result = await fetch(subgraphUrl, { method: 'POST', headers, body })
    const jsonData = await result.json()
    const accounts: {
      vault: { id: string }
      observations: {
        balance: string
        delegateBalance: string
        timestamp: string
        isNew: boolean
      }[]
    }[] = jsonData?.data?.user?.accounts ?? []

    const observations: { [vaultAddress: `0x${string}`]: SubgraphObservation[] } = {}

    accounts.forEach((account) => {
      observations[account.vault.id as Address] = account.observations.map((obs) => ({
        balance: BigInt(obs.balance),
        delegateBalance: BigInt(obs.delegateBalance),
        timestamp: parseInt(obs.timestamp),
        isNew: obs.isNew
      }))
    })

    return observations
  } else {
    console.warn(`Could not find subgraph URL for chain ID: ${chainId}`)
    return {}
  }
}

/**
 * Returns a user's TWAB observations from the given network's subgraph
 *
 * NOTE: Wraps {@link getUserSubgraphObservations} to fetch all results regardless of number of entries
 * @param chainId the network's chain ID
 * @param userAddress the user's wallet address
 * @param options optional parameters
 */
export const getPaginatedUserSubgraphObservations = async (
  chainId: number,
  userAddress: string,
  options?: { pageSize?: number }
) => {
  const userObservations: { [vaultAddress: `0x${string}`]: SubgraphObservation[] } = {}
  const pageSize = options?.pageSize ?? 1_000
  let vaultsPage = 0

  while (true) {
    let observationsPage = 0

    while (true) {
      let needsNewObservationsPage = false

      const newPage = await getUserSubgraphObservations(chainId, userAddress, {
        numVaults: pageSize,
        numObservations: pageSize,
        offsetVaults: vaultsPage * pageSize,
        offsetObservations: observationsPage * pageSize
      })

      for (const key in newPage) {
        const vaultAddress = key as Address

        if (userObservations[vaultAddress] === undefined) {
          userObservations[vaultAddress] = newPage[vaultAddress]
        } else {
          const lastAddedObservationTimestamp =
            userObservations[vaultAddress][userObservations[vaultAddress].length - 1].timestamp

          if (newPage[vaultAddress][0]?.timestamp === lastAddedObservationTimestamp) {
            newPage[vaultAddress].shift()
          }

          userObservations[vaultAddress].push(...newPage[vaultAddress])

          if (newPage[vaultAddress].length >= pageSize - 1) {
            needsNewObservationsPage = true
          }
        }
      }

      if (needsNewObservationsPage) {
        observationsPage++
      } else {
        break
      }
    }

    if (Object.keys(userObservations).length < (vaultsPage + 1) * pageSize) {
      break
    } else {
      vaultsPage++
    }
  }

  return userObservations
}

/**
 * Returns all draw timestamps (first and last claims) from the given network's subgraph
 *
 * NOTE: By default queries the last 1k draw timestamps
 * @param chainId the network's chain ID
 * @param options optional parameters
 * @returns
 */
export const getSubgraphDrawTimestamps = async (
  chainId: number,
  options?: {
    numDraws?: number
    offsetDraws?: number
  }
): Promise<SubgraphDrawTimestamps[]> => {
  if (chainId in PRIZE_POOL_GRAPH_API_URLS) {
    const subgraphUrl = PRIZE_POOL_GRAPH_API_URLS[chainId as keyof typeof PRIZE_POOL_GRAPH_API_URLS]

    const headers = { 'Content-Type': 'application/json' }

    const body = JSON.stringify({
      query: `query($numDraws: Int, $offsetDraws: Int, $numPrizes: Int, $orderDirection: OrderDirection, $orderBy: Draw_orderBy, $firstPrizeOrderDirection: OrderDirection, $lastPrizeOrderDirection: OrderDirection, $prizeOrderBy: PrizeClaim_orderBy) {
        draws(first: $numDraws, skip: $offsetDraws, orderDirection: $orderDirection, orderBy: $orderBy) {
          id
          firstClaim: prizeClaims(first: $numPrizes, orderDirection: $firstPrizeOrderDirection, orderBy: $prizeOrderBy) {
            timestamp
          }
          lastClaim: prizeClaims(first: $numPrizes, orderDirection: $lastPrizeOrderDirection, orderBy: $prizeOrderBy) {
            timestamp
          }
        }
      }`,
      variables: {
        numDraws: options?.numDraws ?? 1_000,
        offsetDraws: options?.offsetDraws ?? 0,
        numPrizes: 1,
        orderDirection: 'asc',
        orderBy: 'id',
        firstPrizeOrderDirection: 'asc',
        lastPrizeOrderDirection: 'desc',
        prizeOrderBy: 'timestamp'
      }
    })

    const result = await fetch(subgraphUrl, { method: 'POST', headers, body })
    const jsonData = await result.json()
    const draws: {
      id: string
      firstClaim: [{ timestamp: string }]
      lastClaim: [{ timestamp: string }]
    }[] = jsonData?.data?.draws ?? []

    const formattedDraws = draws.map((draw) => ({
      id: parseInt(draw.id),
      firstClaim: parseInt(draw.firstClaim[0].timestamp),
      lastClaim: parseInt(draw.lastClaim[0].timestamp)
    }))

    return formattedDraws
  } else {
    console.warn(`Could not find subgraph URL for chain ID: ${chainId}`)
    return []
  }
}

/**
 * Returns all draw timestamps (first and last claims) from the given network's subgraph
 *
 * NOTE: Wraps {@link getSubgraphDrawTimestamps} to fetch all results regardless of number of entries
 * @param chainId the network's chain ID
 * @param options optional parameters
 */
export const getPaginatedSubgraphDrawTimestamps = async (
  chainId: number,
  options?: { pageSize?: number }
) => {
  const drawTimestamps: SubgraphDrawTimestamps[] = []
  const pageSize = options?.pageSize ?? 1_000
  let page = 0

  while (true) {
    const newPage = await getSubgraphDrawTimestamps(chainId, {
      numDraws: pageSize,
      offsetDraws: page * pageSize
    })

    drawTimestamps.push(...newPage)

    if (newPage.length < pageSize) {
      break
    } else {
      page++
    }
  }

  // TODO: this sorting is not necessary if the subgraph would sort them correctly on ID
  drawTimestamps.sort((a, b) => a.id - b.id)

  return drawTimestamps
}
