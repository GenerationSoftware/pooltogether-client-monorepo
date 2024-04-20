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

  // TODO: this assumes `grandPrizePeriodDraws` is always 91 - not ideal
  const grandPrizePeriodDraws = 91

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

            const vaultDraws = getVaultEligibleDraws(
              drawCloseTimestamps,
              balanceUpdates,
              drawPeriod,
              grandPrizePeriodDraws
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

const getVaultEligibleDraws = (
  drawCloseTimestamps: number[],
  balanceUpdates: SubgraphObservation[],
  drawPeriod: number,
  grandPrizePeriodDraws: number
) => {
  const eligibleDrawIds = new Set<number>()
  const eligibleDraws: DrawWithTimestamps[] = []

  const addDraw = (drawId: number) => {
    const drawClosedAt = drawCloseTimestamps[drawId - 1]

    eligibleDrawIds.add(drawId)

    eligibleDraws.push({
      id: drawId,
      openedAt: drawClosedAt - drawPeriod,
      closedAt: drawClosedAt,
      finalizedAt: drawClosedAt + drawPeriod
    })
  }

  balanceUpdates.forEach((balanceUpdate, balanceUpdateIndex) => {
    const eligibleUntil = balanceUpdate.timestamp + grandPrizePeriodDraws * drawPeriod

    drawCloseTimestamps.forEach((drawClosedAt, drawIndex) => {
      const drawId = drawIndex + 1

      if (!eligibleDrawIds.has(drawId)) {
        const drawOpenedAt = drawClosedAt - drawPeriod

        if (drawClosedAt > balanceUpdate.timestamp && drawOpenedAt < eligibleUntil) {
          addDraw(drawId)
        } else if (drawOpenedAt >= eligibleUntil && balanceUpdate.delegateBalance > 0n) {
          const nextBalanceUpdate = balanceUpdates[balanceUpdateIndex + 1]
          if (!nextBalanceUpdate || nextBalanceUpdate.timestamp > drawOpenedAt) {
            addDraw(drawId)
          }
        }
      }
    })
  })

  return eligibleDraws
}
