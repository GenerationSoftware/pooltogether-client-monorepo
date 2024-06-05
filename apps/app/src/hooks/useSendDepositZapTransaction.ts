import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useGasAmountEstimate,
  useTokenAllowance,
  useVaultExchangeRate,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import {
  calculatePercentageOfBigInt,
  DOLPHIN_ADDRESS,
  getSharesFromAssets,
  lower,
  NETWORK,
  vaultABI,
  WRAPPED_NATIVE_ASSETS
} from '@shared/utilities'
import { useEffect, useMemo } from 'react'
import { getArbitraryProxyTx, getWrapTx } from 'src/utils'
import {
  Address,
  ContractFunctionArgs,
  encodeFunctionData,
  isAddress,
  TransactionReceipt,
  zeroAddress
} from 'viem'
import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'
import { ZAP_SETTINGS } from '@constants/config'
import { zapRouterABI } from '@constants/zapRouterABI'
import { useSwapTx } from './useSwapTx'

type ZapConfig = ContractFunctionArgs<typeof zapRouterABI, 'payable', 'executeOrder'>[0]
type ZapRoute = ContractFunctionArgs<typeof zapRouterABI, 'payable', 'executeOrder'>[1]

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

  const wrappedNativeTokenAddress =
    !!vault && (WRAPPED_NATIVE_ASSETS[vault.chainId as NETWORK] as Lowercase<Address>)

  const {
    data: swapTx,
    isFetched: isFetchedSwapTx,
    isFetching: isFetchingSwapTx
  } = useSwapTx({
    chainId: vault?.chainId,
    from: {
      address: isDolphinAddress(inputToken?.address)
        ? wrappedNativeTokenAddress
        : inputToken?.address,
      decimals: inputToken?.decimals,
      amount: inputToken?.amount
    },
    to: { address: vaultToken?.address as Address, decimals: vaultToken?.decimals as number },
    userAddress: zapRouterAddress
  })

  const depositTx = useMemo(() => {
    return {
      target: vault.address,
      value: 0n,
      data: encodeFunctionData({
        abi: vaultABI,
        functionName: 'deposit',
        args: [0n, zapRouterAddress]
      })
    }
  }, [zapRouterAddress])

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
    (!isSwapNecessary || (isFetchedSwapTx && !!swapTx)) &&
    !!depositTx

  const amountOut = useMemo(() => {
    if (!!inputToken?.address && !!vaultToken && !!exchangeRate) {
      if (isSwapNecessary) {
        if (!!swapTx) {
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

  const zapArgs = useMemo((): [ZapConfig, ZapRoute] | undefined => {
    if (enabled && !!amountOut) {
      let zapInputs: ZapConfig['inputs'] = []

      let zapOutputs: ZapConfig['outputs'] = [
        { token: vault.address, minOutputAmount: amountOut.min },
        { token: vaultToken.address, minOutputAmount: 0n }
      ]

      let zapRoute: ZapRoute = [{ ...depositTx, tokens: [{ token: vaultToken.address, index: 4 }] }]

      if (isDolphinAddress(inputToken.address)) {
        zapInputs = [{ token: zeroAddress, amount: inputToken.amount }]
        zapOutputs = [...zapOutputs, { token: zeroAddress, minOutputAmount: 0n }]

        if (!!swapTx) {
          zapOutputs = [...zapOutputs, { token: wrappedNativeTokenAddress, minOutputAmount: 0n }]

          zapRoute = [
            {
              ...getWrapTx(vault.chainId, inputToken.amount),
              tokens: [{ token: zeroAddress, index: -1 }]
            },
            {
              ...getArbitraryProxyTx(swapTx.allowanceProxy),
              tokens: [{ token: wrappedNativeTokenAddress, index: -1 }]
            },
            {
              ...swapTx.tx,
              tokens: [{ token: wrappedNativeTokenAddress, index: -1 }]
            },
            ...zapRoute
          ]
        } else {
          zapRoute = [
            {
              ...getWrapTx(vault.chainId, inputToken.amount),
              tokens: [{ token: zeroAddress, index: -1 }]
            },
            ...zapRoute
          ]
        }
      } else {
        zapInputs = [{ token: inputToken.address, amount: inputToken.amount }]
        zapOutputs = [...zapOutputs, { token: inputToken.address, minOutputAmount: 0n }]

        if (!!swapTx) {
          zapRoute = [
            {
              ...getArbitraryProxyTx(swapTx.allowanceProxy),
              tokens: [{ token: inputToken.address, index: -1 }]
            },
            {
              ...swapTx.tx,
              tokens: [{ token: inputToken.address, index: -1 }]
            },
            ...zapRoute
          ]
        }
      }

      const zapConfig: ZapConfig = {
        inputs: zapInputs,
        outputs: zapOutputs,
        relay: { target: zeroAddress, value: 0n, data: '0x0' },
        user: userAddress,
        recipient: userAddress
      }

      return [zapConfig, zapRoute]
    }
  }, [
    inputToken,
    vault,
    userAddress,
    vaultToken,
    exchangeRate,
    swapTx,
    depositTx,
    amountOut,
    enabled
  ])

  const value = isDolphinAddress(inputToken?.address) ? inputToken.amount : 0n

  const { data: gasEstimate } = useGasAmountEstimate(
    vault?.chainId,
    {
      address: zapRouterAddress,
      abi: zapRouterABI,
      functionName: 'executeOrder',
      args: zapArgs,
      // @ts-ignore
      value,
      account: userAddress as Address
    },
    { enabled }
  )

  const { data } = useSimulateContract({
    chainId: vault?.chainId,
    address: zapRouterAddress,
    abi: zapRouterABI,
    functionName: 'executeOrder',
    args: zapArgs,
    // @ts-ignore
    value,
    gas: !!gasEstimate ? calculatePercentageOfBigInt(gasEstimate, 1.2) : undefined,
    query: { enabled }
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

const isDolphinAddress = (address?: Address) => !!address && lower(address) === DOLPHIN_ADDRESS
