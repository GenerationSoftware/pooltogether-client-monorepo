import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { erc20ABI } from '@shared/utilities'
import { useEffect } from 'react'
import { Address, TransactionReceipt } from 'viem'
import { useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { useVaultTokenAddress } from '..'

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
  sendApproveTransaction?: () => void
} => {
  const { chain } = useNetwork()

  const { data: tokenAddress, isFetched: isFetchedTokenAddress } = useVaultTokenAddress(vault)

  const enabled = !!vault && chain?.id === vault.chainId && isFetchedTokenAddress && !!tokenAddress

  const { config } = usePrepareContractWrite({
    chainId: vault?.chainId,
    address: tokenAddress,
    abi: erc20ABI,
    functionName: 'approve',
    args: [vault?.address, amount],
    enabled
  })

  const {
    data: txSendData,
    isLoading: isWaiting,
    isError: isSendingError,
    isSuccess: isSendingSuccess,
    write: sendApproveTransaction
  } = useContractWrite(config)

  const txHash = txSendData?.hash

  useEffect(() => {
    if (!!txHash && isSendingSuccess) {
      options?.onSend?.(txHash)
    }
  }, [isSendingSuccess])

  const {
    data: txReceipt,
    isLoading: isConfirming,
    isSuccess,
    isError: isConfirmingError
  } = useWaitForTransaction({ chainId: vault?.chainId, hash: txHash })

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

  return { isWaiting, isConfirming, isSuccess, isError, txHash, txReceipt, sendApproveTransaction }
}
