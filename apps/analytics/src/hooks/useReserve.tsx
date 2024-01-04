import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { useLastAwardedDrawId } from '@generationsoftware/hyperstructure-react-hooks'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { getSimpleMulticallResults, prizePoolABI } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { useDrawStatus } from './useDrawStatus'

export const useReserve = (prizePool: PrizePool, options?: { refetchInterval?: number }) => {
  const publicClient = usePublicClient({ chainId: prizePool?.chainId })

  const { data: lastAwardedDrawId } = useLastAwardedDrawId(prizePool, {
    refetchInterval: options?.refetchInterval
  })

  const { status: lastDrawStatus, isSkipped: isLastDrawSkipped } = useDrawStatus(
    prizePool,
    lastAwardedDrawId as number
  )

  const queryKey = ['reserve', prizePool?.chainId, lastAwardedDrawId, lastDrawStatus]

  return useQuery(
    queryKey,
    async () => {
      if (!!lastAwardedDrawId && !!lastDrawStatus) {
        const multicallResults = await getSimpleMulticallResults(
          publicClient,
          prizePool.address,
          prizePoolABI,
          [
            { functionName: 'reserve' },
            { functionName: 'pendingReserveContributions' },
            {
              functionName: 'getTotalContributedBetween',
              args: [lastAwardedDrawId + 1, lastAwardedDrawId + 1]
            },
            { functionName: 'numberOfTiers' }
          ]
        )

        const current = typeof multicallResults[0] === 'bigint' ? multicallResults[0] : 0n

        const pending = typeof multicallResults[1] === 'bigint' ? multicallResults[1] : 0n

        const contributions =
          typeof multicallResults[2] === 'bigint' ? multicallResults[2] : undefined
        const numTiers = typeof multicallResults[3] === 'number' ? multicallResults[3] : 0
        const pendingFallback = calculateFallbackPendingReserve(prizePool, contributions, numTiers)

        if ((lastDrawStatus === 'awarded' || isLastDrawSkipped) && pendingFallback !== undefined) {
          return { current, pending: pendingFallback }
        } else {
          return { current, pending }
        }
      }
    },
    {
      enabled: !!prizePool && !!publicClient && !!lastAwardedDrawId && !!lastDrawStatus,
      ...NO_REFETCH,
      refetchInterval: options?.refetchInterval ?? false
    }
  )
}

const calculateFallbackPendingReserve = (
  prizePool: PrizePool,
  contributions: bigint | undefined,
  numTiers: number
) => {
  if (
    !!prizePool &&
    !!prizePool.tierShares &&
    !!prizePool.reserveShares &&
    contributions !== undefined &&
    !!numTiers
  ) {
    const reserveShares = BigInt(prizePool.reserveShares)
    const totalShares = reserveShares + BigInt(prizePool.tierShares * numTiers)
    return (contributions * reserveShares) / totalShares
  }
}
