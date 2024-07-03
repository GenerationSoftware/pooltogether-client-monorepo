import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useAllVaultHistoricalTokenPrices,
  useAllVaultTokenAddresses,
  useVaults
} from '@generationsoftware/hyperstructure-react-hooks'
import { getVaultId, lower } from '@shared/utilities'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useDeployedVaultAddresses } from '@hooks/useDeployedVaultAddresses'

export const useAllVaultsWithHistoricalPrices = (prizePool: PrizePool) => {
  const { data: vaultAddresses, isFetched: isFetchedVaultAddresses } =
    useDeployedVaultAddresses(prizePool)

  const vaults = useVaults(
    vaultAddresses?.map((address) => ({ chainId: prizePool.chainId, address })) ?? []
  )

  const { data: vaultTokenAddresses, isFetched: isFetchedVaultTokenAddresses } =
    useAllVaultTokenAddresses(vaults)

  const { data: vaultHistoricalTokenPrices, isFetched: isFetchedVaultHistoricalTokenPrices } =
    useAllVaultHistoricalTokenPrices(prizePool.chainId, vaults)

  const validVaultAddresses = useMemo(() => {
    let validAddresses: Lowercase<Address>[] = []

    if (isFetchedVaultHistoricalTokenPrices) {
      const tokenAddressesWithPrices = Object.keys(vaultHistoricalTokenPrices).map((entry) =>
        lower(entry)
      )

      Object.entries(vaultTokenAddresses?.byVault ?? {}).forEach(([vaultId, tokenAddress]) => {
        if (tokenAddressesWithPrices.includes(lower(tokenAddress))) {
          validAddresses.push(vaultId.split('-')[0] as Lowercase<Address>)
        }
      })
    }

    return validAddresses
  }, [
    prizePool,
    vaultTokenAddresses,
    vaultHistoricalTokenPrices,
    isFetchedVaultHistoricalTokenPrices
  ])

  const validVaults = useVaults(
    validVaultAddresses?.map((address) => ({ chainId: prizePool.chainId, address })) ?? []
  )

  const vaultIds = useMemo(() => {
    return validVaults.allVaultInfo.map(getVaultId)
  }, [validVaults])

  const validVaultTokenAddresses = useMemo(() => {
    const tokenAddresses = new Set<Address>()

    if (!!vaultTokenAddresses) {
      vaultIds.forEach((vaultId) => {
        const tokenAddress = vaultTokenAddresses.byVault[vaultId]

        if (!!tokenAddress) {
          tokenAddresses.add(tokenAddress)
        }
      })
    }

    return [...tokenAddresses]
  }, [vaultTokenAddresses, vaultIds])

  const validVaultHistoricalTokenPrices = useMemo(() => {
    const tokenPrices: { [address: Lowercase<Address>]: { date: string; price: number }[] } = {}

    if (!!vaultTokenAddresses) {
      vaultIds.forEach((vaultId) => {
        const tokenAddress = vaultTokenAddresses.byVault[vaultId]

        if (!!tokenAddress) {
          const prices = Object.entries(vaultHistoricalTokenPrices).find(
            (entry) => lower(entry[0]) === lower(tokenAddress)
          )?.[1]

          if (!!prices?.length) {
            tokenPrices[lower(tokenAddress)] = prices
          }
        }
      })
    }

    return tokenPrices
  }, [vaultTokenAddresses, vaultHistoricalTokenPrices, vaultIds])

  const isFetched =
    isFetchedVaultAddresses && isFetchedVaultTokenAddresses && isFetchedVaultHistoricalTokenPrices

  return {
    vaults: validVaults,
    vaultIds,
    vaultTokenAddresses: validVaultTokenAddresses,
    vaultHistoricalTokenPrices: validVaultHistoricalTokenPrices,
    isFetched
  }
}
