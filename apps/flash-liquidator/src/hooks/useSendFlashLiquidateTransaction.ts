import { useGasAmountEstimate } from '@generationsoftware/hyperstructure-react-hooks'
import { useEffect } from 'react'
import { LiquidationPair } from 'src/types'
import { getFallbackGasAmount } from 'src/utils'
import { Address, TransactionReceipt } from 'viem'
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  usePublicClient,
  useWaitForTransaction
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
  const chainId = liquidationPair.chainId
  const address = FLASH_LIQUIDATORS[chainId]

  const { chain } = useNetwork()

  const publicClient = usePublicClient({ chainId })

  const { address: userAddress } = useAccount()

  const {
    data: bestLiquidation,
    isFetched: isFetchedBestLiquidation,
    refetch: refetchBestLiquidation
  } = useBestLiquidation(liquidationPair)

  const args = useBestLiquidationArgs(liquidationPair, { receiver: userAddress })

  const enabled =
    !!liquidationPair &&
    chain?.id === chainId &&
    isFetchedBestLiquidation &&
    !!bestLiquidation &&
    !!bestLiquidation.success &&
    !!args

  const { data: gasEstimate } = useGasAmountEstimate(
    chainId,
    {
      address,
      abi: flashLiquidatorABI,
      functionName: 'flashLiquidate',
      args,
      account: userAddress as Address
    },
    { enabled }
  )

  const fallbackGasEstimate = getFallbackGasAmount(liquidationPair.swapPath)

  const { config } = usePrepareContractWrite({
    chainId,
    address,
    abi: flashLiquidatorABI,
    functionName: 'flashLiquidate',
    args,
    gas: !!gasEstimate
      ? gasEstimate > fallbackGasEstimate
        ? gasEstimate
        : fallbackGasEstimate
      : undefined,
    enabled
  })

  const {
    data: txSendData,
    isLoading: isWaiting,
    isError: isSendingError,
    isSuccess: isSendingSuccess,
    write: _sendFlashLiquidateTransaction
  } = useContractWrite(config)

  const sendFlashLiquidateTransaction =
    !!args && !!_sendFlashLiquidateTransaction
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
                if (typeof result === 'bigint' && result >= config.result) {
                  _sendFlashLiquidateTransaction()
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
