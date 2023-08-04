import {
  LIQUIDATION_PAIR_FACTORY_ADDRESSES,
  liquidationPairFactoryABI,
  PairCreateInfo
} from '@pooltogether/hyperstructure-client-js'
import { useEffect } from 'react'
import { Address, TransactionReceipt } from 'viem'
import { useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

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
  const { chain } = useNetwork()

  const {
    chainId,
    source,
    tokenIn,
    tokenOut,
    periodLength,
    periodOffset,
    targetFirstSaleTime,
    decayConstant,
    initialAmountIn,
    initialAmountOut,
    minimumAuctionAmount
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
    periodLength !== undefined &&
    periodOffset !== undefined &&
    targetFirstSaleTime !== undefined &&
    decayConstant !== undefined &&
    initialAmountIn !== undefined &&
    initialAmountOut !== undefined &&
    minimumAuctionAmount !== undefined &&
    chain?.id === chainId

  const { config } = usePrepareContractWrite({
    chainId,
    address: liquidationPairFactoryAddress,
    abi: liquidationPairFactoryABI,
    functionName: 'createPair',
    args: [
      source,
      tokenIn,
      tokenOut,
      periodLength,
      periodOffset,
      targetFirstSaleTime,
      decayConstant,
      initialAmountIn,
      initialAmountOut,
      minimumAuctionAmount
    ],
    enabled
  })

  const {
    data: txSendData,
    isLoading: isWaiting,
    isError: isSendingError,
    write
  } = useContractWrite(config)

  const sendDeployLiquidationPairTransaction = !!write
    ? () => {
        write()
        if (!!txHash) {
          options?.onSend?.(txHash)
        }
      }
    : undefined

  const txHash = txSendData?.hash

  const {
    data: txReceipt,
    isLoading: isConfirming,
    isSuccess,
    isError: isConfirmingError
  } = useWaitForTransaction({ chainId, hash: txHash })

  const isError = isSendingError || isConfirmingError

  useEffect(() => {
    if (!!txReceipt && isSuccess) {
      options?.onSuccess?.(txReceipt)
    }
  }, [isSuccess])

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
