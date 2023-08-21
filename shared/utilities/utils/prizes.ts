import {
  PrizeInfo,
  SubgraphPrizePoolAccount,
  SubgraphPrizePoolDraw,
  SubgraphPrizePoolDrawTimestamp,
  SubgraphTWABAccount
} from '@shared/types'
import { Address, formatUnits, getContract, PublicClient } from 'viem'
import { prizePoolABI } from '../abis/prizePool'
import { PRIZE_POOL_GRAPH_API_URLS, SECONDS_PER_DAY, TWAB_GRAPH_API_URLS } from '../constants'
import { formatStringWithPrecision } from './formatting'
import { calculatePercentageOfBigInt, divideBigInts } from './math'
import { getSimpleMulticallResults } from './multicall'
import { getVaultId } from './vaults'

/**
 * Returns a unique prize pool ID
 * @param chainId the prize pool's chain ID
 * @param address the prize pool's address
 * @returns
 */
export const getPrizePoolId = (chainId: number, address: string) => {
  return `${address}-${chainId}`
}

/**
 * Returns prize pool contribution amounts for any vaults during the given draw IDs
 * @param publicClient a public Viem client for the prize pool's chain
 * @param prizePoolAddress the prize pool's address
 * @param vaultAddresses the addresses for any vaults to get contributions for
 * @param startDrawId start draw ID (inclusive)
 * @param endDrawId end draw ID (inclusive)
 * @returns
 */
export const getPrizePoolContributionAmounts = async (
  publicClient: PublicClient,
  prizePoolAddress: Address,
  vaultAddresses: Address[],
  startDrawId: number,
  endDrawId: number
): Promise<{ [vaultId: string]: bigint }> => {
  const contributionAmounts: { [vaultId: string]: bigint } = {}

  const chainId = await publicClient.getChainId()

  if (vaultAddresses.length > 0) {
    const calls = vaultAddresses.map((vaultAddress) => ({
      functionName: 'getContributedBetween',
      args: [vaultAddress, startDrawId, endDrawId]
    }))

    const multicallResults = await getSimpleMulticallResults(
      publicClient,
      prizePoolAddress,
      prizePoolABI,
      calls
    )

    vaultAddresses.forEach((vaultAddress, i) => {
      const result = multicallResults[i]
      const vaultContribution: bigint = typeof result === 'bigint' ? result : 0n
      const vaultId = getVaultId({ chainId, address: vaultAddress })
      contributionAmounts[vaultId] = vaultContribution
    })
  }

  return contributionAmounts
}

/**
 * Returns prize pool contribution percentages for any vaults during the given draw IDs
 *
 * NOTE: Percentage value from 0 to 1 (eg: 0.25 representing 25%)
 * @param publicClient a public Viem client for the prize pool's chain
 * @param prizePoolAddress the prize pool's address
 * @param vaultAddresses the addresses for any vaults to get contributions for
 * @param startDrawId start draw ID (inclusive)
 * @param endDrawId end draw ID (inclusive)
 * @returns
 */
export const getPrizePoolContributionPercentages = async (
  publicClient: PublicClient,
  prizePoolAddress: Address,
  vaultAddresses: Address[],
  startDrawId: number,
  endDrawId: number
): Promise<{ [vaultId: string]: number }> => {
  const contributionPercentages: { [vaultId: string]: number } = {}

  const chainId = await publicClient.getChainId()

  if (vaultAddresses.length > 0) {
    if (endDrawId >= startDrawId) {
      const calls = vaultAddresses.map((vaultAddress) => ({
        functionName: 'getVaultPortion',
        args: [vaultAddress, startDrawId, endDrawId]
      }))

      const multicallResults = await getSimpleMulticallResults(
        publicClient,
        prizePoolAddress,
        prizePoolABI,
        calls
      )

      vaultAddresses.forEach((vaultAddress, i) => {
        const result = multicallResults[i]
        const vaultContribution: bigint = typeof result === 'bigint' ? result : 0n
        const vaultId = getVaultId({ chainId, address: vaultAddress })
        contributionPercentages[vaultId] = parseFloat(formatUnits(vaultContribution, 18))
      })
    } else {
      vaultAddresses.forEach((vaultAddress) => {
        const vaultId = getVaultId({ chainId, address: vaultAddress })
        contributionPercentages[vaultId] = parseFloat(formatUnits(0n, 18))
      })
    }
  }

  return contributionPercentages
}

/**
 * Returns current and estimated prize amounts and frequency for any tiers of a prize pool
 * @param publicClient a public Viem client for the prize pool's chain
 * @param prizePoolAddress the prize pool's address
 * @param tiers the prize tiers to get info for
 * @param considerPastDraws the number of past draws to consider for amount estimates (min. 1 - default is 7)
 * @returns
 */
