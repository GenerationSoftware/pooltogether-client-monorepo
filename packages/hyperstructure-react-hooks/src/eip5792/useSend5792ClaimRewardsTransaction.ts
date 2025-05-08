import { TWAB_REWARDS_ADDRESSES, twabRewardsABI } from '@shared/utilities'
import { useMemo } from 'react'
import { Address, encodeFunctionData, Hash, isAddress, WalletCallReceipt } from 'viem'
import { useAccount } from 'wagmi'
import { useSend5792Calls } from './useSend5792Calls'

/**
 * Prepares and submits [EIP-5792](https://eips.ethereum.org/EIPS/eip-5792) calls to claim TWAB rewards
 * @dev should check if wallet supports this standard before calling this (`useCapabilities` wagmi hook)
 * @param chainId the chain ID these rewards are to be claimed on
 * @param userAddress the user address to claim rewards for
 * @param epochsToClaim the epochs to claim for each promotion ID
 * @param options optional settings and callbacks
 * @returns
 */
export const useSend5792ClaimRewardsTransaction = (
  chainId: number,
  userAddress: Address,
  epochsToClaim: { [id: string]: number[] },
  options?: { twabRewardsAddress?: Address } & Parameters<typeof useSend5792Calls>['2']
) => {
  const { chain } = useAccount()

  const twabRewardsAddress = !!chainId
    ? options?.twabRewardsAddress ?? TWAB_REWARDS_ADDRESSES[chainId]
    : undefined

  const enabled =
    !!chainId &&
    chainId === chain?.id &&
    !!userAddress &&
    isAddress(userAddress) &&
    !!epochsToClaim &&
    Object.values(epochsToClaim).some((entry) => !!entry?.length) &&
    !!twabRewardsAddress &&
    options?.enabled !== false

  const claimRewardsArgs = useMemo((): [Address, bigint, number[]] | undefined => {
    if (enabled) {
      const promotion = Object.entries(epochsToClaim).find((entry) => !!entry[1].length)

      if (!!promotion) {
        return [userAddress, BigInt(promotion[0]), promotion[1]]
      }
    }
  }, [userAddress, epochsToClaim])

  const { sendCalls: _sendClaimRewardsTransaction, ...restClaimRewards } = useSend5792Calls(
    chainId,
    !!claimRewardsArgs
      ? [
          {
            to: twabRewardsAddress!,
            data: encodeFunctionData({
              abi: twabRewardsABI,
              functionName: 'claimRewards',
              args: claimRewardsArgs
            })
          }
        ]
      : [],
    { ...options, enabled }
  )

  const isMulticall = useMemo(() => {
    const numValidPromotions = Object.values(epochsToClaim).filter(
      (epochs) => !!epochs.length
    ).length
    return numValidPromotions > 1
  }, [epochsToClaim])

  const multicallArgs = useMemo((): [`0x${string}`[]] | undefined => {
    if (enabled && isMulticall) {
      const validPromotions = Object.entries(epochsToClaim).filter((entry) => !!entry[1].length)

      const args = validPromotions.map((promotion) => {
        const callData = encodeFunctionData({
          abi: twabRewardsABI,
          args: [userAddress, BigInt(promotion[0]), promotion[1]],
          functionName: 'claimRewards'
        })
        return callData
      })

      return [args]
    }
  }, [userAddress, epochsToClaim])

  const { sendCalls: _sendMulticallTransaction, ...restMulticall } = useSend5792Calls(
    chainId,
    !!multicallArgs
      ? [
          {
            to: twabRewardsAddress!,
            data: encodeFunctionData({
              abi: twabRewardsABI,
              functionName: 'multicall',
              args: multicallArgs
            })
          }
        ]
      : [],
    { ...options, enabled: enabled && isMulticall }
  )

  const rest = isMulticall ? restMulticall : restClaimRewards
  const send5792ClaimRewardsTransaction = isMulticall
    ? () => _sendMulticallTransaction
    : () => _sendClaimRewardsTransaction

  return { ...rest, send5792ClaimRewardsTransaction }
}
