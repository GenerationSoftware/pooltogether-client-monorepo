import { PairCreateInfo } from '@shared/types'
import { LIQUIDATION_PAIR_FACTORY_ADDRESSES, liquidationPairFactoryABI } from '@shared/utilities'
import { useEffect } from 'react'
import { Address, parseEther, TransactionReceipt } from 'viem'
import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'

/**
 * Prepares and submits a `createPair` transaction to the liquidation pair factory
 * @param pairCreateInfo data needed to create a new liquidation pair
 * @param options optional callbacks
 * @returns
 */
export const useSendDeployLiquidationPairTransaction = (
  pairCreateInfo: PairCreateInfo,
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
  sendDeployLiquidationPairTransaction?: () => void
} => {
  const { chain } = useAccount()

  const {
    chainId,
    source,
    tokenIn,
    tokenOut,
    targetAuctionPeriod,
    targetAuctionPrice,
    smoothingFactor
  } = pairCreateInfo

  const liquidationPairFactoryAddress = !!chainId
    ? LIQUIDATION_PAIR_FACTORY_ADDRESSES[chainId]
    : undefined

  if (!!chainId && liquidationPairFactoryAddress === undefined) {
    console.warn(`No liquidation pair factory address found for chain ID ${chainId}.`)
  }

  const enabled =
    !!pairCreateInfo &&
    !!chainId &&
    !!tokenIn &&
    !!tokenOut &&
    !!targetAuctionPeriod &&
    !!targetAuctionPrice &&
    smoothingFactor !== undefined &&
    chain?.id === chainId

  const { data } = useSimulateContract({
    chainId,
    address: liquidationPairFactoryAddress,
    abi: liquidationPairFactoryABI,
    functionName: 'createPair',
    args: [
      source,
      tokenIn,
      tokenOut,
      BigInt(targetAuctionPeriod ?? 0),
      targetAuctionPrice,
      parseEther(smoothingFactor.toFixed(6))
    ],
    query: { enabled }
  })

  const {
    data: txHash,
    isPending: isWaiting,
    isError: isSendingError,
    isSuccess: isSendingSuccess,
    writeContract: _sendDeployLiquidationPairTransaction
  } = useWriteContract()

  const sendDeployLiquidationPairTransaction =
    !!data && !!_sendDeployLiquidationPairTransaction
      ? () => _sendDeployLiquidationPairTransaction(data.request)
      : undefined

  useEffect(() => {
    if (!!txHash && isSendingSuccess) {
      options?.onSend?.(txHash)
    }
  }, [isSendingSuccess])

  const {
    data: txReceipt,
    isFetching: isConfirming,
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
    sendDeployLiquidationPairTransaction
  }
}
