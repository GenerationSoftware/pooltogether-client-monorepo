import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useGasAmountEstimate,
  useTokenAllowance,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { calculatePercentageOfBigInt, vaultABI } from '@shared/utilities'
import { useEffect, useMemo } from 'react'
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

// TODO: handle native tokens (include payable amount and add wrap step in route first)

/**
 * Prepares and submits a zap transaction that includes swapping and depositing into a vault
 * @param inputTokenAddress the token the user is providing
 * @param amount the amount of tokens the user is providing
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
} => {
  const { address: userAddress, chain } = useAccount()

  const { data: vaultToken, isFetched: isFetchedVaultToken } = useVaultTokenData(vault)

  const { zapRouterAddress, zapTokenManager } = ZAP_SETTINGS[vault?.chainId] ?? {}

  const { data: allowance, isFetched: isFetchedAllowance } = useTokenAllowance(
    vault?.chainId,
    userAddress as Address,
    zapTokenManager,
    inputToken?.address
  )

  const { data: swapTx, isFetched: isFetchedSwapTx } = useSwapTx({
    chainId: vault?.chainId,
    from: {
      address: inputToken?.address,
      decimals: inputToken?.decimals,
      amount: inputToken?.amount
    },
    to: { address: vaultToken?.address as Address, decimals: vaultToken?.decimals as number },
    sender: zapTokenManager
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
    !!userAddress &&
    isAddress(userAddress) &&
    !!vaultToken &&
    !!vaultToken?.address &&
    vaultToken.decimals !== undefined &&
    isFetchedVaultToken &&
    chain?.id === vault.chainId &&
    !!zapRouterAddress &&
    !!zapTokenManager &&
    isFetchedAllowance &&
    !!allowance &&
    allowance >= inputToken.amount &&
    isFetchedSwapTx &&
    !!swapTx &&
    !!depositTx

  const zapArgs = useMemo(():
    | ContractFunctionArgs<typeof zapRouterABI, 'payable', 'executeOrder'>
    | undefined => {
    if (enabled) {
      const zapMinAmountOut = swapTx.minAmountOut // TODO: should consider the vault's exchange rate just in case

      return [
        {
          inputs: [{ token: inputToken.address, amount: inputToken.amount }],
          outputs: [{ token: vault.address, minOutputAmount: zapMinAmountOut }],
          relay: { target: zeroAddress, value: 0n, data: '0x0' },
          user: userAddress,
          recipient: userAddress
        },
        [
          {
            ...swapTx.tx,
            tokens: [{ token: inputToken.address, index: -1 }]
          },
          {
            ...depositTx,
            tokens: [{ token: vaultToken.address, index: 4 }] // TODO: check index logic
          }
        ]
      ]
    }
  }, [enabled, inputToken, vault, vaultToken, swapTx, depositTx])

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
    sendDepositZapTransaction
  }
}
