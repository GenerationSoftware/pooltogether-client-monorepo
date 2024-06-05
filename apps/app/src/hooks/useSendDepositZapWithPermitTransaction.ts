import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useGasAmountEstimate,
  useVaultExchangeRate,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import {
  calculatePercentageOfBigInt,
  getSharesFromAssets,
  NETWORK,
  vaultABI,
  WRAPPED_NATIVE_ASSETS
} from '@shared/utilities'
import { useEffect, useMemo } from 'react'
import { getArbitraryProxyTx } from 'src/utils'
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

type ZapPermit = ContractFunctionArgs<typeof zapRouterABI, 'nonpayable', 'executeOrder'>[0]
type ZapConfig = ContractFunctionArgs<typeof zapRouterABI, 'nonpayable', 'executeOrder'>[1]
type ZapRoute = ContractFunctionArgs<typeof zapRouterABI, 'nonpayable', 'executeOrder'>[3]

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
  swapTx: ReturnType<typeof useSwapTx>['data']
  isFetchedSwapTx: boolean
  isFetchingSwapTx: boolean
} => {
  const { address: userAddress, chain } = useAccount()

  const { data: vaultToken, isFetched: isFetchedVaultToken } = useVaultTokenData(vault)
  const { data: exchangeRate, isFetched: isFetchedExchangeRate } = useVaultExchangeRate(vault)

  const { zapRouterAddress, zapTokenManager } = ZAP_SETTINGS[vault?.chainId] ?? {}

  const wrappedNativeTokenAddress =
    !!vault && (WRAPPED_NATIVE_ASSETS[vault.chainId as NETWORK] as Lowercase<Address>)

  const {
    data: swapTx,
    isFetched: isFetchedSwapTx,
    isFetching: isFetchingSwapTx
  } = useSwapTx({
    chainId: vault?.chainId,
    from: {
      address: inputToken?.address,
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

  const enabled =
    !!inputToken &&
    !!inputToken.address &&
    inputToken.decimals !== undefined &&
    !!inputToken.amount &&
    !!vault &&
    !!signature &&
    !!deadline &&
    nonce !== undefined &&
    nonce !== -1n &&
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
    !!wrappedNativeTokenAddress &&
    isFetchedSwapTx &&
    !!swapTx &&
    !!depositTx

  const amountOut = useMemo(() => {
    if (!!inputToken?.address && !!vaultToken && !!exchangeRate && !!swapTx) {
      return {
        expected: getSharesFromAssets(swapTx.amountOut.expected, exchangeRate, vaultToken.decimals),
        min: getSharesFromAssets(swapTx.amountOut.min, exchangeRate, vaultToken.decimals)
      }
    }
  }, [inputToken, vaultToken, exchangeRate, swapTx])

  const zapArgs = useMemo((): [ZapPermit, ZapConfig, `0x${string}`, ZapRoute] | undefined => {
    if (enabled && !!amountOut) {
      const zapPermit: ZapPermit = {
        permitted: [{ token: inputToken.address, amount: inputToken.amount }],
        nonce,
        deadline
      }

      const zapConfig: ZapConfig = {
        inputs: [{ token: inputToken.address, amount: inputToken.amount }],
        outputs: [
          { token: vault.address, minOutputAmount: amountOut.min },
          { token: inputToken.address, minOutputAmount: 0n },
          { token: vaultToken.address, minOutputAmount: 0n }
        ],
        relay: { target: zeroAddress, value: 0n, data: '0x0' },
        user: userAddress,
        recipient: userAddress
      }

      const zapRoute: ZapRoute = !!swapTx
        ? [
            {
              ...getArbitraryProxyTx(swapTx.allowanceProxy),
              tokens: [{ token: inputToken.address, index: -1 }]
            },
            { ...swapTx.tx, tokens: [{ token: inputToken.address, index: -1 }] },
            { ...depositTx, tokens: [{ token: vaultToken.address, index: 4 }] }
          ]
        : [{ ...depositTx, tokens: [{ token: vaultToken.address, index: 4 }] }]

      return [zapPermit, zapConfig, signature, zapRoute]
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

  const { data: gasEstimate } = useGasAmountEstimate(
    vault?.chainId,
    {
      address: zapRouterAddress,
      abi: zapRouterABI,
      functionName: 'executeOrder',
      args: zapArgs,
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
    gas: !!gasEstimate ? calculatePercentageOfBigInt(gasEstimate, 1.2) : undefined,
    query: { enabled }
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
    swapTx,
    isFetchedSwapTx,
    isFetchingSwapTx
  }
}
