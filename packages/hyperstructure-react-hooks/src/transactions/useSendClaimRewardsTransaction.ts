import { TWAB_REWARDS_ADDRESSES, twabRewardsABI } from '@shared/utilities'
import { useEffect, useMemo } from 'react'
import { Address, encodeFunctionData, isAddress, TransactionReceipt } from 'viem'
import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'

/**
 * Prepares and submits a `claimRewards` or `multicall` transaction to a TWAB rewards contract
 * @param chainId the chain ID these rewards are to be claimed on
 * @param userAddress the user address to claim rewards for
 * @param epochsToClaim the epochs to claim for each promotion ID
 * @param options optional settings or callbacks
 * @returns
 */
export const useSendClaimRewardsTransaction = (
  chainId: number,
  userAddress: Address,
  epochsToClaim: { [id: string]: number[] },
  options?: {
    twabRewardsAddress?: Address
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
  sendClaimRewardsTransaction?: () => void
} => {
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
    !!twabRewardsAddress

  const claimRewardsArgs = useMemo((): [Address, bigint, number[]] | undefined => {
    if (enabled) {
      const promotion = Object.entries(epochsToClaim).find((entry) => !!entry[1].length)

      if (!!promotion) {
        return [userAddress, BigInt(promotion[0]), promotion[1]]
      }
    }
  }, [userAddress, epochsToClaim])

  const { data } = useSimulateContract({
    chainId,
    address: twabRewardsAddress,
    abi: twabRewardsABI,
    functionName: 'claimRewards',
    args: claimRewardsArgs,
    query: { enabled }
  })

  const {
    data: _txHash,
    isPending: _isWaiting,
    isError: _isSendingError,
    isSuccess: _isSendingSuccess,
    writeContract: _sendClaimRewardsTransaction
  } = useWriteContract()

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

  const { data: multicallData } = useSimulateContract({
    chainId,
    address: twabRewardsAddress,
    abi: twabRewardsABI,
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
  const sendClaimRewardsTransaction = isMulticall
    ? !!multicallData && !!sendMulticallTransaction
      ? () => sendMulticallTransaction(multicallData.request)
      : undefined
    : !!data && !!_sendClaimRewardsTransaction
    ? () => _sendClaimRewardsTransaction(data.request)
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
    sendClaimRewardsTransaction
  }
}
