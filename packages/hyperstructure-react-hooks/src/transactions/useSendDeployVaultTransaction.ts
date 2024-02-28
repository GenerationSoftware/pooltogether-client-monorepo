import { VaultDeployInfo } from '@shared/types'
import { VAULT_FACTORY_ADDRESSES, vaultFactoryABI } from '@shared/utilities'
import { useEffect } from 'react'
import { Address, TransactionReceipt } from 'viem'
import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'

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
  const { chain } = useAccount()

  const {
    chainId,
    name,
    symbol,
    yieldSourceAddress,
    prizePool,
    claimer,
    feeRecipient,
    feePercentage,
    yieldBuffer,
    owner
  } = vaultDeployInfo

  const vaultFactoryAddress = !!chainId ? VAULT_FACTORY_ADDRESSES[chainId] : undefined

  if (!!chainId && vaultFactoryAddress === undefined) {
    console.warn(`No vault factory address found for chain ID ${chainId}.`)
  }

  const enabled =
    !!vaultDeployInfo &&
    !!chainId &&
    !!name &&
    !!symbol &&
    !!yieldSourceAddress &&
    !!prizePool &&
    !!claimer &&
    !!feeRecipient &&
    feePercentage !== undefined &&
    yieldBuffer !== undefined &&
    !!owner &&
    !!vaultFactoryAddress &&
    chain?.id === chainId

  const { data } = useSimulateContract({
    chainId,
    address: vaultFactoryAddress,
    abi: vaultFactoryABI,
    functionName: 'deployVault',
    args: [
      name,
      symbol,
      yieldSourceAddress,
      prizePool,
      claimer,
      feeRecipient,
      feePercentage,
      yieldBuffer,
      owner
    ],
    query: { enabled }
  })

  const {
    data: txHash,
    isPending: isWaiting,
    isError: isSendingError,
    isSuccess: isSendingSuccess,
    writeContract: _sendDeployVaultTransaction
  } = useWriteContract()

  const sendDeployVaultTransaction =
    !!data && !!_sendDeployVaultTransaction
      ? () => _sendDeployVaultTransaction(data.request)
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
    sendDeployVaultTransaction
  }
}
