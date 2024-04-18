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
import { useGasAmountEstimate, useUserVaultTokenBalance } from '..'

/**
 * Prepares and submits a `withdraw` transaction to a vault
 * @param amount the amount of tokens to withdraw
 * @param vault the vault to withdraw from
 * @param options optional args or callbacks
 * @returns
 */
export const useSendWithdrawTransaction = (
  amount: bigint,
  vault: Vault,
  options?: {
    maxShares?: bigint
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
  sendWithdrawTransaction?: () => void
} => {
  const { address: userAddress, chain } = useAccount()

  const { data: vaultTokenBalance, isFetched: isFetchedVaultTokenBalance } =
    useUserVaultTokenBalance(vault, userAddress as Address)

  const enabled =
    !!amount &&
    !!vault &&
    !!userAddress &&
    isAddress(userAddress) &&
    chain?.id === vault.chainId &&
    isFetchedVaultTokenBalance &&
    !!vaultTokenBalance &&
    amount <= vaultTokenBalance.amount

  const { data: gasEstimate } = useGasAmountEstimate(
    vault?.chainId,
    {
      address: vault?.address,
      abi: vaultABI,
      functionName: 'withdraw',
      args: !!options?.maxShares
        ? [amount, userAddress as Address, userAddress as Address, options.maxShares]
        : [amount, userAddress as Address, userAddress as Address],
      account: userAddress as Address
    },
    { enabled }
  )

  const { data } = useSimulateContract({
    chainId: vault?.chainId,
    address: vault?.address,
    abi: vaultABI,
    functionName: 'withdraw',
    args: !!options?.maxShares
      ? [amount, userAddress as Address, userAddress as Address, options.maxShares]
      : [amount, userAddress as Address, userAddress as Address],
    gas: !!gasEstimate ? calculatePercentageOfBigInt(gasEstimate, 1.2) : undefined,
    query: { enabled }
  })

  const {
    data: txHash,
    isPending: isWaiting,
    isError: isSendingError,
    isSuccess: isSendingSuccess,
    writeContract: _sendWithdrawTransaction
  } = useWriteContract()

  const sendWithdrawTransaction =
    !!data && !!_sendWithdrawTransaction ? () => _sendWithdrawTransaction(data.request) : undefined

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

  return { isWaiting, isConfirming, isSuccess, isError, txHash, txReceipt, sendWithdrawTransaction }
}
