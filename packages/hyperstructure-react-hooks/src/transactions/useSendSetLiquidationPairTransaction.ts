import { Vault, vaultABI } from '@pooltogether/hyperstructure-client-js'
import { useEffect } from 'react'
import { Address, TransactionReceipt } from 'viem'
import { useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

/**
 * Prepares and submits a `setLiquidationPair` transaction to a vault
 * @param address the address of the liquidation pair contract
 * @param vault the vault to set the liquidation pair to
 * @param options optional callbacks
 * @returns
 */
export const useSendSetLiquidationPairTransaction = (
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
  sendSetLiquidationPairTransaction?: () => void
} => {
  const { chain } = useNetwork()

  const enabled = !!address && !!vault && chain?.id === vault.chainId

  const { config } = usePrepareContractWrite({
    chainId: vault?.chainId,
    address: vault?.address,
    abi: vaultABI,
    functionName: 'setLiquidationPair',
    args: [address],
    enabled
  })

  const {
    data: txSendData,
    isLoading: isWaiting,
    isError: isSendingError,
    write
  } = useContractWrite(config)

  const txHash = txSendData?.hash

  const sendSetLiquidationPairTransaction = !!write
    ? () => {
        write()
        if (!!txHash) {
          options?.onSend?.(txHash)
        }
      }
    : undefined

  const {
    data: txReceipt,
    isLoading: isConfirming,
    isSuccess,
    isError: isConfirmingError
  } = useWaitForTransaction({ chainId: vault?.chainId, hash: txHash })

  const isError = isSendingError || isConfirmingError

  useEffect(() => {
    if (!!txReceipt && isSuccess) {
      options?.onSuccess?.(txReceipt)
    }
  }, [isSuccess])

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
    sendSetLiquidationPairTransaction
  }
}
