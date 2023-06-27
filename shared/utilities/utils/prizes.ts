import { PrizeInfo, SubgraphPrizePoolAccount, SubgraphPrizePoolDraw } from '@shared/types'
import { formatUnits, getContract, PublicClient } from 'viem'
import { prizePool as prizePoolAbi } from '../abis/prizePool'
import { PRIZE_POOL_GRAPH_API_URLS, SECONDS_PER_DAY } from '../constants'
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
  prizePoolAddress: `0x${string}`,
  vaultAddresses: `0x${string}`[],
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
      prizePoolAbi,
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
  prizePoolAddress: `0x${string}`,
  vaultAddresses: `0x${string}`[],
  startDrawId: number,
  endDrawId: number
): Promise<{ [vaultId: string]: number }> => {
  const contributionPercentages: { [vaultId: string]: number } = {}

  const chainId = await publicClient.getChainId()

  if (vaultAddresses.length > 0) {
    const calls = vaultAddresses.map((vaultAddress) => ({
      functionName: 'getVaultPortion',
      args: [vaultAddress, startDrawId, endDrawId]
    }))

    const multicallResults = await getSimpleMulticallResults(
      publicClient,
      prizePoolAddress,
      prizePoolAbi,
      calls
    )

    vaultAddresses.forEach((vaultAddress, i) => {
      const result = multicallResults[i]
      const vaultContribution: bigint = typeof result === 'bigint' ? result : 0n
      const vaultId = getVaultId({ chainId, address: vaultAddress })
      contributionPercentages[vaultId] = parseFloat(formatUnits(vaultContribution, 18))
    })
  }

  return contributionPercentages
}

/**
 * Returns prize pool wins for a given user, vault addresses and prize tiers
 * @param publicClient a public Viem client for the prize pool's chain
 * @param prizePoolAddress the prize pool's address
 * @param vaultAddresses the addresses for any vaults the user is deposited into
 * @param userAddress the user's address
 * @param tiers the prize tiers to check for wins
 * @returns
 */
export const checkPrizePoolWins = async (
  publicClient: PublicClient,
  prizePoolAddress: `0x${string}`,
  vaultAddresses: `0x${string}`[],
  userAddress: `0x${string}`,
  tiers: number[]
): Promise<{
  [vaultId: string]: number[]
}> => {
  const wins: { [vaultId: string]: number[] } = {}

  const chainId = await publicClient.getChainId()

  if (vaultAddresses.length > 0 && tiers.length > 0) {
    const calls: { functionName: string; args?: any[] }[] = []

    vaultAddresses.forEach((vaultAddress) => {
      tiers.forEach((tier) => {
        calls.push({
          functionName: 'isWinner',
          args: [vaultAddress, userAddress, tier]
        })
      })
    })

    const multicallResults = await getSimpleMulticallResults(
      publicClient,
      prizePoolAddress,
      prizePoolAbi,
      calls
    )

    calls.forEach((call, i) => {
      const isWinner: boolean = multicallResults[i]
      if (isWinner) {
        const vaultAddress = call.args?.[0] as `0x${string}`
        const tier = call.args?.[2] as number
        const vaultId = getVaultId({ chainId, address: vaultAddress })
        if (wins[vaultId] === undefined) {
          wins[vaultId] = []
        }
        wins[vaultId].push(tier)
      }
    })
  }

  return wins
}

/**
 * Returns estimated prize amounts and frequency for any tiers of a prize pool
 * @param publicClient a public Viem client for the prize pool's chain
 * @param prizePoolAddress the prize pool's address
 * @param tiers the prize tiers to get info for
 * @param considerPastDraws the number of past draws to consider for amount estimates (min. 1 - default is 7)
 * @returns
 */
export const getPrizePoolAllPrizeInfo = async (
  publicClient: PublicClient,
  prizePoolAddress: `0x${string}`,
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
    { functionName: 'getLastCompletedDrawId' },
    ...tiers.map((tier) => ({ functionName: 'getTierAccrualDurationInDraws', args: [tier] }))
  ]

  const multicallResults = await getSimpleMulticallResults(
    publicClient,
    prizePoolAddress,
    prizePoolAbi,
    calls
  )

  const lastDrawId = Number(multicallResults[3] ?? 0)
  const startDrawId = considerPastDraws > lastDrawId ? 1 : lastDrawId - considerPastDraws + 1

  const prizePoolContract = getContract({
    address: prizePoolAddress,
    abi: prizePoolAbi,
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
  const totalShares = multicallResults[2] ?? 0n
  const tierSharePercentage = divideBigInts(tierShares, totalShares)
  const formattedTierSharePercentage = parseFloat(
    formatStringWithPrecision(tierSharePercentage.toString(), 4)
  )

  const tierContributionPerDraw =
    calculatePercentageOfBigInt(totalContributions, formattedTierSharePercentage) /
    BigInt(considerPastDraws)

  tiers.forEach((tier) => {
    const tierPrizeCount = 4 ** tier

    const accrualDraws = Number(multicallResults[tier + 4])
    const accrualSeconds = accrualDraws * drawPeriod
    const accrualDays = accrualSeconds / SECONDS_PER_DAY

    const amount = (tierContributionPerDraw * BigInt(accrualDraws)) / BigInt(tierPrizeCount)

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
            tier
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
