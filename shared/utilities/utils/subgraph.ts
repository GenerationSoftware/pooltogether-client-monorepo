import { SubgraphDraw, SubgraphObservation, SubgraphPrize } from '@shared/types'
import { Address } from 'viem'
import { getNetworkNameByChainId, lower } from '..'
import { SUBGRAPH_API_URLS } from '../constants'

/**
 * Returns past draws from the given network's subgraph
 *
 * NOTE: By default queries the last 50 draws, with a max of 100 prizes in each
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
    drawOrderDirection?: 'asc' | 'desc'
    prizeOrderDirection?: 'asc' | 'desc'
  }
): Promise<SubgraphDraw[]> => {
  if (chainId in SUBGRAPH_API_URLS) {
    const subgraphUrl = SUBGRAPH_API_URLS[chainId as keyof typeof SUBGRAPH_API_URLS]

    const headers = { 'Content-Type': 'application/json' }

    const body = JSON.stringify({
      query: `query($numDraws: Int, $numPrizes: Int, $offsetDraws: Int, $offsetPrizes: Int, $drawOrderDirection: OrderDirection, $drawOrderBy: Draw_orderBy, $prizeOrderDirection: OrderDirection, $prizeOrderBy: PrizeClaim_orderBy) {
        draws(first: $numDraws, skip: $offsetDraws, orderDirection: $drawOrderDirection, orderBy: $drawOrderBy) {
          drawId
          prizeClaims(first: $numPrizes, skip: $offsetPrizes, orderDirection: $prizeOrderDirection, orderBy: $prizeOrderBy) {
            id
            winner
            recipient
            prizeVault { address }
            tier
            prizeIndex
            payout
            claimReward
            claimRewardRecipient
            timestamp
            txHash
          }
        }
      }`,
      variables: {
        numDraws: options?.numDraws ?? 50,
        numPrizes: options?.numPrizes ?? 100,
        offsetDraws: options?.offsetDraws ?? 0,
        offsetPrizes: options?.offsetPrizes ?? 0,
        drawOrderDirection: options?.drawOrderDirection ?? 'desc',
        prizeOrderDirection: options?.prizeOrderDirection ?? 'asc',
        drawOrderBy: 'drawId',
        prizeOrderBy: 'timestamp'
      }
    })

    // TODO: temporary band-aid for huge queries that go over skip limit (6k):
    if (
      (!!options?.offsetDraws && options.offsetDraws > 5_500) ||
      (!!options?.offsetPrizes && options.offsetPrizes > 5_500)
    ) {
      return []
    }

    const result = await fetch(subgraphUrl, { method: 'POST', headers, body })
    const jsonData = await result.json()
    const draws: {
      drawId: number
      prizeClaims: {
        id: string
        winner: string
        recipient: string
        prizeVault: { address: string }
        tier: number
        prizeIndex: string
        payout: string
        claimReward: string
        claimRewardRecipient: string
        timestamp: string
        txHash: string
      }[]
    }[] = jsonData?.data?.draws ?? []

    const formattedDraws = draws.map((draw) => ({
      id: draw.drawId,
      prizeClaims: draw.prizeClaims.map((claim) => ({
        id: claim.id,
        winner: claim.winner as Address,
        recipient: claim.recipient as Address,
        vaultAddress: claim.prizeVault.address as Address,
        tier: claim.tier,
        prizeIndex: parseInt(claim.prizeIndex),
        payout: BigInt(claim.payout),
        claimReward: BigInt(claim.claimReward),
        claimRewardRecipient: claim.claimRewardRecipient as Address,
        timestamp: parseInt(claim.timestamp),
        txHash: claim.txHash as `0x${string}`
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
  options?: {
    pageSize?: { draws?: number; prizes?: number }
    onlyLastDraw?: boolean
    onlyLastPrizeClaim?: boolean
    maxRetries?: number
  }
) => {
  const draws: SubgraphDraw[] = []
  const drawIds: number[] = []
  const pageSize = {
    draws: options?.pageSize?.draws ?? 50,
    prizes: options?.pageSize?.prizes ?? 100
  }
  const maxRetries = options?.maxRetries ?? 3
  let drawsPage = 0

  while (true) {
    let prizesPage = 0

    while (true) {
      let needsNewPrizesPage = false

      let isSuccess = false
      let retryCount = 0
      let retryDelay = 2_000

      while (!isSuccess && retryCount < maxRetries) {
        try {
          const newPage = await getSubgraphDraws(chainId, {
            numDraws: options?.onlyLastDraw ? 1 : pageSize.draws,
            numPrizes: options?.onlyLastPrizeClaim ? 1 : pageSize.prizes,
            offsetDraws: drawsPage * pageSize.draws,
            offsetPrizes: prizesPage * pageSize.prizes,
            drawOrderDirection: options?.onlyLastDraw ? 'desc' : 'asc',
            prizeOrderDirection: options?.onlyLastPrizeClaim ? 'desc' : 'asc'
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

            if (draw.prizeClaims.length >= pageSize.prizes) {
              needsNewPrizesPage = true
            }
          })

          isSuccess = true
        } catch {
          if (retryCount < maxRetries - 1) {
            await new Promise((resolve) => setTimeout(resolve, retryDelay))
          } else {
            console.warn(
              `Could not query subgraph draws on ${getNetworkNameByChainId(chainId)}: Draws ${
                drawsPage * pageSize.draws
              }+`
            )
          }

          retryCount++
          retryDelay *= 2
        }
      }

      if (needsNewPrizesPage) {
        prizesPage++
      } else {
        break
      }
    }

    if (draws.length < (drawsPage + 1) * pageSize.draws || !!options?.onlyLastDraw) {
      break
    } else {
      drawsPage++
    }
  }

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
    lastPrizeId?: string
  }
): Promise<SubgraphPrize[]> => {
  if (chainId in SUBGRAPH_API_URLS) {
    const subgraphUrl = SUBGRAPH_API_URLS[chainId as keyof typeof SUBGRAPH_API_URLS]

    const headers = { 'Content-Type': 'application/json' }

    const body = JSON.stringify({
      query: `query($id: Bytes, $numPrizes: Int, $lastPrizeId: Bytes) {
        prizeClaims(where: { winner: $id, id_gt: $lastPrizeId }, first: $numPrizes) {
          id
          draw { drawId }
          prizeVault { address }
          tier
          prizeIndex
          payout
          claimReward
          claimRewardRecipient
          timestamp
          txHash
        }
      }`,
      variables: {
        id: userAddress,
        numPrizes: options?.numPrizes ?? 1_000,
        lastPrizeId: options?.lastPrizeId ?? ''
      }
    })

    const result = await fetch(subgraphUrl, { method: 'POST', headers, body })
    const jsonData = await result.json()
    const wins: {
      id: string
      draw: { drawId: number }
      prizeVault: { address: string }
      tier: number
      prizeIndex: string
      payout: string
      claimReward: string
      claimRewardRecipient: string
      timestamp: string
      txHash: string
    }[] = jsonData?.data?.prizeClaims ?? []

    const formattedWins = wins.map((win) => ({
      id: win.id,
      drawId: win.draw.drawId,
      vaultAddress: win.prizeVault.address as Address,
      tier: win.tier,
      prizeIndex: parseInt(win.prizeIndex),
      payout: BigInt(win.payout),
      claimReward: BigInt(win.claimReward),
      claimRewardRecipient: win.claimRewardRecipient as Address,
      timestamp: parseInt(win.timestamp),
      txHash: win.txHash as `0x${string}`
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
  let lastPrizeId = ''

  while (true) {
    const newPage = await getUserSubgraphPrizes(chainId, userAddress, {
      numPrizes: pageSize,
      lastPrizeId
    })

    userPrizes.push(...newPage)

    if (newPage.length < pageSize) {
      break
    } else {
      lastPrizeId = newPage[newPage.length - 1].id
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
  if (chainId in SUBGRAPH_API_URLS) {
    const subgraphUrl = SUBGRAPH_API_URLS[chainId as keyof typeof SUBGRAPH_API_URLS]

    const headers = { 'Content-Type': 'application/json' }

    const body = JSON.stringify({
      query: `query($address: Bytes, $numVaults: Int, $numObservations: Int, $offsetVaults: Int, $offsetObservations: Int, $orderDirection: OrderDirection, $orderBy: AccountObservation_orderBy) {
        user(id: $address) {
          accounts(first: $numVaults, skip: $offsetVaults) {
            prizeVault { address }
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
        address: userAddress,
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
      prizeVault: { address: string }
      observations: {
        balance: string
        delegateBalance: string
        timestamp: string
        isNew: boolean
      }[]
    }[] = jsonData?.data?.user?.accounts ?? []

    const observations: { [vaultAddress: `0x${string}`]: SubgraphObservation[] } = {}

    accounts.forEach((account) => {
      observations[account.prizeVault.address as Address] = account.observations.map((obs) => ({
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
 * Returns a prize pool's unique wallet addresses
 *
 * NOTE: By default queries 1k addresses
 * @param chainId the network's chain ID
 * @param options optional parameters
 * @returns
 */
