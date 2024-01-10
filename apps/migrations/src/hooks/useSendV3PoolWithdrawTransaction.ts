import { useEffect } from 'react'
import { Address, isAddress, TransactionReceipt } from 'viem'
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction
} from 'wagmi'
import { V3_POOLS } from '@constants/config'
import { SUPPORTED_NETWORKS } from '@constants/config'
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
  const { address: userAddress } = useAccount()
  const { chain } = useNetwork()

  const poolAddress =
    !!chainId && !!tokenAddress
      ? V3_POOLS[chainId as (typeof SUPPORTED_NETWORKS)[number]]?.find(
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

  const { config } = usePrepareContractWrite({
    chainId,
    address: poolAddress,
    abi: v3PoolABI,
    functionName: 'withdrawInstantlyFrom',
    args: [userAddress as Address, amount, tokenAddress, 0n],
    enabled
  })

  const {
    data: txSendData,
    isLoading: isWaiting,
    isError: isSendingError,
    isSuccess: isSendingSuccess,
    write: sendV3PoolWithdrawTransaction
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
    sendV3PoolWithdrawTransaction
  }
}
