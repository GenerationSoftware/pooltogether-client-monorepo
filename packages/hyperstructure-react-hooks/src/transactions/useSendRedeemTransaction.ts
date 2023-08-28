import { Vault } from '@pooltogether/hyperstructure-client-js'
import { vaultABI } from '@shared/utilities'
import { useEffect } from 'react'
import { Address, isAddress, TransactionReceipt } from 'viem'
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction
} from 'wagmi'
import { useUserVaultShareBalance } from '..'

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
  const { address: userAddress } = useAccount()
  const { chain } = useNetwork()

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

  const { config } = usePrepareContractWrite({
    chainId: vault?.chainId,
    address: vault?.address,
    abi: vaultABI,
    functionName: 'redeem',
    args: [amount, userAddress as Address, userAddress as Address],
    enabled
  })

  const {
    data: txSendData,
    isLoading: isWaiting,
    isError: isSendingError,
    isSuccess: isSendingSuccess,
    write: sendRedeemTransaction
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

  return { isWaiting, isConfirming, isSuccess, isError, txHash, txReceipt, sendRedeemTransaction }
}
