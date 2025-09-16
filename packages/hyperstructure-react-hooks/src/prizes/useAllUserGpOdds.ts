import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { calculateGpOdds, calculateUnionProbability } from '@shared/utilities'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import {
  useAllGrandPrizePeriodDraws,
  useAllUserVaultBalances,
  useAllUserVaultDelegationBalances,
  useAllVaultPercentageContributions,
  useAllVaultShareData,
  useSelectedVaults
} from '..'
import { QUERY_KEYS } from '../constants'

/**
 * Return the odds of a user winning the GP within one draw for any given prize pools
 * @param prizePools array of instances of the `PrizePool` class
 * @param userAddress the user's wallet address
 * @param options optional settings
 * @returns
 */
export const useAllUserGpOdds = (
  prizePools: PrizePool[],
  userAddress: string,
  options?: { refetchOnWindowFocus?: boolean }
): { data: { [prizePoolId: string]: number }; isFetched: boolean; isRefetching: boolean } => {
  const { vaults } = useSelectedVaults()

  const {
    data: shareData,
    isFetched: isFetchedShareData,
    refetch: refetchShareData,
    isRefetching: isRefetchingShareData
  } = useAllVaultShareData(vaults, { refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false })

  const { refetch: refetchShareBalances, isRefetching: isRefetchingShareBalances } =
    useAllUserVaultBalances(vaults, userAddress, {
      refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false
    })

  const {
    data: delegationBalances,
    isFetched: isFetchedDelegationBalances,
    refetch: refetchDelegationBalances,
    isRefetching: isRefetchingDelegationBalances
  } = useAllUserVaultDelegationBalances(vaults, userAddress, {
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false
  })

  const {
    data: vaultContributions,
    isFetched: isFetchedVaultContributions,
    refetch: refetchVaultContributions,
    isRefetching: isRefetchingVaultContributions
  } = useAllVaultPercentageContributions(prizePools, vaults, {
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false
  })

  const { data: allGpPeriodDraws, isFetched: isFetchedAllGpPeriodDraws } =
    useAllGrandPrizePeriodDraws(prizePools)

  const isRefetchingUserPrizeOdds =
    isRefetchingShareData ||
    isRefetchingShareBalances ||
    isRefetchingDelegationBalances ||
    isRefetchingVaultContributions

  const results = useQueries({
    queries: prizePools.map((prizePool) => {
      const vaultIds = Object.keys(vaults.vaults).filter(
        (vaultId) => vaults.vaults[vaultId].chainId === prizePool.chainId
      )
      const queryKey = [QUERY_KEYS.gpOdds, prizePool?.id, vaultIds, userAddress]

      const gpPeriodDraws = isFetchedAllGpPeriodDraws ? allGpPeriodDraws?.[prizePool.id] : undefined

      const enabled =
        !!prizePool &&
        !!userAddress &&
        isFetchedShareData &&
        isFetchedDelegationBalances &&
        isFetchedVaultContributions &&
        isFetchedAllGpPeriodDraws &&
        !!shareData &&
        !!delegationBalances &&
        !!vaultContributions &&
        !!gpPeriodDraws

      return {
        queryKey: queryKey,
        queryFn: async () => {
          const probabilities = vaultIds.map((vaultId) => {
            if (!!shareData && !!delegationBalances && !!vaultContributions && !!gpPeriodDraws) {
              const userShares = delegationBalances[vaultId]
              const totalShares = shareData[vaultId].totalSupply
              const decimals = shareData[vaultId].decimals
              const vaultContribution = vaultContributions[vaultId]

              return calculateGpOdds(
                userShares,
                totalShares,
                decimals,
                vaultContribution,
                gpPeriodDraws
              )
            } else {
              return 0
            }
          })

          const prizePoolId = prizePool.id
          const odds = calculateUnionProbability(probabilities)

          return { prizePoolId, odds }
        },
        enabled,
        ...NO_REFETCH,
        refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false
      }
    })
  })

  return useMemo(() => {
    const isFetched = results?.every((result) => result.isFetched)
    const isRefetching = isRefetchingUserPrizeOdds || results?.some((result) => result.isRefetching)

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

    return { isFetched, refetch, isRefetching, data }
  }, [results])
}
