import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { SubgraphDrawTimestamps, SubgraphObservation } from '@shared/types'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useAllPrizeDrawTimestamps, useAllUserBalanceUpdates } from '..'

/**
 * Returns all draws a user was eligible for
 * @param prizePools instances of `PrizePool`
 * @param userAddress a user's address to check for eligibility
 * @returns
 */
export const useAllUserEligibleDraws = (prizePools: PrizePool[], userAddress: string) => {
  const { data: allDrawTimestamps, isFetched: isFetchedAllDrawTimestamps } =
    useAllPrizeDrawTimestamps(prizePools)

  const { data: allBalanceUpdates, isFetched: isFetchedAllBalanceUpdates } =
    useAllUserBalanceUpdates(prizePools, userAddress)

  const isFetched = isFetchedAllDrawTimestamps && isFetchedAllBalanceUpdates

  const data = useMemo(() => {
    if (!!allDrawTimestamps && !!allBalanceUpdates) {
      const eligibleDraws: { [chainId: number]: SubgraphDrawTimestamps[] } = {}
      const eligibleDrawsByVault: {
        [chainId: number]: { [vaultAddress: Address]: SubgraphDrawTimestamps[] }
      } = {}
      let totalNumEligibleDraws = 0

      // Looping through every chain with balance updates
      for (const key in allBalanceUpdates) {
        const chainId = parseInt(key)
        const drawTimestamps = allDrawTimestamps[chainId]

        const chainDraws: SubgraphDrawTimestamps[] = []
        const chainDrawsByVault: { [vaultAddress: Address]: SubgraphDrawTimestamps[] } = {}

        // Looping through every vault with balance updates
        if (!!allDrawTimestamps[chainId] && !!allBalanceUpdates[chainId]) {
          for (const strVaultAddress in allBalanceUpdates[chainId]) {
            const vaultAddress = strVaultAddress as Address

            const balanceUpdates = [...allBalanceUpdates[chainId][vaultAddress]].reverse()
            const newObservationIndex = balanceUpdates.findIndex((obs) => obs.isNew)
            const slicedBalanceUpdates =
              newObservationIndex !== -1
                ? balanceUpdates.slice(0, newObservationIndex + 1)
                : balanceUpdates

            const vaultDraws = getVaultEligibleDraws(drawTimestamps, slicedBalanceUpdates)

            vaultDraws.forEach((draw) => {
              const existingDraw = chainDraws.findIndex((d) => d.id === draw.id)
              if (existingDraw === -1) {
                chainDraws.push(draw)
              }
            })

            chainDrawsByVault[vaultAddress] = vaultDraws
          }
        }

        eligibleDraws[chainId] = chainDraws.sort((a, b) => a.firstClaim - b.firstClaim)
        eligibleDrawsByVault[chainId] = chainDrawsByVault
        totalNumEligibleDraws += chainDraws.length
      }

      return { eligibleDraws, eligibleDrawsByVault, totalNumEligibleDraws }
    }
  }, [allDrawTimestamps, allBalanceUpdates])

  return { data, isFetched }
}

const getVaultEligibleDraws = (
  draws: SubgraphDrawTimestamps[],
  balanceUpdates: SubgraphObservation[]
): SubgraphDrawTimestamps[] => {
  const drawsToCheck: SubgraphDrawTimestamps[] = [...draws]
  const eligibleDraws: SubgraphDrawTimestamps[] = []

  for (let balanceIndex = balanceUpdates.length - 1; balanceIndex >= 0; balanceIndex--) {
    const balanceUpdate = balanceUpdates[balanceIndex]
    for (let drawIndex = drawsToCheck.length - 1; drawIndex >= 0; drawIndex--) {
      const draw = drawsToCheck[drawIndex]
      // TODO: balance update timestamps are now relative, need to add first draw starts at timestamp before comparison
      if (draw.firstClaim >= balanceUpdate.timestamp) {
        if (balanceUpdate.delegateBalance > 0) {
          eligibleDraws.push(draw)
        }
        drawsToCheck.pop()
      } else {
        break
      }
    }
  }

  return eligibleDraws.sort((a, b) => a.firstClaim - b.firstClaim)
}
