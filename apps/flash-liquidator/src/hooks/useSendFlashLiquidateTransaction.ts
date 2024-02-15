import { useGasAmountEstimate } from '@generationsoftware/hyperstructure-react-hooks'
import { useEffect } from 'react'
import { LiquidationPair } from 'src/types'
import { getFallbackGasAmount } from 'src/utils'
import { Address, TransactionReceipt } from 'viem'
import {
  useAccount,
  usePublicClient,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'
import { FLASH_LIQUIDATORS } from '@constants/config'
import { flashLiquidatorABI } from '@constants/flashLiquidatorABI'
import { useBestLiquidation } from './useBestLiquidation'
import { useBestLiquidationArgs } from './useBestLiquidationArgs'

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
  const address = FLASH_LIQUIDATORS[liquidationPair.chainId]

  const publicClient = usePublicClient({ chainId: liquidationPair.chainId })

  const { address: userAddress, chain } = useAccount()

  const {
    data: bestLiquidation,
    isFetched: isFetchedBestLiquidation,
    refetch: refetchBestLiquidation
  } = useBestLiquidation(liquidationPair)

  const args = useBestLiquidationArgs(liquidationPair, { receiver: userAddress })

  const enabled =
    !!liquidationPair &&
    chain?.id === liquidationPair.chainId &&
    isFetchedBestLiquidation &&
    !!bestLiquidation &&
    !!bestLiquidation.success &&
    !!args

  const { data: gasEstimate } = useGasAmountEstimate(
    liquidationPair.chainId,
    {
      address,
      abi: flashLiquidatorABI,
      functionName: 'flashLiquidate',
      args: args as NonNullable<ReturnType<typeof useBestLiquidationArgs>>,
      account: userAddress as Address
    },
    { enabled }
  )

  const fallbackGasEstimate = getFallbackGasAmount(liquidationPair.swapPath)

  const { data } = useSimulateContract({
    chainId: liquidationPair.chainId,
    address,
    abi: flashLiquidatorABI,
    functionName: 'flashLiquidate',
    args,
    gas: !!gasEstimate
      ? gasEstimate > fallbackGasEstimate
        ? gasEstimate
        : fallbackGasEstimate
      : undefined,
    query: { enabled }
  })

  const {
    data: txHash,
    isLoading: isWaiting,
    isError: isSendingError,
    isSuccess: isSendingSuccess,
    writeContract: _sendFlashLiquidateTransaction
  } = useWriteContract()

  const sendFlashLiquidateTransaction =
    !!publicClient && !!args && !!data
      ? () => {
          try {
            publicClient
              .simulateContract({
                account: userAddress,
                address,
                abi: flashLiquidatorABI,
                functionName: 'flashLiquidate',
                args
              })
              .then(({ result }) => {
                if (typeof result === 'bigint' && result >= data.result) {
                  _sendFlashLiquidateTransaction(data.request)
                } else {
                  options?.onError?.()
                }
              })
          } catch (e) {
            console.error(e)
            options?.onError?.()
          } finally {
            refetchBestLiquidation()
          }
        }
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
  } = useWaitForTransactionReceipt({ chainId: liquidationPair.chainId, hash: txHash })

  useEffect(() => {
    if (!!txReceipt && isSuccess) {
      options?.onSuccess?.(txReceipt)
      refetchBestLiquidation()
    }
  }, [isSuccess])

  const isError = isSendingError || isConfirmingError

  useEffect(() => {
    if (isError) {
      options?.onError?.()
      refetchBestLiquidation()
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
