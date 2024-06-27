import { Vaults } from '@generationsoftware/hyperstructure-client-js'
import {
  useAllVaultHistoricalSharePrices,
  useHistoricalTokenPrices,
  useTokens
} from '@generationsoftware/hyperstructure-react-hooks'
import { TokenWithSupply, VaultInfo } from '@shared/types'
import { getVaultId, lower } from '@shared/utilities'
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

  const { data: tokens, isFetched: isFetchedTokens } = useTokens(
    chainId,
    Object.values(tokenOutAddresses)
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

    return !!allValidVaultInfo.length && !!publicClient
      ? new Vaults(allValidVaultInfo, { [chainId]: publicClient })
      : undefined
  }, [chainId, publicClient, tokenOutAddresses, isFetchedIsValidVaults, isValidVaults])

  const { data: shareTokensWithPriceHistory, isFetched: isFetchedShareTokensWithPriceHistory } =
    useAllVaultHistoricalSharePrices(chainId, vaults!)

  const nonVaultTokenAddresses = useMemo(() => {
    const vaultAddresses =
      vaults?.vaultAddresses?.[chainId]?.map((address) => address.toLowerCase()) ?? []

    return Object.values(tokenOutAddresses).filter(
      (address) => !vaultAddresses.includes(address.toLowerCase())
    )
  }, [tokenOutAddresses, vaults])

  const { data: historicalTokenPrices, isFetched: isFetchedHistoricalTokenPrices } =
    useHistoricalTokenPrices(chainId, nonVaultTokenAddresses)

  const isFetched =
    isFetchedTokenOutAddresses &&
    isFetchedTokens &&
    (vaults === undefined || isFetchedShareTokensWithPriceHistory) &&
    (nonVaultTokenAddresses.length === 0 || isFetchedHistoricalTokenPrices)

  const data = useMemo(() => {
    const results: {
      [lpAddress: Address]: TokenWithSupply & { priceHistory: { date: string; price: number }[] }
    } = {}

    if (!!tokenOutAddresses) {
      Object.entries(tokenOutAddresses).forEach(([lpAddress, tokenOutAddress]) => {
        const vaultId = getVaultId({ chainId, address: tokenOutAddress })
        const shareTokenPrices = shareTokensWithPriceHistory?.[vaultId]

        const token = tokens?.[tokenOutAddress]
        const tokenPrices = historicalTokenPrices?.[lower(tokenOutAddress)]

        if (!!shareTokenPrices?.priceHistory.length) {
          results[lpAddress as Address] = shareTokenPrices
        } else if (!!token && !!tokenPrices?.length) {
          results[lpAddress as Address] = { ...token, priceHistory: tokenPrices }
        }
      })
    }

    return results
  }, [chainId, tokenOutAddresses, tokens, shareTokensWithPriceHistory, historicalTokenPrices])

  return { data, isFetched }
}
