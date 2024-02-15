import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { vaultABI } from '@shared/utilities'
import { useEffect } from 'react'
import { Address, isAddress, TransactionReceipt } from 'viem'
import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'

/**
 * Prepares and submits a `mintYieldFee` transaction to a vault
 * @param amount the amount of vault fees to claim
 * @param vault the vault to claim fees from
 * @param options optional callbacks
 * @returns
 */
export const useSendClaimVaultFeesTransaction = (
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
  sendClaimVaultFeesTransaction?: () => void
} => {
  const { address: userAddress, chain } = useAccount()

  const enabled =
    !!amount && !!vault && !!userAddress && isAddress(userAddress) && chain?.id === vault.chainId

  const { data } = useSimulateContract({
    chainId: vault?.chainId,
    address: vault?.address,
    abi: vaultABI,
    functionName: 'mintYieldFee',
    args: [amount],
    query: { enabled }
  })

  const {
    data: txHash,
    isPending: isWaiting,
    isError: isSendingError,
    isSuccess: isSendingSuccess,
    writeContract: _sendClaimVaultFeesTransaction
  } = useWriteContract()

  const sendClaimVaultFeesTransaction =
    !!data && !!_sendClaimVaultFeesTransaction
      ? () => _sendClaimVaultFeesTransaction(data.request)
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
  } = useWaitForTransactionReceipt({ chainId: vault?.chainId, hash: txHash })

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
    sendClaimVaultFeesTransaction
  }
}
