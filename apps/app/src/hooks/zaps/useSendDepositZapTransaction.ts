import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useGasAmountEstimate,
  useTokenAllowance
} from '@generationsoftware/hyperstructure-react-hooks'
import { calculatePercentageOfBigInt } from '@shared/utilities'
import { useEffect } from 'react'
import { isDolphinAddress } from 'src/zapUtils'
import { Address, isAddress, TransactionReceipt } from 'viem'
import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'
import { ZAP_SETTINGS } from '@constants/config'
import { zapRouterABI } from '@constants/zapRouterABI'
import { useDepositZapArgs } from './useDepositZapArgs'

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

  const { zapRouterAddress, zapTokenManager } = ZAP_SETTINGS[vault?.chainId] ?? {}

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
  } = useDepositZapArgs({ inputToken, vault })

  const enabled =
    !!inputToken?.address &&
    inputToken.decimals !== undefined &&
    !!inputToken.amount &&
    !!vault &&
    !!userAddress &&
    isAddress(userAddress) &&
    chain?.id === vault.chainId &&
    !!zapRouterAddress &&
    !!zapTokenManager &&
    isFetchedAllowance &&
    allowance !== undefined &&
    (isDolphinAddress(inputToken.address) || allowance >= inputToken.amount)

  const { data: gasEstimate } = useGasAmountEstimate(
    vault?.chainId,
    {
      address: zapRouterAddress,
      abi: [zapRouterABI['15']],
      functionName: 'executeOrder',
      args: zapArgs!,
      value: isDolphinAddress(inputToken?.address) ? inputToken.amount : 0n,
      account: userAddress
    },
    { enabled: enabled && !!zapArgs }
  )

  const { data } = useSimulateContract({
    chainId: vault?.chainId,
    address: zapRouterAddress,
    abi: [zapRouterABI['15']],
    functionName: 'executeOrder',
    args: zapArgs,
    value: isDolphinAddress(inputToken?.address) ? inputToken.amount : 0n,
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
