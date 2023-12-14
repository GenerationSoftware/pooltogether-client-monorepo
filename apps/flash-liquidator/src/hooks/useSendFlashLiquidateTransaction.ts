import { useEffect } from 'react'
import { LiquidationPair } from 'src/types'
import { Address, TransactionReceipt } from 'viem'
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction
} from 'wagmi'
import { FLASH_LIQUIDATORS } from '@constants/config'
import { flashLiquidatorABI } from '@constants/flashLiquidatorABI'
import { useBestLiquidation } from './useBestLiquidation'
import { useBestLiquidationArgs } from './useBestLiquidationArgs'

// TODO: when `sendFlashLiquidateTransaction` is called, tx should be simulated again, and only if output is equal to or higher than before should the tx go through
/**
 * Prepares and submits a `flashLiquidate` transaction
 * @param liquidationPair the liquidation pair to flash liquidate
 * @param options optional callbacks
 * @returns
 */
export const useSendFlashLiquidateTransaction = (
  liquidationPair: LiquidationPair,
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
  sendFlashLiquidateTransaction?: () => void
} => {
  const { chain } = useNetwork()

  const { address: userAddress } = useAccount()

  const { data: bestLiquidation, isFetched: isFetchedBestLiquidation } =
    useBestLiquidation(liquidationPair)

  const args = useBestLiquidationArgs(liquidationPair, { receiver: userAddress })

  const { config } = usePrepareContractWrite({
    chainId: liquidationPair.chainId,
    address: FLASH_LIQUIDATORS[liquidationPair.chainId],
    abi: flashLiquidatorABI,
    functionName: 'flashLiquidate',
    args,
    enabled:
      !!liquidationPair &&
      chain?.id === liquidationPair.chainId &&
      isFetchedBestLiquidation &&
      !!bestLiquidation &&
      !!bestLiquidation.success &&
      !!args
  })

  const {
    data: txSendData,
    isLoading: isWaiting,
    isError: isSendingError,
    isSuccess: isSendingSuccess,
    write: sendFlashLiquidateTransaction
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
  } = useWaitForTransaction({ chainId: liquidationPair.chainId, hash: txHash })

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
    sendFlashLiquidateTransaction
  }
}