export const getSubgraphWalletAddresses = async (
  chainId: number,
  options?: {
    activeWalletsOnly?: boolean
    numWallets?: number
    lastWalletAddress?: Address
  }
): Promise<Lowercase<Address>[]> => {
  if (chainId in SUBGRAPH_API_URLS) {
    const subgraphUrl = SUBGRAPH_API_URLS[chainId as keyof typeof SUBGRAPH_API_URLS]

    const headers = { 'Content-Type': 'application/json' }

    const optionalFilter = options?.activeWalletsOnly
      ? ', accounts_: { delegateBalance_gt: 0 }'
      : ''

    const body = JSON.stringify({
      query: `query($numWallets: Int, $lastWalletAddress: Bytes) {
        users(where: { address_gt: $lastWalletAddress${optionalFilter} }, first: $numWallets) {
          address
        }
      }`,
      variables: {
        numWallets: options?.numWallets ?? 1_000,
        lastWalletAddress: options?.lastWalletAddress ?? ''
      }
    })

    const result = await fetch(subgraphUrl, { method: 'POST', headers, body })
    const jsonData = await result.json()
    const wallets: { address: string }[] = jsonData?.data?.users ?? []

    return wallets.map((wallet) => lower(wallet.address))
  } else {
    console.warn(`Could not find subgraph URL for chain ID: ${chainId}`)
    return []
  }
}

