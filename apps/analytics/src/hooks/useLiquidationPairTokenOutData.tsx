import { useToken } from '@generationsoftware/hyperstructure-react-hooks'
import { TokenWithSupply } from '@shared/types'
import { Address } from 'viem'
import { useLiquidationPairTokenOutAddress } from './useLiquidationPairTokenOutAddresses'

export const useLiquidationPairTokenOutData = (
  chainId: number,
  lpAddress: Address
): { data?: TokenWithSupply; isFetched: boolean } => {
  const { data: tokenOutAddress, isFetched: isFetchedTokenOutAddress } =
    useLiquidationPairTokenOutAddress(chainId, lpAddress)

  const { data: token, isFetched: isFetchedToken } = useToken(chainId, tokenOutAddress as Address)

  const isFetched = isFetchedTokenOutAddress && isFetchedToken

  return { data: token, isFetched }
}
