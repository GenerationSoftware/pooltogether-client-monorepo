import { calculatePercentageOfBigInt } from '@shared/utilities'
import { useEffect } from 'react'
import { Address, isAddress, TransactionReceipt } from 'viem'
import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'
import { SupportedNetwork, V3_POOLS } from '@constants/config'
import { v3PoolABI } from '@constants/v3PoolABI'

export const useSendV3PoolWithdrawTransaction = (
  chainId: number,
  tokenAddress: Address,
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
  sendV3PoolWithdrawTransaction?: () => void
} => {
  const { address: userAddress, chain } = useAccount()

  const poolAddress =
    !!chainId && !!tokenAddress
      ? V3_POOLS[chainId as SupportedNetwork]?.find(
          (entry) => entry.ticketAddress === tokenAddress.toLowerCase()
        )?.address
      : undefined

  const enabled =
    !!chainId &&
    !!tokenAddress &&
    !!poolAddress &&
    !!amount &&
    !!userAddress &&
    isAddress(userAddress) &&
    chain?.id === chainId

  const { data } = useSimulateContract({
    account: userAddress as Address,
    chainId,
    address: poolAddress,
    abi: v3PoolABI,
    functionName: 'withdrawInstantlyFrom',
    args: [userAddress as Address, amount, tokenAddress, calculatePercentageOfBigInt(amount, 0.01)],
    query: { enabled }
  })

  const {
    data: txHash,
    isPending: isWaiting,
    isError: isSendingError,
    isSuccess: isSendingSuccess,
    writeContract: _sendV3PoolWithdrawTransaction
  } = useWriteContract()

  const sendV3PoolWithdrawTransaction =
    !!data && !!_sendV3PoolWithdrawTransaction
      ? () => _sendV3PoolWithdrawTransaction(data.request)
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
    sendV3PoolWithdrawTransaction
  }
}
