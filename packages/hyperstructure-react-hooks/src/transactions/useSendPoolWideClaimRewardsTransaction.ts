import { POOL_WIDE_TWAB_REWARDS_ADDRESSES, poolWideTwabRewardsABI } from '@shared/utilities'
import { useEffect, useMemo } from 'react'
import { Address, encodeFunctionData, isAddress, TransactionReceipt } from 'viem'
import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'

/**
 * Prepares and submits a `claimRewards` or `multicall` transaction to a pool-wide TWAB rewards contract
 * @param chainId the chain ID these rewards are to be claimed on
 * @param userAddress the user address to claim rewards for
 * @param promotionsToClaim data on the promotions' epochs to claim
 * @param options optional settings or callbacks
 * @returns
 */
export const useSendPoolWideClaimRewardsTransaction = (
  chainId: number,
  userAddress: Address,
  promotionsToClaim: { id: string; vaultAddress: Address; epochs: number[] }[],
  options?: {
    onSend?: (txHash: `0x${string}`) => void
    onSuccess?: (txReceipt: TransactionReceipt) => void
    onError?: () => void
  }
): {
  isWaiting: boolean
  isConfirming: boolean
  isSuccess: boolean
  isError: boolean
  txHash?: Address
  txReceipt?: TransactionReceipt
  sendPoolWideClaimRewardsTransaction?: () => void
} => {
  const { chain } = useAccount()

  const enabled =
    !!chainId &&
    chainId === chain?.id &&
    !!userAddress &&
    isAddress(userAddress) &&
    !!promotionsToClaim &&
    promotionsToClaim.some((entry) => !!entry?.vaultAddress && !!entry.epochs?.length) &&
    !!POOL_WIDE_TWAB_REWARDS_ADDRESSES[chainId]

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

  const { data } = useSimulateContract({
    chainId,
    address: POOL_WIDE_TWAB_REWARDS_ADDRESSES[chainId],
    abi: poolWideTwabRewardsABI,
    functionName: 'claimRewards',
    args: claimRewardsArgs,
    query: { enabled }
  })

  const {
    data: _txHash,
    isPending: _isWaiting,
    isError: _isSendingError,
    isSuccess: _isSendingSuccess,
    writeContract: _sendPoolWideClaimRewardsTransaction
  } = useWriteContract()

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

  const { data: multicallData } = useSimulateContract({
    chainId,
    address: POOL_WIDE_TWAB_REWARDS_ADDRESSES[chainId],
    abi: poolWideTwabRewardsABI,
    functionName: 'multicall',
    args: multicallArgs,
    query: { enabled: enabled && isMulticall }
  })

  const {
    data: multicallTxHash,
    isPending: isWaitingMulticall,
    isError: isSendingMulticallError,
    isSuccess: isSendingMulticallSuccess,
    writeContract: sendMulticallTransaction
  } = useWriteContract()

  const txHash = isMulticall ? multicallTxHash : _txHash
  const isWaiting = isMulticall ? isWaitingMulticall : _isWaiting
  const isSendingError = isMulticall ? isSendingMulticallError : _isSendingError
  const sendPoolWideClaimRewardsTransaction = isMulticall
    ? !!multicallData && !!sendMulticallTransaction
      ? () => sendMulticallTransaction(multicallData.request)
      : undefined
    : !!data && !!_sendPoolWideClaimRewardsTransaction
    ? () => _sendPoolWideClaimRewardsTransaction(data.request)
    : undefined

  useEffect(() => {
    if (!!txHash && (_isSendingSuccess || isSendingMulticallSuccess)) {
      options?.onSend?.(txHash)
    }
  }, [_isSendingSuccess, isSendingMulticallSuccess])

  const {
    data: txReceipt,
    isFetching: isConfirming,
    isSuccess,
    isError: isConfirmingError
  } = useWaitForTransactionReceipt({ chainId, hash: txHash })

  useEffect(() => {
    if (!!txReceipt && isSuccess) {
      options?.onSuccess?.(txReceipt)
    }
  }, [isSuccess])

  const isError = isSendingError || isConfirmingError

  useEffect(() => {
    if (isError) {
      options?.onError?.()
    }
  }, [isError])

  return {
    isWaiting,
    isConfirming,
    isSuccess,
    isError,
    txHash,
    txReceipt,
    sendPoolWideClaimRewardsTransaction
  }
}
