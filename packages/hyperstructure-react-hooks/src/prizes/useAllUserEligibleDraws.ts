import { PrizePool } from '@pooltogether/hyperstructure-client-js'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useAllPrizeDrawTimestamps, useAllUserBalanceUpdates } from '..'

interface Draw {
  id: number
  timestamp: number
}

interface BalanceUpdate {
  balance: bigint
  delegateBalance: bigint
  timestamp: number
}

/**
 * Returns all draws a user was eligible for
 * @param prizePools instances of `PrizePool`
 * @param userAddress a user's address to check for eligibility
 * @returns
 */
export const useAllUserEligibleDraws = (prizePools: PrizePool[], userAddress: string) => {
  const { data: drawTimestamps, isFetched: isFetchedDrawTimestamps } =
    useAllPrizeDrawTimestamps(prizePools)

  const { data: balanceUpdates, isFetched: isFetchedBalanceUpdates } = useAllUserBalanceUpdates(
    prizePools,
    userAddress
  )

  const isFetched = isFetchedDrawTimestamps && isFetchedBalanceUpdates

  const data = useMemo(() => {
    if (!!drawTimestamps && !!balanceUpdates) {
      const eligibleDraws: { [chainId: number]: Draw[] } = {}
      const eligibleDrawsByVault: { [chainId: number]: { [vaultAddress: Address]: Draw[] } } = {}
      let totalNumEligibleDraws = 0

      // Looping through every chain with balance updates
      for (const chainId in balanceUpdates) {
        const chainDraws: Draw[] = []
        const chainDrawsByVault: { [vaultAddress: Address]: Draw[] } = {}

        // Looping through every vault with balance updates
        if (!!drawTimestamps[chainId] && !!balanceUpdates[chainId]) {
          for (const strVaultAddress in balanceUpdates[chainId]) {
            const vaultAddress = strVaultAddress as Address
            const vaultDraws = getVaultEligibleDraws(
              drawTimestamps[chainId],
              balanceUpdates[chainId][vaultAddress]
            )
            vaultDraws.forEach((draw) => {
              const existingDraw = chainDraws.findIndex((d) => d.id === draw.id)
              if (existingDraw === -1) {
                chainDraws.push(draw)
              }
            })
            chainDrawsByVault[vaultAddress] = vaultDraws
          }
        }

        eligibleDraws[parseInt(chainId)] = chainDraws.sort((a, b) => a.timestamp - b.timestamp)
        eligibleDrawsByVault[parseInt(chainId)] = chainDrawsByVault
        totalNumEligibleDraws += chainDraws.length
      }

      return { eligibleDraws, eligibleDrawsByVault, totalNumEligibleDraws }
    }
  }, [drawTimestamps, balanceUpdates])

  return { data, isFetched }
}

const getVaultEligibleDraws = (draws: Draw[], balanceUpdates: BalanceUpdate[]): Draw[] => {
  const drawsToCheck: Draw[] = [...draws]
  const eligibleDraws: Draw[] = []

  for (let balanceIndex = balanceUpdates.length - 1; balanceIndex >= 0; balanceIndex--) {
    const balanceUpdate = balanceUpdates[balanceIndex]
    for (let drawIndex = drawsToCheck.length - 1; drawIndex >= 0; drawIndex--) {
      const draw = drawsToCheck[drawIndex]
      if (draw.timestamp >= balanceUpdate.timestamp) {
        if (balanceUpdate.balance > 0 || balanceUpdate.delegateBalance > 0) {
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
