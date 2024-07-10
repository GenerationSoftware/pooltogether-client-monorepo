import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useLastAwardedDrawId,
  usePrizeTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { prizePoolABI } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { formatUnits } from 'viem'

export const usePPCsOverTime = (prizePool: PrizePool) => {
  const { data: lastAwardedDrawId } = useLastAwardedDrawId(prizePool)

  const { data: prizeToken } = usePrizeTokenData(prizePool)

  return useQuery({
    queryKey: ['ppcsOverTime', prizePool?.id, lastAwardedDrawId],
    queryFn: async () => {
      const ppcs: { [drawId: number]: number } = {}

      if (!!lastAwardedDrawId && !!prizeToken) {
        const drawIds = Array.from({ length: lastAwardedDrawId }, (_, i) => i + 1)

        const contracts = drawIds.map((drawId) => ({
          address: prizePool.address,
          abi: prizePoolABI,
          functionName: 'getTotalContributedBetween',
          args: [drawId, drawId]
        }))

        // @ts-ignore
        const multicallResults = await prizePool.publicClient.multicall({ contracts })

        drawIds.forEach((drawId, i) => {
          const data = multicallResults[i]

          if (!!data && data.status === 'success') {
            ppcs[drawId] = parseFloat(formatUnits(data.result as bigint, prizeToken.decimals))
          }
        })
      }

      return ppcs
    },
    enabled: !!prizePool && !!lastAwardedDrawId && !!prizeToken,
    ...NO_REFETCH
  })
}
