import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { calculatePercentageOfBigInt, vaultABI } from '@shared/utilities'
import { useEffect } from 'react'
import { Address, isAddress, TransactionReceipt } from 'viem'
import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'
import { useGasAmountEstimate, useUserVaultShareBalance } from '..'

/**
 * Prepares and submits a `redeem` transaction to a vault
 * @param amount the amount of shares to redeem
 * @param vault the vault to redeem from
 * @param options optional callbacks
 * @returns
 */
export const useSendRedeemTransaction = (
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
  sendRedeemTransaction?: () => void
} => {
  const { address: userAddress, chain } = useAccount()

  const { data: vaultShareBalance, isFetched: isFetchedVaultShareBalance } =
    useUserVaultShareBalance(vault, userAddress as Address)

  const enabled =
    !!amount &&
    !!vault &&
    !!userAddress &&
    isAddress(userAddress) &&
    chain?.id === vault.chainId &&
    isFetchedVaultShareBalance &&
    !!vaultShareBalance &&
    amount <= vaultShareBalance.amount

  const { data: gasEstimate } = useGasAmountEstimate(
    vault?.chainId,
    {
      address: vault?.address,
      abi: vaultABI,
      functionName: 'redeem',
      args: [amount, userAddress as Address, userAddress as Address],
      account: userAddress as Address
    },
    { enabled }
  )

  const { data } = useSimulateContract({
    chainId: vault?.chainId,
    address: vault?.address,
    abi: vaultABI,
    functionName: 'redeem',
    args: [amount, userAddress as Address, userAddress as Address],
    gas: !!gasEstimate ? calculatePercentageOfBigInt(gasEstimate, 1.2) : undefined,
    query: { enabled }
  })

  const {
    data: txHash,
    isLoading: isWaiting,
    isError: isSendingError,
    isSuccess: isSendingSuccess,
    writeContract: _sendRedeemTransaction
  } = useWriteContract()

  const sendRedeemTransaction =
    !!data && !!_sendRedeemTransaction ? () => _sendRedeemTransaction(data.request) : undefined

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

  return { isWaiting, isConfirming, isSuccess, isError, txHash, txReceipt, sendRedeemTransaction }
}
