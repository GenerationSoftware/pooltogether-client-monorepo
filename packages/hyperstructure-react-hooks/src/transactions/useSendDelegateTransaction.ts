import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { calculatePercentageOfBigInt, twabControllerABI, vaultABI } from '@shared/utilities'
import { useEffect } from 'react'
import { Address, isAddress, TransactionReceipt } from 'viem'
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction
} from 'wagmi'
import { useGasAmountEstimate, useUserVaultShareBalance } from '..'

/**
 * Prepares and submits a `delegate` transaction to a TwabController
 * @param address the new address to delegate to
 * @param vault the vault to update delegation for
 * @param options optional callbacks
 * @returns
 */
export const useSendDelegateTransaction = (
  twabController: Address,
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
  sendDelegateTransaction?: () => void
} => {
  const { address: userAddress } = useAccount()
  const { chain } = useNetwork()

  const enabled =
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
      args: [address as Address, vault.id as Address],
      account: userAddress as Address
    },
    { enabled }
  )

  const { config } = usePrepareContractWrite({
    chainId: vault?.chainId,
    address: twabController,
    abi: twabControllerABI,
    functionName: 'delegate',
    args: [address as Address, vault.id as Address],
    gas: !!gasEstimate ? calculatePercentageOfBigInt(gasEstimate, 1.2) : undefined,
    enabled
  })

  const {
    data: txSendData,
    isLoading: isWaiting,
    isError: isSendingError,
    isSuccess: isSendingSuccess,
    write: sendDelegateTransaction
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

  return { isWaiting, isConfirming, isSuccess, isError, txHash, txReceipt, sendDelegateTransaction }
}
