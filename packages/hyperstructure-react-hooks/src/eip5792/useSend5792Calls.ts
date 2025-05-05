import { useEffect } from 'react'
import { Address, Hash, isAddress, WalletCallReceipt } from 'viem'
import { useAccount, useSendCalls, useWaitForCallsStatus } from 'wagmi'

/**
 * Prepares and submits [EIP-5792](https://eips.ethereum.org/EIPS/eip-5792) calls
 * @dev should check if wallet supports this standard before calling this (`useCapabilities` wagmi hook)
 * @param chainId the network to make calls on
 * @param calls the calls to make
 * @param options optional settings and callbacks
 * @returns
 */
export const useSend5792Calls = (
  chainId: number,
  calls: { to: Address; data: Hash }[],
  options?: {
    paymasterService?: { url: string; optional?: boolean }
    onSend?: () => void
    onSuccess?: (callReceipts: WalletCallReceipt<bigint, 'success' | 'reverted'>[]) => void
    onError?: () => void
    enabled?: boolean
  }
): {
  isWaiting: boolean
  isConfirming: boolean
  isSuccess: boolean
  isError: boolean
  txHashes?: Hash[]
  callReceipts?: WalletCallReceipt<bigint, 'success' | 'reverted'>[]
  sendCalls?: () => void
} => {
  const { address: userAddress, chain } = useAccount()

  const enabled =
    !!userAddress &&
    isAddress(userAddress) &&
    chain?.id === chainId &&
    !!calls?.length &&
    options?.enabled !== false

  const {
    data: callsData,
    isPending: isWaiting,
    isError: isSendingError,
    isSuccess: isSendingSuccess,
    sendCalls: _sendCalls
  } = useSendCalls()

  const sendCalls =
    enabled && !!_sendCalls
      ? () =>
          _sendCalls({
            chainId,
            account: userAddress,
            calls,
            capabilities: !!options?.paymasterService
              ? { paymasterService: { [chainId]: options.paymasterService } }
              : undefined
          })
      : undefined

  useEffect(() => {
    if (!!callsData?.id && isSendingSuccess) {
      options?.onSend?.()
    }
  }, [isSendingSuccess])

  const {
    data: callsStatus,
    isFetching: isConfirming,
    isSuccess,
    isError: isConfirmingError
  } = useWaitForCallsStatus({ id: callsData?.id })

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
    sendCalls
  }
}
