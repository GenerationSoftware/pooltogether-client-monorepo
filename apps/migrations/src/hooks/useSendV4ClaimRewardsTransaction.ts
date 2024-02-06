import { twabRewardsABI } from '@shared/utilities'
import { useEffect, useMemo } from 'react'
import { Address, encodeFunctionData, isAddress, TransactionReceipt } from 'viem'
import { useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
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
  const { chain } = useNetwork()

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

  const { config } = usePrepareContractWrite({
    chainId,
    address: V4_PROMOTIONS[chainId]?.twabRewardsAddress,
    abi: twabRewardsABI,
    functionName: 'claimRewards',
    args: claimRewardsArgs,
    enabled
  })

  const {
    data: txSendData,
    isLoading: _isWaiting,
    isError: _isSendingError,
    isSuccess: _isSendingSuccess,
    write: _sendClaimRewardsTransaction
  } = useContractWrite(config)

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

  const { config: multicallConfig } = usePrepareContractWrite({
    chainId,
    address: V4_PROMOTIONS[chainId]?.twabRewardsAddress,
    abi: twabRewardsABI,
    functionName: 'multicall',
    args: multicallArgs,
    enabled: enabled && isMulticall
  })

  const {
    data: multicallTxSendData,
    isLoading: isWaitingMulticall,
    isError: isSendingMulticallError,
    isSuccess: isSendingMulticallSuccess,
    write: sendMulticallTransaction
  } = useContractWrite(multicallConfig)

  const txHash = isMulticall ? multicallTxSendData?.hash : txSendData?.hash
  const isWaiting = isMulticall ? isWaitingMulticall : _isWaiting
  const isSendingError = isMulticall ? isSendingMulticallError : _isSendingError
  const sendV4ClaimRewardsTransaction = isMulticall
    ? sendMulticallTransaction
    : _sendClaimRewardsTransaction

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
  } = useWaitForTransaction({ chainId, hash: txHash })

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
