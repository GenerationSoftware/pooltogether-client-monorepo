import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useVaultShareData } from '@generationsoftware/hyperstructure-react-hooks'
import { TokenWithSupply } from '@shared/types'
import { useMemo } from 'react'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'
import { useLiquidationPairTokenOutAddress } from './useLiquidationPairTokenOutAddress'

export const useLiquidationPairTokenOutData = (
  chainId: number,
  lpAddress: Address
): { data?: TokenWithSupply; isFetched: boolean } => {
  const publicClient = usePublicClient({ chainId })

  const { data: tokenOutAddress, isFetched: isFetchedTokenOutAddress } =
    useLiquidationPairTokenOutAddress(chainId, lpAddress)

  const vault = useMemo(() => {
    if (tokenOutAddress) {
      return new Vault(chainId, tokenOutAddress, publicClient)
    }
  }, [chainId, publicClient, tokenOutAddress])

  const { data: shareToken, isFetched: isFetchedShareToken } = useVaultShareData(vault as Vault)

  const isFetched = isFetchedTokenOutAddress && isFetchedShareToken

  return { data: shareToken, isFetched }
}
