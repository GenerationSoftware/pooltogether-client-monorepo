import {
  calculateOdds,
  calculateUnionProbability,
  PrizePool,
  Vaults
} from '@pooltogether/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import {
  useAllUserVaultBalances,
  useAllVaultPercentageContributions,
  useAllVaultShareData
} from '..'
import { QUERY_KEYS } from '../constants'

/**
 * Return the odds of a user winning any prize within any one draw for any prize pool or vault
 * @param prizePools array of instances of the `PrizePool` class
 * @param vaults instance of the `Vaults` class
 * @param userAddress the user's wallet address
 * @returns
 */
export const useAllUserPrizeOdds = (
  prizePools: PrizePool[],
  vaults: Vaults,
  userAddress: string
): { data?: { percent: number; oneInX: number }; isFetched: boolean } => {
  const { data: shareData, isFetched: isFetchedShareData } = useAllVaultShareData(vaults)

  const { data: shareBalances, isFetched: isFetchedShareBalance } = useAllUserVaultBalances(
    vaults,
    userAddress
  )

  const { data: vaultContributions, isFetched: isFetchedVaultContributions } =
    useAllVaultPercentageContributions(prizePools, vaults)

  const results = useQueries({
    queries: prizePools.map((prizePool) => {
      const vaultIds = Object.keys(vaults.vaults).filter(
        (vaultId) => vaults.vaults[vaultId].chainId === prizePool.chainId
      )
      const queryKey = [QUERY_KEYS.prizeOdds, prizePool?.id, vaultIds, userAddress]

      const enabled =
        !!prizePool &&
        !!vaults &&
        !!userAddress &&
        isFetchedShareData &&
        isFetchedShareBalance &&
        isFetchedVaultContributions &&
        !!shareData &&
        !!shareBalances &&
        !!vaultContributions

      return {
        queryKey: queryKey,
        queryFn: async () => {
          const numPrizes = await prizePool.getEstimatedPrizeCount()

          const probabilities = vaultIds.map((vaultId) => {
            if (!!shareData && !!shareBalances && !!vaultContributions) {
              const userShares = shareBalances[vaultId].amount
              const totalShares = shareData[vaultId].totalSupply
              const decimals = shareData[vaultId].decimals
              const vaultContribution = vaultContributions[vaultId]

              return calculateOdds(userShares, totalShares, decimals, vaultContribution, numPrizes)
            } else {
              return 0
            }
          })

          return calculateUnionProbability(probabilities)
        },
        enabled,
        ...NO_REFETCH
      }
    })
  })

  return useMemo(() => {
    const isFetched = results?.every((result) => result.isFetched)
    const refetch = () => results?.forEach((result) => result.refetch())

    const probabilities = results.map((result) => result.data ?? 0)
    const percent = calculateUnionProbability(probabilities)
    const oneInX = 1 / percent

    return { isFetched, refetch, data: { percent, oneInX } }
  }, [results])
}
