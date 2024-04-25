import { useGasCostEstimates } from '@generationsoftware/hyperstructure-react-hooks'
import { GasCostEstimates } from '@shared/types'
import { sToMs } from '@shared/utilities'
import { Address } from 'viem'
import { v3FaucetABI } from '@constants/v3FaucetABI'
import { useUserV3ClaimableRewards } from './useUserV3ClaimableRewards'

export const useV3ClaimRewardsGasEstimate = (
  chainId: number,
  ticketAddress: Lowercase<Address>,
  userAddress: Address
): { data?: GasCostEstimates; isFetched: boolean } => {
  const { data: claimable, isFetched: isFetchedClaimable } = useUserV3ClaimableRewards(
    chainId,
    ticketAddress,
    userAddress
  )

  const { data: gasEstimates, isFetched: isFetchedGasEstimates } = useGasCostEstimates(
    chainId,
    {
      address: claimable?.rewards.address as Address,
      abi: v3FaucetABI,
      functionName: 'claim',
      args: [userAddress],
      account: userAddress
    },
    { refetchInterval: sToMs(10) }
  )

  const isFetched = isFetchedClaimable && isFetchedGasEstimates

  return { data: gasEstimates, isFetched }
}
