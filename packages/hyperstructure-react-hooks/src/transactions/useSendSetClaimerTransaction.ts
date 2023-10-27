import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { vaultABI } from '@shared/utilities'
import { useEffect } from 'react'
import { Address, TransactionReceipt } from 'viem'
import { useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

/**
 * Prepares and submits a `setClaimer` transaction to a vault
 * @param address the address of the claimer contract
 * @param vault the vault to set the claimer to
 * @param options optional callbacks
 * @returns
 */
export const useSendSetClaimerTransaction = (
  address: Address,
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
  sendSetClaimerTransaction?: () => void
} => {
  const { chain } = useNetwork()

  const enabled = !!address && !!vault && chain?.id === vault.chainId

  const { config } = usePrepareContractWrite({
    chainId: vault?.chainId,
    address: vault?.address,
    abi: vaultABI,
    functionName: 'setClaimer',
    args: [address],
    enabled
  })

  const {
    data: txSendData,
    isLoading: isWaiting,
    isError: isSendingError,
    isSuccess: isSendingSuccess,
    write: sendSetClaimerTransaction
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

  return {
    isWaiting,
    isConfirming,
    isSuccess,
    isError,
    txHash,
    txReceipt,
    sendSetClaimerTransaction
  }
}
