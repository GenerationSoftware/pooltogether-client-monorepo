import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useTokenPrices,
  useVaultShareData,
  useVaultSharePrice
} from '@generationsoftware/hyperstructure-react-hooks'
import { TokenWithPrice } from '@shared/types'
import { useMemo } from 'react'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'
import { useLiquidationPairTokenOutAddress } from './useLiquidationPairTokenOutAddress'

export const useLiquidationPairTokenOutPrice = (
  chainId: number,
  lpAddress: Address
): { data?: TokenWithPrice; isFetched: boolean } => {
  const publicClient = usePublicClient({ chainId })

  const { data: tokenOutAddress, isFetched: isFetchedTokenOutAddress } =
    useLiquidationPairTokenOutAddress(chainId, lpAddress)

  const vault = useMemo(() => {
    if (tokenOutAddress) {
      return new Vault(chainId, tokenOutAddress, publicClient)
    }
  }, [chainId, publicClient, tokenOutAddress])

  const { data: shareToken, isFetched: isFetchedShareToken } = useVaultShareData(vault as Vault)

  // TODO: this isn't a perfect solution - vault boosters will error since their tokenOut isn't a vault
  const { data: shareTokenWithPrice } = useVaultSharePrice(vault as Vault)

  const { data: tokenPrices, isFetched: isFetchedTokenPrices } = useTokenPrices(
    chainId,
    !!tokenOutAddress ? [tokenOutAddress] : []
  )

  const isFetched = isFetchedTokenOutAddress && isFetchedShareToken && isFetchedTokenPrices

  if (!!shareToken) {
    if (!!shareTokenWithPrice?.price) {
      return { data: shareTokenWithPrice, isFetched }
    } else if (!!tokenPrices && !!tokenOutAddress) {
      return {
        data: { ...shareToken, price: tokenPrices[tokenOutAddress.toLowerCase() as Address] },
        isFetched
      }
    }
  }

  return { isFetched }
}
