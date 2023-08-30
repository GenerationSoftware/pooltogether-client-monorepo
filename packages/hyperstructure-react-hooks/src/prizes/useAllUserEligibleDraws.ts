import { PrizePool } from '@pooltogether/hyperstructure-client-js'
import { SubgraphDrawTimestamp, SubgraphObservation } from '@shared/types'
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
      const eligibleDraws: { [chainId: number]: SubgraphDrawTimestamp[] } = {}
      const eligibleDrawsByVault: {
        [chainId: number]: { [vaultAddress: Address]: SubgraphDrawTimestamp[] }
      } = {}
      let totalNumEligibleDraws = 0

      // Looping through every chain with balance updates
      for (const key in allBalanceUpdates) {
        const chainId = parseInt(key)
        const drawTimestamps = allDrawTimestamps[chainId]

        const chainDraws: SubgraphDrawTimestamp[] = []
        const chainDrawsByVault: { [vaultAddress: Address]: SubgraphDrawTimestamp[] } = {}

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

        eligibleDraws[chainId] = chainDraws.sort((a, b) => a.timestamp - b.timestamp)
        eligibleDrawsByVault[chainId] = chainDrawsByVault
        totalNumEligibleDraws += chainDraws.length
      }

      return { eligibleDraws, eligibleDrawsByVault, totalNumEligibleDraws }
    }
  }, [allDrawTimestamps, allBalanceUpdates])

  return { data, isFetched }
}

const getVaultEligibleDraws = (
  draws: SubgraphDrawTimestamp[],
  balanceUpdates: SubgraphObservation[]
): SubgraphDrawTimestamp[] => {
  const drawsToCheck: SubgraphDrawTimestamp[] = [...draws]
  const eligibleDraws: SubgraphDrawTimestamp[] = []

  for (let balanceIndex = balanceUpdates.length - 1; balanceIndex >= 0; balanceIndex--) {
    const balanceUpdate = balanceUpdates[balanceIndex]
    for (let drawIndex = drawsToCheck.length - 1; drawIndex >= 0; drawIndex--) {
      const draw = drawsToCheck[drawIndex]
      if (draw.timestamp >= balanceUpdate.timestamp) {
        if (balanceUpdate.delegateBalance > 0) {
          eligibleDraws.push(draw)
        }
        drawsToCheck.pop()
      } else {
        break
      }
    }
  }

  return eligibleDraws.sort((a, b) => a.timestamp - b.timestamp)
}
