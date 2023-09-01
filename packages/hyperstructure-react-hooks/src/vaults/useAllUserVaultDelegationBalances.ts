import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useAllUserBalanceUpdates } from '..'

/**
 * Returns a user's delegated balance in each vault
 * @param prizePools array of instances of the `PrizePool` class
 * @param userAddress user address to get delegations for
 * @returns
 */
export const useAllUserVaultDelegationBalances = (prizePools: PrizePool[], userAddress: string) => {
  const { data: userBalanceUpdates, isFetched: isFetchedUserBalanceUpdates } =
    useAllUserBalanceUpdates(prizePools, userAddress)

  return useMemo(() => {
    if (isFetchedUserBalanceUpdates && !!userBalanceUpdates) {
      const data: { [chainId: number]: { [vaultAddress: Address]: bigint } } = {}

      for (const key in userBalanceUpdates) {
        const chainId = parseInt(key)
        const chainUpdates = userBalanceUpdates[chainId]

        for (const vaultAddress in chainUpdates) {
          const latestObservation = chainUpdates[vaultAddress as Address].find((obs) => obs.isNew)
          const delegatedAmount = !!latestObservation
            ? latestObservation.delegateBalance - latestObservation.balance
            : 0n

          if (delegatedAmount > 0n) {
            if (data[chainId] === undefined) {
              data[chainId] = {}
            }
            data[chainId][vaultAddress as Address] = delegatedAmount
          }
        }
      }

      return { data, isFetched: true }
    }

    return { isFetched: false }
  }, [isFetchedUserBalanceUpdates, userBalanceUpdates])
}
