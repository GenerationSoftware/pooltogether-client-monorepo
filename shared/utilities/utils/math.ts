import { formatUnits, parseUnits } from 'viem'
import { getMaxPrecision } from './formatting'

/**
 * Pads two BigInts with a set precision then divides them
 * @param a numerator for division
 * @param b denominator for division
 * @param precision precision for padding (default is 4)
 * @returns
 */
export const divideBigInts = (a: bigint, b: bigint, precision: number = 4) => {
  if (!a || !b) return 0
  return parseFloat(formatUnits((a * BigInt(10 ** precision)) / b, precision))
}

/**
 * Calculates a percentage of a BigInt
 * @param bigint BigInt to calculate a percentage from
 * @param percentage percentage to calculate from BigInt (ex. 0.2)
 * @returns
 */
export const calculatePercentageOfBigInt = (bigint: bigint, percentage: number) => {
  const precision = getMaxPrecision(percentage)
  const shiftedPercentage = parseUnits(`${percentage}`, precision)
  return (bigint * shiftedPercentage) / BigInt(10 ** precision)
}

/**
 * Helper function to sort BigInts in ascending order
 * @param a first BigInt
 * @param b second BigInt
 * @returns
 */
export const sortByBigIntAsc = (a: bigint, b: bigint) => {
  const aSubB = a - b
  if (aSubB === 0n) return 0
  if (aSubB < 0n) return -1
  return 1
}

/**
 * Helper function to sort BigInts in descending order
 * @param a first BigInt
 * @param b second BigInt
 * @returns
 */
export const sortByBigIntDesc = (a: bigint, b: bigint) => {
  const bSubA = b - a
  if (bSubA === 0n) return 0
  if (bSubA < 0n) return -1
  return 1
}
