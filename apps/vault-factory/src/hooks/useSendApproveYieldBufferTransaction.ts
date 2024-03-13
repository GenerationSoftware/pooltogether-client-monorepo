import { erc20ABI } from '@shared/utilities'
import { useEffect } from 'react'
import { Address, TransactionReceipt } from 'viem'
import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'
import { useVaultInfo } from './useVaultInfo'

/**
 * Prepares and submits an `approve` transaction for the initial yield buffer amount to the vault factory contract
 * @param options optional callbacks
 * @returns
 */
export const useSendApproveYieldBufferTransaction = (options?: {
  onSend?: (txHash: `0x${string}`) => void
  onSuccess?: (txReceipt: TransactionReceipt) => void
  onError?: () => void
}): {
  isWaiting: boolean
  isConfirming: boolean
  isSuccess: boolean
  isError: boolean
  txHash?: Address
  txReceipt?: TransactionReceipt
  sendApproveYieldBufferTransaction?: () => void
} => {
  const { chain } = useAccount()

  const { chainId, tokenAddress, vaultFactory, yieldBuffer } = useVaultInfo()

  const enabled =
    !!chainId && chain?.id === chainId && !!tokenAddress && !!vaultFactory && !!yieldBuffer

  const { data } = useSimulateContract({
    chainId,
    address: tokenAddress,
    abi: erc20ABI,
    functionName: 'approve',
    args: [vaultFactory as Address, yieldBuffer as bigint],
    query: { enabled }
  })

  const {
    data: txHash,
    isPending: isWaiting,
    isError: isSendingError,
    isSuccess: isSendingSuccess,
    writeContract: _sendApproveYieldBufferTransaction
  } = useWriteContract()

  const sendApproveYieldBufferTransaction =
    !!data && !!_sendApproveYieldBufferTransaction
      ? () => _sendApproveYieldBufferTransaction(data.request)
      : undefined

  useEffect(() => {
    if (!!txHash && isSendingSuccess) {
      options?.onSend?.(txHash)
    }
  }, [isSendingSuccess])

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
    sendApproveYieldBufferTransaction
  }
}