export const getPrizePoolAllPrizeInfo = async (
  publicClient: PublicClient,
  prizePoolAddress: Address,
  tiers: number[],
  considerPastDraws: number = 7
): Promise<PrizeInfo[]> => {
  const prizes: PrizeInfo[] = []

  if (considerPastDraws < 1) {
    throw new Error(`Invalid number of past draws to consider: ${considerPastDraws}`)
  }

  const calls: { functionName: string; args?: any[] }[] = [
    { functionName: 'drawPeriodSeconds' },
    { functionName: 'tierShares' },
    { functionName: 'getTotalShares' },
    { functionName: 'getLastClosedDrawId' },
    ...tiers.map((tier) => ({ functionName: 'getTierAccrualDurationInDraws', args: [tier] })),
    ...tiers.map((tier) => ({ functionName: 'getTierPrizeSize', args: [tier] }))
  ]

  const multicallResults = await getSimpleMulticallResults(
    publicClient,
    prizePoolAddress,
    prizePoolABI,
    calls
  )

  const lastDrawId = Number(multicallResults[3] ?? 0)
  const startDrawId =
    considerPastDraws > lastDrawId ? 1 : lastDrawId - Math.floor(considerPastDraws) + 1

  const prizePoolContract = getContract({
    address: prizePoolAddress,
    abi: prizePoolABI,
    publicClient
  })
  const totalContributions =
    lastDrawId > 0
      ? ((await prizePoolContract.read.getTotalContributedBetween([
          startDrawId,
          lastDrawId
        ])) as bigint)
      : 0n

  const drawPeriod = Number(multicallResults[0])

  const tierShares = BigInt(multicallResults[1]) ?? 0n
  const totalShares: bigint = multicallResults[2] ?? 0n
  const tierSharePercentage = divideBigInts(tierShares, totalShares)
  const formattedTierSharePercentage = parseFloat(
    formatStringWithPrecision(tierSharePercentage.toString(), 4)
  )

  const tierContributionPerDraw =
    calculatePercentageOfBigInt(totalContributions, formattedTierSharePercentage) /
    BigInt(Math.floor(considerPastDraws))

  tiers.forEach((tier) => {
    const tierPrizeCount = 4 ** tier

    const currentPrizeSize: bigint = multicallResults[tier + tiers.length + 4] ?? 0n

    const accrualDraws = Number(multicallResults[tier + 4])
    const accrualSeconds = accrualDraws * drawPeriod
    const accrualDays = accrualSeconds / SECONDS_PER_DAY

    const amount = {
      current: currentPrizeSize,
      estimated: (tierContributionPerDraw * BigInt(accrualDraws)) / BigInt(tierPrizeCount)
    }

    const dailyFrequency = tierPrizeCount / accrualDays

    prizes.push({ amount, dailyFrequency })
  })

  return prizes
}

/**
 * Returns historical prize pool draws and their winners
 *
 * NOTE: By default queries the last 100 draws
 * @param chainId the prize pool's chain ID
 * @param options optional parameters
 * @returns
 */
export const getPrizePoolHistoricalWins = async (
  chainId: number,
  options?: { first?: number; skip?: number; orderDirection?: 'asc' | 'desc' }
): Promise<SubgraphPrizePoolDraw[]> => {
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
    const draws: SubgraphPrizePoolDraw[] = jsonData?.data?.draws ?? []

    return draws
  } else {
    console.warn(`Could not find subgraph URL for chain ID: ${chainId}`)
    return []
  }
}

/**
 * Returns a user's historical prize pool wins
 * @param chainId the prize pool's chain ID
 * @param userAddress the user's wallet address
 * @returns
 */
export const getUserPrizePoolHistoricalWins = async (
  chainId: number,
  userAddress: string
): Promise<SubgraphPrizePoolAccount['prizesReceived']> => {
  if (chainId in PRIZE_POOL_GRAPH_API_URLS) {
    const subgraphUrl = PRIZE_POOL_GRAPH_API_URLS[chainId as keyof typeof PRIZE_POOL_GRAPH_API_URLS]

    const headers = { 'Content-Type': 'application/json' }

    const body = JSON.stringify({
      query: `query($id: Bytes) {
        account(id: $id) {
          id
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
    const wins: SubgraphPrizePoolAccount['prizesReceived'] =
      jsonData?.data?.account?.prizesReceived ?? []

    return wins
  } else {
    console.warn(`Could not find subgraph URL for chain ID: ${chainId}`)
    return []
  }
}

/**
 * Returns a user's historical account balance updates
 * @param chainId the prize pool's chain ID
 * @param userAddress the user's wallet address
 * @returns
 */
export const getUserBalanceUpdates = async (
  chainId: number,
  userAddress: string
): Promise<{
  [vaultAddress: Address]: {
    balance: bigint
    delegateBalance: bigint
    timestamp: number
  }[]
}> => {
  if (chainId in TWAB_GRAPH_API_URLS) {
    const subgraphUrl = TWAB_GRAPH_API_URLS[chainId as keyof typeof TWAB_GRAPH_API_URLS]

    const headers = { 'Content-Type': 'application/json' }

    const body = JSON.stringify({
      query: `query($id: Bytes, $orderBy: AccountObservation_orderBy) {
        user(id: $id) {
          id
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
    const accounts: SubgraphTWABAccount['accounts'] = jsonData?.data?.user?.accounts ?? []

    const balanceUpdates: {
      [vaultAddress: Address]: {
        balance: bigint
        delegateBalance: bigint
        timestamp: number
      }[]
    } = {}

    accounts.forEach((account) => {
      balanceUpdates[account.vault.id as Address] = account.observations.map((obs) => ({
        balance: BigInt(obs.balance),
        delegateBalance: BigInt(obs.delegateBalance),
        timestamp: parseInt(obs.timestamp)
      }))
    })

    return balanceUpdates
  } else {
    console.warn(`Could not find subgraph URL for chain ID: ${chainId}`)
    return {}
  }
}

/**
 * Returns prize pool draws and their timestamps
 * @param chainId the prize pool's chain ID
 * @returns
 */
export const getPrizePoolDrawTimestamps = async (
  chainId: number
): Promise<{ id: number; timestamp: number }[]> => {
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
    const draws: SubgraphPrizePoolDrawTimestamp[] = jsonData?.data?.draws ?? []
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
