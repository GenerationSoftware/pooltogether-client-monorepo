import { erc20 as erc20Abi, Vault } from '@pooltogether/hyperstructure-client-js'
import { useEffect } from 'react'
import { TransactionReceipt } from 'viem'
import { useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

/**
 * Prepares and submits an `approve` transaction for the underlying asset of a vault
 * @param amount the amount to be approved
 * @param vault the vault to approve spending to
 * @param options optional callbacks
 * @returns
 */
export const useSendApproveTransaction = (
  amount: bigint,
  vault: Vault,
  options?: { onSend?: () => void; onSuccess?: () => void; onError?: () => void }
): {
  isWaiting: boolean
  isConfirming: boolean
  isSuccess: boolean
  isError: boolean
  txHash?: `0x${string}`
  txReceipt?: TransactionReceipt
  sendApproveTransaction?: () => void
} => {
  const { chain } = useNetwork()

  const enabled = !!vault && chain?.id === vault.chainId && !!vault.tokenAddress

  const { config } = usePrepareContractWrite({
    chainId: vault?.chainId,
    address: vault?.tokenAddress,
    abi: erc20Abi,
    functionName: 'approve',
    args: [vault?.address, amount],
    enabled
  })

  const {
    data: txSendData,
    isLoading: isWaiting,
    isError: isSendingError,
    write
  } = useContractWrite(config)

  const sendApproveTransaction = !!write
    ? () => {
        write()
        options?.onSend?.()
      }
    : undefined

  const txHash = txSendData?.hash

  const {
    data: txReceipt,
    isLoading: isConfirming,
    isSuccess,
    isError: isConfirmingError
  } = useWaitForTransaction({ chainId: vault?.chainId, hash: txHash })

  const isError = isSendingError || isConfirmingError

  useEffect(() => {
    if (!!txReceipt && isSuccess) {
      options?.onSuccess?.()
    }
  }, [isSuccess])

  useEffect(() => {
    if (isError) {
      options?.onError?.()
    }
  }, [isError])

  return { isWaiting, isConfirming, isSuccess, isError, txHash, txReceipt, sendApproveTransaction }
}
