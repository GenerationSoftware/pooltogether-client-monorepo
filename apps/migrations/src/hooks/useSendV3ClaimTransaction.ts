import { useEffect } from 'react'
import { Address, isAddress, TransactionReceipt } from 'viem'
import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'
import { v3FaucetABI } from '@constants/v3FaucetABI'
import { useUserV3ClaimableRewards } from './useUserV3ClaimableRewards'

export const useSendV3ClaimTransaction = (
  chainId: number,
  ticketAddress: Lowercase<Address>,
  userAddress: Address,
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
  sendV3ClaimTransaction?: () => void
} => {
  const { chain } = useAccount()

  const { data: claimable, isFetched: isFetchedClaimable } = useUserV3ClaimableRewards(
    chainId,
    ticketAddress,
    userAddress
  )

  const enabled =
    !!chainId &&
    chainId === chain?.id &&
    !!userAddress &&
    isAddress(userAddress) &&
    isFetchedClaimable &&
    !!claimable?.rewards.amount &&
    !!claimable.rewards.address

  const { data } = useSimulateContract({
    chainId,
    address: claimable?.rewards.address,
    abi: v3FaucetABI,
    functionName: 'claim',
    args: [userAddress],
    query: { enabled }
  })

  const {
    data: txHash,
    isPending: isWaiting,
    isError: isSendingError,
    isSuccess: isSendingSuccess,
    writeContract: _sendClaimTransaction
  } = useWriteContract()

  const sendV3ClaimTransaction =
    !!data && !!_sendClaimTransaction ? () => _sendClaimTransaction(data.request) : undefined

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
    sendV3ClaimTransaction
  }
}
