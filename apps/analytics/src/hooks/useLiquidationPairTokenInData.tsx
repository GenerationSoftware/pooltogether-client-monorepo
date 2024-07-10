import { useToken } from '@generationsoftware/hyperstructure-react-hooks'
import { TokenWithSupply } from '@shared/types'
import { Address } from 'viem'
import { useLiquidationPairTokenInAddress } from './useLiquidationPairTokenInAddresses'

export const useLiquidationPairTokenInData = (
  chainId: number,
  lpAddress: Address
): { data?: TokenWithSupply; isFetched: boolean } => {
  const { data: tokenInAddress, isFetched: isFetchedTokenInAddress } =
    useLiquidationPairTokenInAddress(chainId, lpAddress)

  const { data: token, isFetched: isFetchedToken } = useToken(chainId, tokenInAddress!)

  const isFetched = isFetchedTokenInAddress && isFetchedToken

  return { data: token, isFetched }
}
