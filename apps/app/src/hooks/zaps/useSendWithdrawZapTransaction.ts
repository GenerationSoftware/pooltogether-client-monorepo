import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useGasAmountEstimate,
  useTokenAllowance
} from '@generationsoftware/hyperstructure-react-hooks'
import { calculatePercentageOfBigInt } from '@shared/utilities'
import { useEffect } from 'react'
import { Address, isAddress, TransactionReceipt } from 'viem'
import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'
import { ZAP_SETTINGS } from '@constants/config'
import { zapRouterABI } from '@constants/zapRouterABI'
import { useZapArgs } from './useZapArgs'

/**
 * Prepares and submits a zap transaction that includes withdrawing from a vault and swapping
 * @param outputToken the token the user expects to receive
 * @param vault the vault to withdraw from
 * @param amount the amount of shares the user wants to withdraw
 * @param options optional callbacks
 * @returns
 */
export const useSendWithdrawZapTransaction = (
  outputToken: { address: Address; decimals: number },
  vault: Vault,
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
  sendWithdrawZapTransaction?: () => void
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
    vault?.address
  )

  const {
    zapArgs,
    amountOut,
    isFetched: isFetchedZapArgs,
    isFetching: isFetchingZapArgs
  } = useZapArgs(
    vault.chainId,
    { address: vault.address, decimals: vault.decimals!, amount },
    outputToken
  )

  const enabled =
    !!outputToken?.address &&
    outputToken.decimals !== undefined &&
    !!vault &&
    !!amount &&
    !!userAddress &&
    isAddress(userAddress) &&
    chain?.id === vault.chainId &&
    !!zapRouter &&
    !!zapTokenManager &&
    isFetchedAllowance &&
    allowance !== undefined &&
    allowance >= amount

  const { data: gasEstimate } = useGasAmountEstimate(
    vault?.chainId,
    {
      address: zapRouter,
      abi: [zapRouterABI['15']],
      functionName: 'executeOrder',
      args: zapArgs!,
      value: 0n,
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
    value: 0n,
    gas: !!gasEstimate ? calculatePercentageOfBigInt(gasEstimate, 1.2) : undefined,
    query: { enabled: enabled && !!zapArgs }
  })

  const {
    data: txHash,
    isPending: isWaiting,
    isError: isSendingError,
    isSuccess: isSendingSuccess,
    writeContract: _sendWithdrawZapTransaction
  } = useWriteContract()

  const sendWithdrawZapTransaction = !!data
    ? () => _sendWithdrawZapTransaction(data.request)
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
    sendWithdrawZapTransaction,
    amountOut,
    isFetchedZapArgs,
    isFetchingZapArgs
  }
}
