import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useAllVaultHistoricalTokenPrices,
  useAllVaultTokenData,
  useVaults
} from '@generationsoftware/hyperstructure-react-hooks'
import { TokenWithSupply } from '@shared/types'
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

  const { data: vaultTokens, isFetched: isFetchedVaultTokens } = useAllVaultTokenData(vaults)

  const { data: vaultHistoricalTokenPrices, isFetched: isFetchedVaultHistoricalTokenPrices } =
    useAllVaultHistoricalTokenPrices(prizePool.chainId, vaults)

  const validVaultAddresses = useMemo(() => {
    let validAddresses: Lowercase<Address>[] = []

    if (isFetchedVaultHistoricalTokenPrices) {
      const tokenAddressesWithPrices = Object.keys(vaultHistoricalTokenPrices).map((entry) =>
        lower(entry)
      )

      Object.entries(vaultTokens ?? {}).forEach(([vaultId, token]) => {
        if (tokenAddressesWithPrices.includes(lower(token.address))) {
          validAddresses.push(vaultId.split('-')[0] as Lowercase<Address>)
        }
      })
    }

    return validAddresses
  }, [prizePool, vaultTokens, vaultHistoricalTokenPrices, isFetchedVaultHistoricalTokenPrices])

  const validVaults = useVaults(
    validVaultAddresses?.map((address) => ({ chainId: prizePool.chainId, address })) ?? []
  )

  const vaultIds = useMemo(() => {
    return validVaults.allVaultInfo.map(getVaultId)
  }, [validVaults])

  const validVaultTokens = useMemo(() => {
    const tokens: { [vaultId: string]: TokenWithSupply } = {}

    if (!!vaultTokens) {
      vaultIds.forEach((vaultId) => {
        tokens[vaultId] = vaultTokens[vaultId]
      })
    }

    return tokens
  }, [vaultTokens, vaultIds])

  const validVaultHistoricalTokenPrices = useMemo(() => {
    const tokenPrices: { [address: Lowercase<Address>]: { date: string; price: number }[] } = {}

    if (!!vaultTokens) {
      vaultIds.forEach((vaultId) => {
        const tokenAddress = vaultTokens[vaultId]?.address

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
  }, [vaultTokens, vaultHistoricalTokenPrices, vaultIds])

  const isFetched =
    isFetchedVaultAddresses && isFetchedVaultTokens && isFetchedVaultHistoricalTokenPrices

  return {
    vaults: validVaults,
    vaultIds,
    vaultTokens: validVaultTokens,
    vaultHistoricalTokenPrices: validVaultHistoricalTokenPrices,
    isFetched
  }
}
