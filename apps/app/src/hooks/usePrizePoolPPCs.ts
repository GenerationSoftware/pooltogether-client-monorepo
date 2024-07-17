import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery } from '@tanstack/react-query'

export const usePrizePoolPPCs = (prizePool: PrizePool, drawIds: { start: number; end: number }) => {
  return useQuery({
    queryKey: ['prizePoolPPCs', prizePool?.id, drawIds?.start, drawIds?.end],
    queryFn: async () => await prizePool.getTotalContributedAmount(drawIds.start, drawIds.end),
    enabled: !!prizePool && !!drawIds?.start && !!drawIds.end,
    ...NO_REFETCH
  })
}
