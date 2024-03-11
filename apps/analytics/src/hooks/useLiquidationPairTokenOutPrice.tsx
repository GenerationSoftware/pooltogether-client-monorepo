import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useToken,
  useTokenPrices,
  useVaultSharePrice
} from '@generationsoftware/hyperstructure-react-hooks'
import { TokenWithPrice } from '@shared/types'
import { useMemo } from 'react'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'
import { useIsLiquidationPairTokenOutAVault } from './useIsLiquidationPairTokenOutAVault'
import { useLiquidationPairTokenOutAddress } from './useLiquidationPairTokenOutAddresses'

export const useLiquidationPairTokenOutPrice = (
  chainId: number,
  lpAddress: Address
): { data?: TokenWithPrice; isFetched: boolean } => {
  const publicClient = usePublicClient({ chainId })

  const { data: tokenOutAddress, isFetched: isFetchedTokenOutAddress } =
    useLiquidationPairTokenOutAddress(chainId, lpAddress)

  const { data: token, isFetched: isFetchedToken } = useToken(chainId, tokenOutAddress as Address)

  const { data: isValidVault, isFetched: isFetchedIsValidVault } =
    useIsLiquidationPairTokenOutAVault(chainId, lpAddress)

  const vault = useMemo(() => {
    if (!!tokenOutAddress && isFetchedIsValidVault && isValidVault && !!publicClient) {
      return new Vault(chainId, tokenOutAddress, publicClient)
    }
  }, [chainId, publicClient, tokenOutAddress, isFetchedIsValidVault, isValidVault])
  const { data: shareTokenWithPrice } = useVaultSharePrice(vault as Vault)

  const { data: tokenPrices, isFetched: isFetchedTokenPrices } = useTokenPrices(
    chainId,
    !!tokenOutAddress ? [tokenOutAddress] : []
  )

  const isFetched = isFetchedTokenOutAddress && isFetchedToken && isFetchedTokenPrices

  if (!!token) {
    if (!!shareTokenWithPrice?.price) {
      return { data: shareTokenWithPrice, isFetched }
    } else if (!!tokenPrices && !!tokenOutAddress) {
      return {
        data: { ...token, price: tokenPrices[tokenOutAddress.toLowerCase() as Address] },
        isFetched
      }
    }
  }

  return { isFetched }
}
