import { PrizeInfo } from '@shared/types'
import { Address, formatUnits, getContract, PublicClient } from 'viem'
import { prizePoolABI } from '../abis/prizePool'
import { SECONDS_PER_DAY } from '../constants'
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
