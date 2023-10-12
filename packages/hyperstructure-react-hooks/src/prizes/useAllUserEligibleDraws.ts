import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { DrawWithTimestamps, SubgraphObservation } from '@shared/types'
import { useMemo } from 'react'
import { Address } from 'viem'
import {
  useAllDrawIds,
  useAllDrawPeriods,
  useAllFirstDrawOpenedAt,
  useAllUserBalanceUpdates
} from '..'

/**
 * Returns all draws a user was eligible for
 * @param prizePools instances of `PrizePool`
 * @param userAddress a user's address to check for eligibility
 * @returns
 */
export const useAllUserEligibleDraws = (prizePools: PrizePool[], userAddress: string) => {
  const { data: allDrawIds, isFetched: isFetchedAllDrawIds } = useAllDrawIds(prizePools)

  const { data: allFirstDrawOpenedAt, isFetched: isFetchedAllFirstDrawOpenedAt } =
    useAllFirstDrawOpenedAt(prizePools)

  const { data: allDrawPeriods, isFetched: isFetchedAllDrawPeriods } = useAllDrawPeriods(prizePools)

  const { data: allBalanceUpdates, isFetched: isFetchedAllBalanceUpdates } =
    useAllUserBalanceUpdates(prizePools, userAddress)

  const isFetched =
    isFetchedAllDrawIds &&
    isFetchedAllFirstDrawOpenedAt &&
    isFetchedAllDrawPeriods &&
    isFetchedAllBalanceUpdates

  const data = useMemo(() => {
    if (isFetched) {
      const eligibleDraws: { [chainId: number]: DrawWithTimestamps[] } = {}
      const eligibleDrawsByVault: {
        [chainId: number]: { [vaultAddress: Address]: DrawWithTimestamps[] }
      } = {}
      let totalNumEligibleDraws = 0

      // Looping through every chain with balance updates
      for (const key in allBalanceUpdates) {
        const chainId = parseInt(key)
        const prizePoolId = Object.keys(allDrawIds).find(
          (id) => parseInt(id.split('-')[1]) === chainId
        )

        if (
          !!prizePoolId &&
          !!allFirstDrawOpenedAt[prizePoolId] &&
          !!allDrawPeriods[prizePoolId] &&
          !!allBalanceUpdates[chainId]
        ) {
          const drawIds = allDrawIds[prizePoolId]
          const firstDrawOpenedAt = allFirstDrawOpenedAt[prizePoolId]
          const drawPeriod = allDrawPeriods[prizePoolId]
          const drawCloseTimestamps = drawIds.map((id) => firstDrawOpenedAt + drawPeriod * id)

          const chainDraws: DrawWithTimestamps[] = []
          const chainDrawsByVault: { [vaultAddress: Address]: DrawWithTimestamps[] } = {}

          // Looping through every vault with balance updates
          for (const strVaultAddress in allBalanceUpdates[chainId]) {
            const vaultAddress = strVaultAddress as Address

            const balanceUpdates = [...allBalanceUpdates[chainId][vaultAddress]].reverse()
            const newObservationIndex = balanceUpdates.findIndex((obs) => obs.isNew)
            const slicedBalanceUpdates =
              newObservationIndex !== -1
                ? balanceUpdates.slice(0, newObservationIndex + 1)
                : balanceUpdates

            const vaultDraws = getVaultEligibleDraws(
              drawCloseTimestamps,
              slicedBalanceUpdates,
              drawPeriod
            )

            vaultDraws.forEach((draw) => {
              const existingDraw = chainDraws.findIndex((d) => d.id === draw.id)
              if (existingDraw === -1) {
                chainDraws.push(draw)
              }
            })

            chainDrawsByVault[vaultAddress] = vaultDraws
          }

          eligibleDraws[chainId] = chainDraws.sort((a, b) => a.id - b.id)
          eligibleDrawsByVault[chainId] = chainDrawsByVault
          totalNumEligibleDraws += chainDraws.length
        }
      }

      return { eligibleDraws, eligibleDrawsByVault, totalNumEligibleDraws }
    }
  }, [allDrawIds, allBalanceUpdates, isFetched])

  return { data, isFetched }
}

// TODO: this should take into account twab decay - users are still eligible a while after full withdrawal
const getVaultEligibleDraws = (
  drawCloseTimestamps: number[],
  balanceUpdates: SubgraphObservation[],
  drawPeriod: number
) => {
  const drawTimestampsToCheck: number[] = [...drawCloseTimestamps]
  const eligibleDraws: DrawWithTimestamps[] = []

  for (let balanceIndex = balanceUpdates.length - 1; balanceIndex >= 0; balanceIndex--) {
    const balanceUpdate = balanceUpdates[balanceIndex]
    for (let drawIndex = drawTimestampsToCheck.length - 1; drawIndex >= 0; drawIndex--) {
      const drawClosedAt = drawTimestampsToCheck[drawIndex]
      if (drawClosedAt >= balanceUpdate.timestamp) {
        if (balanceUpdate.delegateBalance > 0) {
          eligibleDraws.push({
            id: drawIndex + 1,
            openedAt: drawClosedAt - drawPeriod,
            closedAt: drawClosedAt,
            finalizedAt: drawClosedAt + drawPeriod
          })
        }
        drawTimestampsToCheck.pop()
      } else {
        break
      }
    }
  }

  return eligibleDraws.sort((a, b) => a.id - b.id)
}