/**
 * Returns all of a prize pool's unique wallet addresses
 *
 * NOTE: Wraps {@link getSubgraphWalletAddresses} to fetch all results regardless of number of entries
 * @param chainId the network's chain ID
 * @param options optional parameters
 */
export const getPaginatedSubgraphWalletAddresses = async (
  chainId: number,
  options?: {
    activeWalletsOnly?: boolean
    pageSize?: number
    maxRetries?: number
    paginationDelay?: number
  }
) => {
  const walletAddresses = new Set<Lowercase<Address>>()
  const pageSize = options?.pageSize ?? 1_000
  const maxRetries = options?.maxRetries ?? 3
  const paginationDelay = options?.paginationDelay ?? 0
  let lastWalletAddress: Address | undefined = undefined

  while (true) {
    let needsNewWalletsPage = false

    let isSuccess = false
    let retryCount = 0
    let retryDelay = 2_000

    if (!!paginationDelay && !!lastWalletAddress) {
      await new Promise((resolve) => setTimeout(resolve, paginationDelay))
    }

    while (!isSuccess && retryCount < maxRetries) {
      try {
        const newPage = await getSubgraphWalletAddresses(chainId, {
          activeWalletsOnly: options?.activeWalletsOnly,
          numWallets: pageSize,
          lastWalletAddress
        })

        newPage.forEach((address) => walletAddresses.add(address))

        if (newPage.length >= pageSize) {
          needsNewWalletsPage = true
          lastWalletAddress = newPage[newPage.length - 1]
        }

        isSuccess = true
      } catch {
        if (retryCount < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, paginationDelay + retryDelay))
        } else {
          console.warn(
            `Could not query subgraph wallet addresses on ${getNetworkNameByChainId(
              chainId
            )}: ${lastWalletAddress?.slice(0, 6)}...+`
          )
        }

        retryCount++
        retryDelay *= 2
      }
    }

    if (!needsNewWalletsPage) break
  }

  return [...walletAddresses]
}
