import { Vaults } from '@generationsoftware/hyperstructure-client-js'
import {
  useAllVaultHistoricalSharePrices,
  useHistoricalTokenPrices,
  useTokens
} from '@generationsoftware/hyperstructure-react-hooks'
import { TokenWithSupply, VaultInfo } from '@shared/types'
import { getVaultId } from '@shared/utilities'
import { useMemo } from 'react'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'
import { useAreLiquidationPairTokenOutVaults } from './useAreLiquidationPairTokenOutVaults'
import { useLiquidationPairTokenOutAddresses } from './useLiquidationPairTokenOutAddresses'

export const useHistoricalLiquidationPairTokenOutPrices = (
  chainId: number,
  lpAddresses: Address[]
) => {
  const publicClient = usePublicClient({ chainId })

  const { data: tokenOutAddresses, isFetched: isFetchedTokenOutAddresses } =
    useLiquidationPairTokenOutAddresses(chainId, lpAddresses)

  const { data: shareTokens, isFetched: isFetchedShareTokens } = useTokens(
    chainId,
    !!tokenOutAddresses ? Object.values(tokenOutAddresses) : []
  )

  const { data: isValidVaults, isFetched: isFetchedIsValidVaults } =
    useAreLiquidationPairTokenOutVaults(chainId, lpAddresses)

  const vaults = useMemo(() => {
    const allValidVaultInfo: VaultInfo[] = []
    Object.entries(tokenOutAddresses).forEach(([lpAddress, tokenOutAddress]) => {
      const isValid = !!isValidVaults?.[lpAddress as Address]
      if (isValid) {
        allValidVaultInfo.push({ chainId, address: tokenOutAddress })
      }
    })
    return !!allValidVaultInfo.length
      ? new Vaults(allValidVaultInfo, { [chainId]: publicClient })
      : undefined
  }, [chainId, publicClient, tokenOutAddresses, isFetchedIsValidVaults, isValidVaults])
  const { data: shareTokensWithPriceHistory, isFetched: isFetchedShareTokensWithPriceHistory } =
    useAllVaultHistoricalSharePrices(chainId, vaults as Vaults)

  const { data: historicalTokenPrices, isFetched: isFetchedHistoricalTokenPrices } =
    useHistoricalTokenPrices(chainId, !!tokenOutAddresses ? Object.values(tokenOutAddresses) : [])

  const isFetched =
    isFetchedTokenOutAddresses &&
    isFetchedShareTokens &&
    (vaults === undefined || isFetchedShareTokensWithPriceHistory) &&
    isFetchedHistoricalTokenPrices

  const data = useMemo(() => {
    const results: {
      [lpAddress: Address]: TokenWithSupply & { priceHistory: { date: string; price: number }[] }
    } = {}

    if (!!tokenOutAddresses) {
      Object.entries(tokenOutAddresses).forEach(([lpAddress, tokenOutAddress]) => {
        const vaultId = getVaultId({ chainId, address: tokenOutAddress })
        const shareToken = shareTokens?.[tokenOutAddress]

        const shareTokenPrices = shareTokensWithPriceHistory?.[vaultId]
        const tokenPrices = historicalTokenPrices?.[tokenOutAddress.toLowerCase() as Address]

        if (!!shareTokenPrices?.priceHistory.length) {
          results[lpAddress as Address] = shareTokenPrices
        } else if (!!shareToken && !!tokenPrices?.length) {
          results[lpAddress as Address] = { ...shareToken, priceHistory: tokenPrices }
        }
      })
    }

    return results
  }, [chainId, tokenOutAddresses, shareTokens, shareTokensWithPriceHistory, historicalTokenPrices])

  return { data, isFetched }
}
