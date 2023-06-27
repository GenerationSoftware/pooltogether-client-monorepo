import { PrizePool } from '@pooltogether/hyperstructure-client-js'
import { usePublicClient } from 'wagmi'
import { usePublicClientsByChain } from '..'

/**
 * Returns a keyed object of prize pool IDs and `PrizePool` instances
 * @param data data for each prize pool
 * @returns
 */
export const usePrizePools = (
  data: {
    chainId: number
    address: `0x${string}`
    options?: {
      prizeTokenAddress?: `0x${string}`
      drawPeriodInSeconds?: number
      tierShares?: number
    }
  }[]
): { [prizePoolId: string]: PrizePool } => {
  const publicClients = usePublicClientsByChain()

  const prizePools: { [prizePoolId: string]: PrizePool } = {}
  data.forEach((prizePoolData) => {
    const publicClient = publicClients[prizePoolData.chainId]
    if (!!publicClient) {
      const prizePool = new PrizePool(
        prizePoolData.chainId,
        prizePoolData.address,
        publicClient,
        prizePoolData.options
      )
      prizePools[prizePool.id] = prizePool
    }
  })

  return prizePools
}

/**
 * Returns an instance of a `PrizePool` class
 * @param chainId the prize pool's chain ID
 * @param address the prize pool's address
 * @param options optional parameters to skip some data fetching
 * @returns
 */
export const usePrizePool = (
  chainId: number,
  address: `0x${string}`,
  options?: { prizeTokenAddress?: `0x${string}`; drawPeriodInSeconds?: number; tierShares?: number }
): PrizePool => {
  const publicClient = usePublicClient({ chainId })

  return new PrizePool(chainId, address, publicClient, options)
}
