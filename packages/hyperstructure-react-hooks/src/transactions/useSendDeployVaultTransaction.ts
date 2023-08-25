import { VaultDeployInfo } from '@shared/types'
import { VAULT_FACTORY_ADDRESSES, vaultFactoryABI } from '@shared/utilities'
import { useEffect } from 'react'
import { Address, TransactionReceipt } from 'viem'
import { useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

/**
 * Prepares and submits a `deployVault` transaction to the vault factory
 * @param vaultDeployInfo data needed to deploy a new vault
 * @param options optional callbacks
 * @returns
 */
export const useSendDeployVaultTransaction = (
  vaultDeployInfo: VaultDeployInfo,
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
  sendDeployVaultTransaction?: () => void
} => {
  const { chain } = useNetwork()

  const {
    chainId,
    token,
    name,
    symbol,
    twabController,
    yieldSourceAddress,
    prizePool,
    claimer,
    feeRecipient,
    feePercentage,
    owner
  } = vaultDeployInfo

  const vaultFactoryAddress = !!chainId ? VAULT_FACTORY_ADDRESSES[chainId] : undefined

  if (!!chainId && vaultFactoryAddress === undefined) {
    console.warn(`No vault factory address found for chain ID ${chainId}.`)
  }

  const enabled =
    !!vaultDeployInfo &&
    !!chainId &&
    !!token &&
    !!name &&
    !!symbol &&
    !!twabController &&
    !!yieldSourceAddress &&
    !!prizePool &&
    !!claimer &&
    !!feeRecipient &&
    feePercentage !== undefined &&
    !!owner &&
    !!vaultFactoryAddress &&
    chain?.id === chainId

  const { config } = usePrepareContractWrite({
    chainId,
    address: vaultFactoryAddress,
    abi: vaultFactoryABI,
    functionName: 'deployVault',
    args: [
      token,
      name,
      symbol,
      twabController,
      yieldSourceAddress,
      prizePool,
      claimer,
      feeRecipient,
      BigInt(feePercentage),
      owner
    ],
    enabled
  })

  const {
    data: txSendData,
    isLoading: isWaiting,
    isError: isSendingError,
    isSuccess: isSendingSuccess,
    write: sendDeployVaultTransaction
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
  } = useWaitForTransaction({ chainId, hash: txHash })

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
    sendDeployVaultTransaction
  }
}
