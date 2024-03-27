import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { Prize } from '@shared/types'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'
import { DRAW_RESULTS_URL, OLD_DRAW_RESULTS_URL } from '@constants/config'
import { useDrawStatus } from './useDrawStatus'

export const useDrawResults = (
  prizePool: PrizePool,
  drawId: number,
  options?: { refetchInterval?: number }
) => {
  const queryKey = ['drawPrizes', prizePool?.chainId, drawId]

  const { status, isFetched: isFetchedStatus } = useDrawStatus(prizePool, drawId)

  const isValidStatus = !!status && (status === 'awarded' || status === 'finalized')

  const { data, isFetched: isFetchedDrawResults } = useQuery({
    queryKey,
    queryFn: async () => {
      const prizes: Prize[] = []
      const chainId = prizePool.chainId
      const prizePoolAddress = prizePool.address.toLowerCase() as Address

      try {
        const lastDrawIdToQueryOldDrawResults = OLD_DRAW_RESULTS_URL[chainId]?.lastDrawId

        if (!!lastDrawIdToQueryOldDrawResults && drawId <= lastDrawIdToQueryOldDrawResults) {
          const url = `${OLD_DRAW_RESULTS_URL[chainId].url}/${prizePoolAddress}/draw/${drawId}/prizes.json`

          const result = await fetch(url)

          const drawResults: {
            vault: Address
            winner: Address
            tier: number
            prizeIndex: number
            amount: string
          }[] = await result.json()

          drawResults.forEach((prize) =>
            prizes.push({
              chainId,
              drawId,
              vault: prize.vault,
              winner: prize.winner,
              tier: prize.tier,
              prizeIndex: prize.prizeIndex,
              amount: BigInt(prize.amount)
            })
          )
        } else {
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
        }
      } catch {}

      return prizes
    },
    enabled: !!prizePool && !!drawId && isValidStatus,
    ...NO_REFETCH,
    refetchInterval: !!status && status !== 'finalized' ? options?.refetchInterval ?? false : false
  })

  const isFetched = isFetchedStatus && (status === 'open' || isFetchedDrawResults)

  return { data, isFetched }
}
