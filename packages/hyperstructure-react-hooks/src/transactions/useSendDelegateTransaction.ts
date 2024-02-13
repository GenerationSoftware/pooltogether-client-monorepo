import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { calculatePercentageOfBigInt, twabControllerABI } from '@shared/utilities'
import { useEffect } from 'react'
import { Address, isAddress, TransactionReceipt } from 'viem'
import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'
import { useGasAmountEstimate } from '..'

/**
 * Prepares and submits a `delegate` transaction to a TwabController
 * @param address the new address to delegate to
 * @param vault the vault to update delegation for
 * @param options optional callbacks
 * @returns
 */
export const useSendDelegateTransaction = (
  twabController: Address,
  address: Address | undefined,
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
  sendDelegateTransaction?: () => void
} => {
  const { address: userAddress, chain } = useAccount()

  const enabled =
    !!twabController &&
    !!address &&
    isAddress(address) &&
    !!vault &&
    !!userAddress &&
    isAddress(userAddress) &&
    chain?.id === vault.chainId

  const { data: gasEstimate } = useGasAmountEstimate(
    vault?.chainId,
    {
      address: twabController,
      abi: twabControllerABI,
      functionName: 'delegate',
      args: [vault.address as Address, address as Address],
      account: userAddress as Address
    },
    { enabled }
  )

  const { data } = useSimulateContract({
    chainId: vault?.chainId,
    address: twabController,
    abi: twabControllerABI,
    functionName: 'delegate',
    args: [vault.address as Address, address as Address],
    gas: !!gasEstimate ? calculatePercentageOfBigInt(gasEstimate, 1.2) : undefined,
    query: { enabled }
  })

  const {
    data: txHash,
    isLoading: isWaiting,
    isError: isSendingError,
    isSuccess: isSendingSuccess,
    writeContract: _sendDelegateTransaction
  } = useWriteContract()

  const sendDelegateTransaction =
    !!data && !!_sendDelegateTransaction ? () => _sendDelegateTransaction(data.request) : undefined

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

  return { isWaiting, isConfirming, isSuccess, isError, txHash, txReceipt, sendDelegateTransaction }
}
