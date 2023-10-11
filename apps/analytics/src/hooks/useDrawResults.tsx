import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
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

  const { status, isFetched: isFetchedStatus } = useDrawStatus(prizePool, drawId)

  const isValidStatus = !!status && (status === 'awarded' || status === 'finalized')

  const { data, isFetched: isFetchedDrawResults } = useQuery(
    queryKey,
    async () => {
      try {
        const url = `${DRAW_RESULTS_URL}/${
          prizePool.chainId
        }/${prizePool.address.toLowerCase()}/draw/${drawId}/prizes.json`
        const result = await fetch(url)
        const drawResults: {
          vault: Address
          winner: Address
          tier: number
          prizeIndex: number
          amount: string
        }[] = await result.json()

        return drawResults.map((prize) => ({
          vault: prize.vault,
          winner: prize.winner,
          tier: prize.tier,
          prizeIndex: prize.prizeIndex,
          amount: BigInt(prize.amount)
        }))
      } catch {
        return []
      }
    },
    {
      enabled: !!prizePool && !!drawId && isValidStatus,
      ...NO_REFETCH,
      refetchInterval:
        !!status && status !== 'finalized' ? options?.refetchInterval ?? false : false
    }
  )

  const isFetched = isFetchedStatus && (status === 'open' || isFetchedDrawResults)

  return { data, isFetched }
}
