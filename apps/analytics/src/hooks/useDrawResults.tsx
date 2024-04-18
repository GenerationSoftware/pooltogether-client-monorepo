import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { Prize } from '@shared/types'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'
import { DRAW_RESULTS_URL } from '@constants/config'
import { useDrawStatus } from './useDrawStatus'

export const useDrawResults = (
  prizePool: PrizePool,
  drawId: number,
  options?: { refetchInterval?: number }
) => {
  const queryKey = ['drawResults', prizePool?.chainId, drawId]

  const { status, isSkipped, isFetched: isFetchedStatus } = useDrawStatus(prizePool, drawId)

  const isValidStatus =
    isFetchedStatus && !!status && !isSkipped && (status === 'awarded' || status === 'finalized')

  return useQuery({
    queryKey,
    queryFn: async () => {
      const prizes: Prize[] = []
      const chainId = prizePool.chainId
      const prizePoolAddress = prizePool.address.toLowerCase() as Address

      try {
        const url = `${DRAW_RESULTS_URL[chainId]}/${prizePoolAddress}/draw/${drawId}/winners.json`

        const result = await fetch(url)

        const drawResults: {
          [vaultAddress: Address]: { user: Address; prizes: { [tier: string]: number[] } }[]
        } = await result.json()

        Object.entries(drawResults).forEach(([_vault, vaultPrizes]) => {
          const vault = _vault as Address

          vaultPrizes.forEach((entry) => {
            Object.entries(entry.prizes).forEach(([_tier, prizeIndexes]) => {
              const tier = parseInt(_tier)

              prizeIndexes.forEach((prizeIndex) => {
                prizes.push({ chainId, drawId, vault, winner: entry.user, tier, prizeIndex })
              })
            })
          })
        })
      } catch {}

      return prizes
    },
    enabled: !!prizePool && !!drawId && isValidStatus,
    ...NO_REFETCH,
    refetchInterval: !!status && status !== 'finalized' ? options?.refetchInterval ?? false : false
  })
}
