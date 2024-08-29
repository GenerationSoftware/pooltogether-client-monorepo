import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  calculatePercentageOfBigInt,
  DOLPHIN_ADDRESS,
  lower,
  ZAP_SETTINGS,
  zapRouterABI
} from '@shared/utilities'
import { useEffect } from 'react'
import { Address, isAddress, TransactionReceipt } from 'viem'
import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'
import { useGasAmountEstimate, useTokenAllowance, useZapArgs } from '..'

/**
 * Prepares and submits a zap transaction that includes swapping and depositing into a vault
 * @param inputToken the token the user is providing
 * @param vault the vault to deposit into
 * @param options optional callbacks
 * @returns
 */
export const useSendDepositZapTransaction = (
  inputToken: { address: Address; decimals: number; amount: bigint },
  vault: Vault,
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
  sendDepositZapTransaction?: () => void
  amountOut?: { expected: bigint; min: bigint }
  isFetchedZapArgs: boolean
  isFetchingZapArgs: boolean
} => {
  const { address: userAddress, chain } = useAccount()

  const { zapRouter, zapTokenManager } = ZAP_SETTINGS[vault?.chainId] ?? {}

  const { data: allowance, isFetched: isFetchedAllowance } = useTokenAllowance(
    vault?.chainId,
    userAddress!,
    zapTokenManager,
    inputToken?.address
  )

  const {
    zapArgs,
    amountOut,
    isFetched: isFetchedZapArgs,
    isFetching: isFetchingZapArgs
  } = useZapArgs(vault.chainId, inputToken, { address: vault.address, decimals: vault.decimals! })

  const enabled =
    !!inputToken?.address &&
    inputToken.decimals !== undefined &&
    !!inputToken.amount &&
    !!vault &&
    !!userAddress &&
    isAddress(userAddress) &&
    chain?.id === vault.chainId &&
    !!zapRouter &&
    !!zapTokenManager &&
    isFetchedAllowance &&
    allowance !== undefined &&
    (lower(inputToken.address) === DOLPHIN_ADDRESS || allowance >= inputToken.amount)

  const { data: gasEstimate } = useGasAmountEstimate(
    vault?.chainId,
    {
      address: zapRouter,
      abi: [zapRouterABI['15']],
      functionName: 'executeOrder',
      args: zapArgs!,
      value:
        !!inputToken?.address && lower(inputToken.address) === DOLPHIN_ADDRESS
          ? inputToken.amount
          : 0n,
      account: userAddress
    },
    { enabled: enabled && !!zapArgs }
  )

  const { data } = useSimulateContract({
    chainId: vault?.chainId,
    address: zapRouter,
    abi: [zapRouterABI['15']],
    functionName: 'executeOrder',
    args: zapArgs,
    value:
      !!inputToken?.address && lower(inputToken.address) === DOLPHIN_ADDRESS
        ? inputToken.amount
        : 0n,
    gas: !!gasEstimate ? calculatePercentageOfBigInt(gasEstimate, 1.2) : undefined,
    query: { enabled: enabled && !!zapArgs }
  })

  const {
    data: txHash,
    isPending: isWaiting,
    isError: isSendingError,
    isSuccess: isSendingSuccess,
    writeContract: _sendDepositZapTransaction
  } = useWriteContract()

  const sendDepositZapTransaction = !!data
    ? () => _sendDepositZapTransaction(data.request)
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
  } = useWaitForTransactionReceipt({ chainId: vault?.chainId, hash: txHash })

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
    sendDepositZapTransaction,
    amountOut,
    isFetchedZapArgs,
    isFetchingZapArgs
  }
}
