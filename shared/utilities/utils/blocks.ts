import { PublicClient } from 'viem'
import { abs, divideBigInts } from './math'

/**
 * Returns a block within a range of a given timestamp
 * @dev adapted from https://github.com/trmid/block-at-timestamp
 *
 * @param publicClient a public Viem client for the chain that should be queried
 * @param timestamp target timestamp in seconds
 * @param range target timestamp range in seconds (default is `60`)
 * @returns
 */
export const getBlockAtTimestamp = async (
  publicClient: PublicClient,
  timestamp: bigint,
  range: number = 60
) => {
  if (range < 1) throw new Error('range too small: must be at least 1 second')

  // Get starting block range:
  let lb = await publicClient.getBlock({ blockNumber: 1n })
  let ub = await publicClient.getBlock({ blockTag: 'latest' })
  let estBlock = ub

  // Check if target timestamp is outside of range:
  if (timestamp <= lb.timestamp) {
    return lb
  }
  if (timestamp >= ub.timestamp) {
    return ub
  }

  // Iterate, alternating between two methods, binary squeeze and block rate estimates:
  do {
    // Method 1: Binary squeeze:
    const mb = await publicClient.getBlock({
      blockNumber: lb.number + (ub.number - lb.number) / 2n
    })
    if (mb.timestamp > timestamp) {
      ub = mb
    } else if (mb.timestamp < timestamp) {
      lb = mb
    } else {
      return mb
    }

    // Check if we have any blocks left to query:
    const blockDiff = ub.number - lb.number
    if (blockDiff <= 1n) {
      let closest = ub
      if (abs(lb.timestamp - timestamp) < abs(ub.timestamp - timestamp)) closest = lb
      return closest
    }

    // Method 2: Estimate from avg block rate in new range:
    const timeDiff = ub.timestamp - lb.timestamp
    const avgSecBlock = divideBigInts(timeDiff, blockDiff)
    const estBlockNumber =
      BigInt(Math.floor(Number(timestamp - lb.timestamp) / avgSecBlock)) + lb.number
    estBlock = await publicClient.getBlock({ blockNumber: estBlockNumber })
    if (estBlock.timestamp > timestamp) {
      ub = estBlock
    } else {
      lb = estBlock
    }
  } while (abs(estBlock.timestamp - timestamp) > range)
  return estBlock
}
