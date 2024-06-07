import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useGasAmountEstimate } from '@generationsoftware/hyperstructure-react-hooks'
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
import { useDepositZapWithPermitArgs } from './useDepositZapWithPermitArgs'

/**
 * Prepares and submits a zap transaction with a permit that includes swapping and depositing into a vault
 * @param inputToken the token the user is providing
 * @param vault the vault to deposit into
 * @param signature a valid EIP-2612 signature to approve token expenditure
 * @param deadline the deadline for which the signature is valid for
 * @param nonce the token's nonce for which the signature is set to
 * @param options optional callbacks
 * @returns
 */
export const useSendDepositZapWithPermitTransaction = (
  inputToken: { address: Address; decimals: number; amount: bigint },
  vault: Vault,
  signature: `0x${string}`,
  deadline: bigint,
  nonce: bigint,
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
  sendDepositZapWithPermitTransaction?: () => void
  amountOut?: { expected: bigint; min: bigint }
  isFetchedZapArgs: boolean
  isFetchingZapArgs: boolean
} => {
  const { address: userAddress, chain } = useAccount()

  const zapRouterAddress = ZAP_SETTINGS[vault?.chainId]?.zapRouterAddress as Address | undefined

  const {
    zapArgs,
    amountOut,
    isFetched: isFetchedZapArgs,
    isFetching: isFetchingZapArgs
  } = useDepositZapWithPermitArgs({
    inputToken,
    vault,
    signature,
    deadline,
    nonce
  })

  const enabled =
    !!inputToken?.address &&
    inputToken.decimals !== undefined &&
    !!inputToken.amount &&
    !!vault &&
    !!signature &&
    !!deadline &&
    nonce !== undefined &&
    nonce !== -1n &&
    !!userAddress &&
    isAddress(userAddress) &&
    chain?.id === vault.chainId &&
    !!zapRouterAddress

  const { data: gasEstimate } = useGasAmountEstimate(
    vault?.chainId,
    {
      address: zapRouterAddress!,
      abi: zapRouterABI,
      functionName: 'executeOrder',
      args: zapArgs,
      account: userAddress!
    },
    { enabled: enabled && !!zapArgs }
  )

  const { data } = useSimulateContract({
    chainId: vault?.chainId,
    address: zapRouterAddress,
    abi: zapRouterABI,
    functionName: 'executeOrder',
    args: zapArgs,
    gas: !!gasEstimate ? calculatePercentageOfBigInt(gasEstimate, 1.2) : undefined,
    query: { enabled: enabled && !!zapArgs }
  })

  const {
    data: txHash,
    isPending: isWaiting,
    isError: isSendingError,
    isSuccess: isSendingSuccess,
    writeContract: _sendDepositZapWithPermitTransaction
  } = useWriteContract()

  const sendDepositZapWithPermitTransaction = !!data
    ? () => _sendDepositZapWithPermitTransaction(data.request)
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
    sendDepositZapWithPermitTransaction,
    amountOut,
    isFetchedZapArgs,
    isFetchingZapArgs
  }
}
