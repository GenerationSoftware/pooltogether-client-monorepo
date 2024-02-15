import { useEffect } from 'react'
import { Address, isAddress, TransactionReceipt } from 'viem'
import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'
import { V4_POOLS } from '@constants/config'
import { v4PrizePoolABI } from '@constants/v4PrizePoolABI'

export const useSendV4WithdrawTransaction = (
  chainId: number,
  amount: bigint,
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
  sendV4WithdrawTransaction?: () => void
} => {
  const { address: userAddress, chain } = useAccount()

  const prizePoolAddress = !!chainId ? V4_POOLS[chainId]?.address : undefined

  const enabled =
    !!chainId &&
    !!amount &&
    !!prizePoolAddress &&
    !!userAddress &&
    isAddress(userAddress) &&
    chain?.id === chainId

  const { data } = useSimulateContract({
    account: userAddress as Address,
    chainId,
    address: prizePoolAddress,
    abi: v4PrizePoolABI,
    functionName: 'withdrawFrom',
    args: [userAddress as Address, amount],
    query: { enabled }
  })

  const {
    data: txHash,
    isLoading: isWaiting,
    isError: isSendingError,
    isSuccess: isSendingSuccess,
    writeContract: _sendV4WithdrawTransaction
  } = useWriteContract()

  const sendV4WithdrawTransaction =
    !!data && !!_sendV4WithdrawTransaction
      ? () => _sendV4WithdrawTransaction(data.request)
      : undefined

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
    sendV4WithdrawTransaction
  }
}
