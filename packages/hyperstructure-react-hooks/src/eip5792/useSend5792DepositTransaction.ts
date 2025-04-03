import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { erc20ABI, vaultABI } from '@shared/utilities'
import { useEffect, useMemo } from 'react'
import { Address, encodeFunctionData, Hash, isAddress, WalletCallReceipt } from 'viem'
import { useAccount } from 'wagmi'
import { useSendCalls, useWaitForCallsStatus } from 'wagmi/experimental'
import { useTokenAllowance, useVaultTokenAddress } from '..'

/**
 * Prepares and submits [EIP-5792](https://eips.ethereum.org/EIPS/eip-5792) calls to deposit into a vault
 * @dev should check if wallet supports this standard before calling this (`useCapabilities` wagmi hook)
 * @param amount the amount to deposit
 * @param vault the vault to deposit into
 * @param options optional settings and callbacks
 * @returns
 */
export const useSend5792DepositTransaction = (
  amount: bigint,
  vault: Vault,
  options?: {
    paymasterService?: { url?: string; optional?: boolean }
    onSend?: () => void
    onSuccess?: (callReceipts: WalletCallReceipt<bigint, 'success' | 'reverted'>[]) => void
    onError?: () => void
  }
): {
  isWaiting: boolean
  isConfirming: boolean
  isSuccess: boolean
  isError: boolean
  txHashes?: Hash[]
  callReceipts?: WalletCallReceipt<bigint, 'success' | 'reverted'>[]
  send5792DepositTransaction?: () => void
} => {
  const { address: userAddress, chain } = useAccount()

  const { data: tokenAddress, isFetched: isFetchedTokenAddress } = useVaultTokenAddress(vault)

  const { data: allowance, isFetched: isFetchedAllowance } = useTokenAllowance(
    vault?.chainId,
    userAddress!,
    vault?.address,
    tokenAddress!
  )

  const enabled =
    !!amount &&
    !!vault &&
    isFetchedTokenAddress &&
    !!tokenAddress &&
    !!userAddress &&
    isAddress(userAddress) &&
    chain?.id === vault.chainId &&
    isFetchedAllowance &&
    allowance !== undefined

  const calls = useMemo(() => {
    const txs: { to: Address; data: Hash }[] = []

    if (enabled) {
      if (allowance < amount) {
        txs.push({
          to: tokenAddress,
          data: encodeFunctionData({
            abi: erc20ABI,
            functionName: 'approve',
            args: [vault.address, amount]
          })
        })
      }

      txs.push({
        to: vault.address,
        data: encodeFunctionData({
          abi: vaultABI,
          functionName: 'deposit',
          args: [amount, userAddress]
        })
      })
    }

    return txs
  }, [amount, vault, allowance, enabled])

  const {
    data: callsId,
    isPending: isWaiting,
    isError: isSendingError,
    isSuccess: isSendingSuccess,
    sendCalls
  } = useSendCalls()

  const send5792DepositTransaction =
    enabled && !!sendCalls
      ? () =>
          sendCalls({
            chainId: vault?.chainId,
            account: userAddress!,
            calls,
            capabilities: { paymasterService: options?.paymasterService }
          })
      : undefined

  useEffect(() => {
    if (!!callsId && isSendingSuccess) {
      options?.onSend?.()
    }
  }, [isSendingSuccess])

  const {
    data: callsStatus,
    isFetching: isConfirming,
    isSuccess,
    isError: isConfirmingError
  } = useWaitForCallsStatus({ id: callsId })

  useEffect(() => {
    if (!!callsStatus && !!callsStatus.receipts?.length && isSuccess) {
      options?.onSuccess?.(callsStatus.receipts)
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
    txHashes: callsStatus?.receipts?.map((r) => r.transactionHash),
    callReceipts: callsStatus?.receipts,
    send5792DepositTransaction
  }
}
