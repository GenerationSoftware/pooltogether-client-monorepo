import {
  SubgraphDraw,
  SubgraphDrawTimestamp,
  SubgraphObservation,
  SubgraphPrize
} from '@shared/types'
import { Address } from 'viem'
import { PRIZE_POOL_GRAPH_API_URLS, TWAB_GRAPH_API_URLS } from '../constants'

/**
 * Returns past draws from the given network's subgraph
 *
 * NOTE: By default queries the last 100 draws
 * @param chainId the prize pool's chain ID
 * @param options optional parameters
 * @returns
 */
export const getSubgraphDraws = async (
  chainId: number,
  options?: { first?: number; skip?: number; orderDirection?: 'asc' | 'desc' }
): Promise<SubgraphDraw[]> => {
  if (chainId in PRIZE_POOL_GRAPH_API_URLS) {
    const subgraphUrl = PRIZE_POOL_GRAPH_API_URLS[chainId as keyof typeof PRIZE_POOL_GRAPH_API_URLS]

    const headers = { 'Content-Type': 'application/json' }

    const body = JSON.stringify({
      query: `query($first: Int, $skip: Int, $orderDirection: OrderDirection, $orderBy: Draw_orderBy) {
        draws(first: $first, skip: $skip, orderDirection: $orderDirection, orderBy: $orderBy) {
          id
          prizeClaims {
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
        first: options?.first ?? 100,
        skip: options?.skip ?? 0,
        orderDirection: options?.orderDirection ?? 'desc',
        orderBy: 'id'
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
 * Returns a user's prize history from the given network's subgraph
 * @param chainId the prize pool's chain ID
 * @param userAddress the user's wallet address
 * @returns
 */
export const getUserSubgraphPrizes = async (
  chainId: number,
  userAddress: string
): Promise<SubgraphPrize[]> => {
  if (chainId in PRIZE_POOL_GRAPH_API_URLS) {
    const subgraphUrl = PRIZE_POOL_GRAPH_API_URLS[chainId as keyof typeof PRIZE_POOL_GRAPH_API_URLS]

    const headers = { 'Content-Type': 'application/json' }

    const body = JSON.stringify({
      query: `query($id: Bytes) {
        account(id: $id) {
          prizesReceived {
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
        id: userAddress
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
 * Returns a user's TWAB observations from the given network's subgraph
 * @param chainId the prize pool's chain ID
 * @param userAddress the user's wallet address
 * @returns
 */
export const getUserSubgraphObservations = async (
  chainId: number,
  userAddress: string
): Promise<{ [vaultAddress: `0x${string}`]: SubgraphObservation[] }> => {
  if (chainId in TWAB_GRAPH_API_URLS) {
    const subgraphUrl = TWAB_GRAPH_API_URLS[chainId as keyof typeof TWAB_GRAPH_API_URLS]

    const headers = { 'Content-Type': 'application/json' }

    const body = JSON.stringify({
      query: `query($id: Bytes, $orderBy: AccountObservation_orderBy) {
        user(id: $id) {
          accounts {
            vault { id }
            observations(orderBy: $orderBy) {
              balance
              delegateBalance
              timestamp
            }
          }
        }
      }`,
      variables: {
        id: userAddress,
        orderBy: 'timestamp'
      }
    })

    const result = await fetch(subgraphUrl, { method: 'POST', headers, body })
    const jsonData = await result.json()
    const accounts: {
      vault: { id: string }
      observations: { balance: string; delegateBalance: string; timestamp: string }[]
    }[] = jsonData?.data?.user?.accounts ?? []

    const observations: { [vaultAddress: `0x${string}`]: SubgraphObservation[] } = {}

    accounts.forEach((account) => {
      observations[account.vault.id as Address] = account.observations.map((obs) => ({
        balance: BigInt(obs.balance),
        delegateBalance: BigInt(obs.delegateBalance),
        timestamp: parseInt(obs.timestamp)
      }))
    })

    return observations
  } else {
    console.warn(`Could not find subgraph URL for chain ID: ${chainId}`)
    return {}
  }
}

/**
 * Returns all draw timestamps from the given network's subgraph
 * @param chainId the prize pool's chain ID
 * @returns
 */
export const getSubgraphDrawTimestamps = async (
  chainId: number
): Promise<SubgraphDrawTimestamp[]> => {
  if (chainId in PRIZE_POOL_GRAPH_API_URLS) {
    const subgraphUrl = PRIZE_POOL_GRAPH_API_URLS[chainId as keyof typeof PRIZE_POOL_GRAPH_API_URLS]

    const headers = { 'Content-Type': 'application/json' }

    const body = JSON.stringify({
      query: `query($first: Int, $orderDirection: OrderDirection, $orderBy: Draw_orderBy) {
        draws(orderDirection: $orderDirection, orderBy: $orderBy) {
          id
          prizeClaims(first: $first) {
            timestamp
          }
        }
      }`,
      variables: {
        orderDirection: 'asc',
        orderBy: 'id',
        first: 1
      }
    })

    const result = await fetch(subgraphUrl, { method: 'POST', headers, body })
    const jsonData = await result.json()
    const draws: { id: string; prizeClaims: [{ timestamp: string }] }[] =
      jsonData?.data?.draws ?? []

    const formattedDraws = draws.map((draw) => ({
      id: parseInt(draw.id),
      timestamp: parseInt(draw.prizeClaims[0].timestamp)
    }))

    return formattedDraws
  } else {
    console.warn(`Could not find subgraph URL for chain ID: ${chainId}`)
    return []
  }
}
