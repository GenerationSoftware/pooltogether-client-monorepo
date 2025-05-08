import { POOL_WIDE_TWAB_REWARDS_ADDRESSES, poolWideTwabRewardsABI } from '@shared/utilities'
import { useMemo } from 'react'
import { Address, encodeFunctionData, Hash, isAddress, WalletCallReceipt } from 'viem'
import { useAccount } from 'wagmi'
import { useSend5792Calls } from './useSend5792Calls'

/**
 * Prepares and submits [EIP-5792](https://eips.ethereum.org/EIPS/eip-5792) calls to claim pool-wide TWAB rewards
 * @dev should check if wallet supports this standard before calling this (`useCapabilities` wagmi hook)
 * @param chainId the chain ID these pool-wide rewards are to be claimed on
 * @param userAddress the user address to claim pool-wide rewards for
 * @param promotionsToClaim data on the promotions' epochs to claim
 * @param options optional settings and callbacks
 * @returns
 */
export const useSend5792PoolWideClaimRewardsTransaction = (
  chainId: number,
  userAddress: Address,
  promotionsToClaim: { id: string; vaultAddress: Address; epochs: number[] }[],
  options?: Parameters<typeof useSend5792Calls>['2']
) => {
  const { chain } = useAccount()

  const enabled =
    !!chainId &&
    chainId === chain?.id &&
    !!userAddress &&
    isAddress(userAddress) &&
    !!promotionsToClaim &&
    promotionsToClaim.some((entry) => !!entry?.vaultAddress && !!entry.epochs?.length) &&
    !!POOL_WIDE_TWAB_REWARDS_ADDRESSES[chainId] &&
    options?.enabled !== false

  const claimRewardsArgs = useMemo((): [Address, Address, bigint, number[]] | undefined => {
    if (enabled) {
      const promotion = promotionsToClaim.find(
        (entry) => !!entry.vaultAddress && !!entry.epochs.length
      )

      if (!!promotion) {
        return [promotion.vaultAddress, userAddress, BigInt(promotion.id), promotion.epochs]
      }
    }
  }, [userAddress, promotionsToClaim])

  const { sendCalls: _sendPoolWideClaimRewardsTransaction, ...restPoolWideClaimRewards } =
    useSend5792Calls(
      chainId,
      !!claimRewardsArgs
        ? [
            {
              to: POOL_WIDE_TWAB_REWARDS_ADDRESSES[chainId],
              data: encodeFunctionData({
                abi: poolWideTwabRewardsABI,
                functionName: 'claimRewards',
                args: claimRewardsArgs
              })
            }
          ]
        : [],
      { ...options, enabled }
    )

  const isMulticall = useMemo(() => {
    const numValidPromotions = promotionsToClaim.filter(
      (entry) => !!entry.vaultAddress && !!entry.epochs?.length
    ).length
    return numValidPromotions > 1
  }, [promotionsToClaim])

  const multicallArgs = useMemo((): [`0x${string}`[]] | undefined => {
    if (enabled && isMulticall) {
      const validPromotions = promotionsToClaim.filter(
        (entry) => !!entry.vaultAddress && !!entry.epochs?.length
      )

      const args = validPromotions.map((promotion) => {
        const callData = encodeFunctionData({
          abi: poolWideTwabRewardsABI,
          args: [promotion.vaultAddress, userAddress, BigInt(promotion.id), promotion.epochs],
          functionName: 'claimRewards'
        })
        return callData
      })

      return [args]
    }
  }, [userAddress, promotionsToClaim])

  const { sendCalls: _sendMulticallTransaction, ...restMulticall } = useSend5792Calls(
    chainId,
    !!multicallArgs
      ? [
          {
            to: POOL_WIDE_TWAB_REWARDS_ADDRESSES[chainId],
            data: encodeFunctionData({
              abi: poolWideTwabRewardsABI,
              functionName: 'multicall',
              args: multicallArgs
            })
          }
        ]
      : [],
    { ...options, enabled: enabled && isMulticall }
  )

  const rest = isMulticall ? restMulticall : restPoolWideClaimRewards
  const send5792PoolWideClaimRewardsTransaction = isMulticall
    ? () => _sendMulticallTransaction
    : () => _sendPoolWideClaimRewardsTransaction

  return { ...rest, send5792PoolWideClaimRewardsTransaction }
}
