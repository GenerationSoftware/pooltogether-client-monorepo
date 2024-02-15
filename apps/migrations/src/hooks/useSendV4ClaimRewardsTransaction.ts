import { twabRewardsABI } from '@shared/utilities'
import { useEffect, useMemo } from 'react'
import { Address, encodeFunctionData, isAddress, TransactionReceipt } from 'viem'
import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'
import { V4_PROMOTIONS } from '@constants/config'
import { useUserV4ClaimableRewards } from './useUserV4ClaimableRewards'

export const useSendV4ClaimRewardsTransaction = (
  chainId: number,
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
  sendV4ClaimRewardsTransaction?: () => void
} => {
  const { chain } = useAccount()

  const {
    data: claimable,
    isFetched: isFetchedClaimable,
    refetch: refetchClaimable
  } = useUserV4ClaimableRewards(chainId, userAddress)

  const epochsToClaim = useMemo(() => {
    const epochs: { [id: string]: number[] } = {}

    if (isFetchedClaimable && !!claimable) {
      Object.entries(claimable.rewards).forEach(([id, epochRewards]) => {
        epochs[id] = Object.keys(epochRewards).map((k) => parseInt(k))
      })
    }

    return epochs
  }, [claimable, isFetchedClaimable])

  const enabled =
    !!chainId &&
    chainId === chain?.id &&
    !!userAddress &&
    isAddress(userAddress) &&
    !!V4_PROMOTIONS[chainId] &&
    isFetchedClaimable &&
    !!claimable
  !!Object.keys(epochsToClaim).length

  const claimRewardsArgs = useMemo((): [Address, bigint, number[]] | undefined => {
    if (enabled) {
      const promotion = Object.entries(epochsToClaim).find((entry) => !!entry[1].length)

      if (!!promotion) {
        return [userAddress, BigInt(promotion[0]), promotion[1]]
      }
    }
  }, [userAddress, epochsToClaim])

  const { data } = useSimulateContract({
    chainId,
    address: V4_PROMOTIONS[chainId]?.twabRewardsAddress,
    abi: twabRewardsABI,
    functionName: 'claimRewards',
    args: claimRewardsArgs,
    query: { enabled }
  })

  const {
    data: _txHash,
    isLoading: _isWaiting,
    isError: _isSendingError,
    isSuccess: _isSendingSuccess,
    writeContract: _sendClaimRewardsTransaction
  } = useWriteContract()

  const sendClaimRewardsTransaction =
    !!data && !!_sendClaimRewardsTransaction
      ? () => _sendClaimRewardsTransaction(data.request)
      : undefined

  const isMulticall = useMemo(() => {
    const numValidPromotions = Object.values(epochsToClaim).filter(
      (epochs) => !!epochs.length
    ).length
    return numValidPromotions > 1
  }, [epochsToClaim])

  const multicallArgs = useMemo((): [`0x${string}`[]] | undefined => {
    if (enabled && isMulticall) {
      const validPromotions = Object.entries(epochsToClaim).filter((entry) => !!entry[1].length)

      const args = validPromotions.map((promotion) => {
        const callData = encodeFunctionData({
          abi: twabRewardsABI,
          args: [userAddress, BigInt(promotion[0]), promotion[1]],
          functionName: 'claimRewards'
        })
        return callData
      })

      return [args]
    }
  }, [userAddress, epochsToClaim])

  const { data: multicallData } = useSimulateContract({
    chainId,
    address: V4_PROMOTIONS[chainId]?.twabRewardsAddress,
    abi: twabRewardsABI,
    functionName: 'multicall',
    args: multicallArgs,
    query: { enabled: enabled && isMulticall }
  })

  const {
    data: multicallTxHash,
    isLoading: isWaitingMulticall,
    isError: isSendingMulticallError,
    isSuccess: isSendingMulticallSuccess,
    writeContract: _sendMulticallTransaction
  } = useWriteContract()

  const sendMulticallTransaction =
    !!multicallData && !!_sendMulticallTransaction
      ? () => _sendMulticallTransaction(multicallData.request)
      : undefined

  const txHash = isMulticall ? multicallTxHash : _txHash
  const isWaiting = isMulticall ? isWaitingMulticall : _isWaiting
  const isSendingError = isMulticall ? isSendingMulticallError : _isSendingError
  const sendV4ClaimRewardsTransaction = isMulticall
    ? sendMulticallTransaction
    : sendClaimRewardsTransaction

  useEffect(() => {
    if (!!txHash && (_isSendingSuccess || isSendingMulticallSuccess)) {
      options?.onSend?.(txHash)
    }
  }, [_isSendingSuccess, isSendingMulticallSuccess])

  const {
    data: txReceipt,
    isLoading: isConfirming,
    isSuccess,
    isError: isConfirmingError
  } = useWaitForTransactionReceipt({ chainId, hash: txHash })

  useEffect(() => {
    if (!!txReceipt && isSuccess) {
      refetchClaimable()
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
    sendV4ClaimRewardsTransaction
  }
}
