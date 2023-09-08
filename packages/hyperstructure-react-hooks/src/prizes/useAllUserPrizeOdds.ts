import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { calculateOdds, calculateUnionProbability } from '@shared/utilities'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import {
  useAllUserVaultBalances,
  useAllUserVaultDelegationBalances,
  useAllVaultPercentageContributions,
  useAllVaultShareData,
  useSelectedVaults
} from '..'
import { QUERY_KEYS } from '../constants'

/**
 * Return the odds of a user winning any prize within one draw for any given prize pools
 * @param prizePools array of instances of the `PrizePool` class
 * @param userAddress the user's wallet address
 * @returns
 */
export const useAllUserPrizeOdds = (
  prizePools: PrizePool[],
  userAddress: string
): { data: { [prizePoolId: string]: number }; isFetched: boolean } => {
  const { vaults } = useSelectedVaults()

  const {
    data: shareData,
    isFetched: isFetchedShareData,
    refetch: refetchShareData
  } = useAllVaultShareData(vaults)

  const { refetch: refetchShareBalances } = useAllUserVaultBalances(vaults, userAddress)

  const {
    data: delegationBalances,
    isFetched: isFetchedDelegationBalances,
    refetch: refetchDelegationBalances
  } = useAllUserVaultDelegationBalances(vaults, userAddress)

  const {
    data: vaultContributions,
    isFetched: isFetchedVaultContributions,
    refetch: refetchVaultContributions
  } = useAllVaultPercentageContributions(prizePools, vaults)

  const results = useQueries({
    queries: prizePools.map((prizePool) => {
      const vaultIds = Object.keys(vaults.vaults).filter(
        (vaultId) => vaults.vaults[vaultId].chainId === prizePool.chainId
      )
      const queryKey = [QUERY_KEYS.prizeOdds, prizePool?.id, vaultIds, userAddress]

      const enabled =
        !!prizePool &&
        !!userAddress &&
        isFetchedShareData &&
        isFetchedDelegationBalances &&
        isFetchedVaultContributions &&
        !!shareData &&
        !!delegationBalances &&
        !!vaultContributions

      return {
        queryKey: queryKey,
        queryFn: async () => {
          const numPrizes = await prizePool.getEstimatedPrizeCount()

          const probabilities = vaultIds.map((vaultId) => {
            if (!!shareData && !!delegationBalances && !!vaultContributions) {
              const userShares = delegationBalances[vaultId]
              const totalShares = shareData[vaultId].totalSupply
              const decimals = shareData[vaultId].decimals
              const vaultContribution = vaultContributions[vaultId]

              return calculateOdds(userShares, totalShares, decimals, vaultContribution, numPrizes)
            } else {
              return 0
            }
          })

          const prizePoolId = prizePool.id
          const odds = calculateUnionProbability(probabilities)

          return { prizePoolId, odds }
        },
        enabled,
        ...NO_REFETCH
      }
    })
  })

  return useMemo(() => {
    const isFetched = results?.every((result) => result.isFetched)

    const refetch = () => {
      refetchShareData()
      refetchShareBalances()
      refetchDelegationBalances()
      refetchVaultContributions()
      results?.forEach((result) => {
        result.refetch()
      })
    }

    const data: { [prizePoolId: string]: number } = {}
    results.forEach((result) => {
      if (!!result.data) {
        data[result.data.prizePoolId] = result.data.odds
      }
    })

    return { isFetched, refetch, data }
  }, [results])
}
