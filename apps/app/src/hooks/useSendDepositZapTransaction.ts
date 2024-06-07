import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useGasAmountEstimate,
  useTokenAllowance,
  useVaultExchangeRate,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import {
  calculatePercentageOfBigInt,
  getSharesFromAssets,
  lower,
  NETWORK,
  WRAPPED_NATIVE_ASSETS
} from '@shared/utilities'
import { useEffect, useMemo } from 'react'
import { isDolphinAddress } from 'src/utils'
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
import { useSwapTx } from './useSwapTx'

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
  isSwapNecessary: boolean
  swapTx: ReturnType<typeof useSwapTx>['data']
  isFetchedSwapTx: boolean
  isFetchingSwapTx: boolean
} => {
  const { address: userAddress, chain } = useAccount()

  const { data: vaultToken, isFetched: isFetchedVaultToken } = useVaultTokenData(vault)
  const { data: exchangeRate, isFetched: isFetchedExchangeRate } = useVaultExchangeRate(vault)

  const { zapRouterAddress, zapTokenManager } = ZAP_SETTINGS[vault?.chainId] ?? {}

  const { data: allowance, isFetched: isFetchedAllowance } = useTokenAllowance(
    vault?.chainId,
    userAddress as Address,
    zapTokenManager,
    inputToken?.address
  )

  const wrappedNativeTokenAddress = WRAPPED_NATIVE_ASSETS[vault?.chainId as NETWORK]

  const {
    data: swapTx,
    isFetched: isFetchedSwapTx,
    isFetching: isFetchingSwapTx
  } = useSwapTx({
    chainId: vault?.chainId,
    from: {
      address: isDolphinAddress(inputToken?.address)
        ? wrappedNativeTokenAddress!
        : inputToken?.address,
      decimals: inputToken?.decimals,
      amount: inputToken?.amount
    },
    to: { address: vaultToken?.address!, decimals: vaultToken?.decimals! },
    userAddress: zapRouterAddress
  })

  const isSwapNecessary =
    !!inputToken?.address &&
    !!vaultToken &&
    lower(vaultToken.address) !== lower(inputToken.address) &&
    (!isDolphinAddress(inputToken.address) ||
      lower(vaultToken.address) !== wrappedNativeTokenAddress)

  const enabled =
    !!inputToken &&
    !!inputToken.address &&
    inputToken.decimals !== undefined &&
    !!inputToken.amount &&
    !!vault &&
    !!userAddress &&
    isAddress(userAddress) &&
    !!vaultToken &&
    !!vaultToken?.address &&
    vaultToken.decimals !== undefined &&
    isFetchedExchangeRate &&
    !!exchangeRate &&
    isFetchedVaultToken &&
    chain?.id === vault.chainId &&
    !!zapRouterAddress &&
    !!zapTokenManager &&
    isFetchedAllowance &&
    allowance !== undefined &&
    (isDolphinAddress(inputToken.address) || allowance >= inputToken.amount) &&
    !!wrappedNativeTokenAddress &&
    (!isSwapNecessary || (isFetchedSwapTx && !!swapTx))

  const amountOut = useMemo(() => {
    if (!!inputToken?.address && !!vaultToken && !!exchangeRate) {
      if (isSwapNecessary) {
        if (!!swapTx) {
          // TODO: this is not accurate for lp tokens, need some refactoring (pass amountOut logic into useDepositZapArgs?)
          return {
            expected: getSharesFromAssets(
              swapTx.amountOut.expected,
              exchangeRate,
              vaultToken.decimals
            ),
            min: getSharesFromAssets(swapTx.amountOut.min, exchangeRate, vaultToken.decimals)
          }
        }
      } else {
        const simpleAmountOut = getSharesFromAssets(
          inputToken.amount,
          exchangeRate,
          vaultToken.decimals
        )

        return {
          expected: simpleAmountOut,
          min: simpleAmountOut
        }
      }
    }
  }, [inputToken, vaultToken, exchangeRate, isSwapNecessary, swapTx])

  const { data: zapArgs } = useDepositZapArgs({ inputToken, vault, swapTx, amountOut, enabled })

  const value = isDolphinAddress(inputToken?.address) ? inputToken.amount : 0n

  const { data: gasEstimate } = useGasAmountEstimate(
    vault?.chainId,
    {
      address: zapRouterAddress,
      abi: [zapRouterABI['15']],
      functionName: 'executeOrder',
      args: zapArgs!,
      value,
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
    value,
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
    isSwapNecessary,
    swapTx,
    isFetchedSwapTx,
    isFetchingSwapTx
  }
}
