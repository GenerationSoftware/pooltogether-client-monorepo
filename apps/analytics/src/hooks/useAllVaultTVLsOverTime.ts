import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useAllVaultExchangeRates,
  useAllVaultHistoricalTokenPrices,
  useAllVaultTokenAddresses,
  useAllVaultTokenData,
  useVaults
} from '@generationsoftware/hyperstructure-react-hooks'
import { lower } from '@shared/utilities'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useAllVaultSupplyTwabsOverTime } from '@hooks/useAllVaultSupplyTwabsOverTime'
import { useDeployedVaultAddresses } from '@hooks/useDeployedVaultAddresses'

export const useAllVaultTVLsOverTime = (prizePool: PrizePool) => {
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

  const { data: vaultSupplyTwabs, isFetched: isFetchedVaultSupplyTwabs } =
    useAllVaultSupplyTwabsOverTime(prizePool, validVaultAddresses)

  const { data: vaultTokens, isFetched: isFetchedVaultTokens } = useAllVaultTokenData(validVaults)

  const { data: vaultExchangeRates, isFetched: isFetchedVaultExchangeRates } =
    useAllVaultExchangeRates(validVaults)

  const isFetched =
    isFetchedVaultAddresses &&
    isFetchedVaultTokenAddresses &&
    isFetchedVaultHistoricalTokenPrices &&
    isFetchedVaultSupplyTwabs &&
    isFetchedVaultTokens &&
    isFetchedVaultExchangeRates

  const data = useMemo(() => {
    if (isFetched) {
      // TODO: calculate tvl of each vault (use current exchange rate)
    }
  }, [vaultSupplyTwabs, vaultTokens, vaultExchangeRates, isFetched])

  return { data, isFetched }
}
