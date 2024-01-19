import { useEffect } from 'react'
import { Address, isAddress, TransactionReceipt } from 'viem'
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction
} from 'wagmi'
import { SupportedNetwork, V3_POOLS } from '@constants/config'
import { v3PodABI } from '@constants/v3PodABI'

export const useSendV3PodWithdrawTransaction = (
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
  sendV3PodWithdrawTransaction?: () => void
} => {
  const { address: userAddress } = useAccount()
  const { chain } = useNetwork()

  const podAddress =
    !!chainId && !!tokenAddress
      ? V3_POOLS[chainId as SupportedNetwork]?.find(
          (entry) => entry.ticketAddress === tokenAddress.toLowerCase()
        )?.podAddress
      : undefined

  const enabled =
    !!chainId &&
    !!tokenAddress &&
    !!podAddress &&
    !!amount &&
    !!userAddress &&
    isAddress(userAddress) &&
    chain?.id === chainId

  const { config } = usePrepareContractWrite({
    account: userAddress as Address,
    chainId,
    address: podAddress,
    abi: v3PodABI,
    functionName: 'withdraw',
    args: [amount, 0n],
    enabled
  })

  const {
    data: txSendData,
    isLoading: isWaiting,
    isError: isSendingError,
    isSuccess: isSendingSuccess,
    write: sendV3PodWithdrawTransaction
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
    sendV3PodWithdrawTransaction
  }
}
