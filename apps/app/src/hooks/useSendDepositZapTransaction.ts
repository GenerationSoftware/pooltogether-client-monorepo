import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useGasAmountEstimate,
  useTokenAllowance,
  useVaultTokenAddress
} from '@generationsoftware/hyperstructure-react-hooks'
import { calculatePercentageOfBigInt, vaultABI } from '@shared/utilities'
import { useEffect, useMemo } from 'react'
import {
  Address,
  ContractFunctionArgs,
  encodeFunctionData,
  isAddress,
  parseUnits,
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
  inputTokenAddress: Address,
  amount: bigint,
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

  const { data: vaultTokenAddress, isFetched: isFetchedVaultTokenAddress } =
    useVaultTokenAddress(vault)

  const { zapRouterAddress, zapTokenManager } = ZAP_SETTINGS[vault?.chainId] ?? {}

  const { data: allowance, isFetched: isFetchedAllowance } = useTokenAllowance(
    vault?.chainId,
    userAddress as Address,
    zapTokenManager,
    inputTokenAddress
  )

  const enabled =
    !!inputTokenAddress &&
    !!amount &&
    !!vault &&
    !!userAddress &&
    isAddress(userAddress) &&
    !!vaultTokenAddress &&
    isFetchedVaultTokenAddress &&
    chain?.id === vault.chainId &&
    !!zapRouterAddress &&
    !!zapTokenManager &&
    isFetchedAllowance &&
    !!allowance &&
    allowance >= amount

  // example WETH -> USDC -> przUSDC
  // ^ inputs: [{ wethadress, inputamount }]
  // ^ outputs: [{ przusdcaddress, minAmountOut (or check exchange rate) }]
  // ^ relay: { target: 0x00000..., value: 0n, data: 0x0 }
  // ^ user: userAddress
  // ^ recipient: userAddress
  // ^ route: [{ target: swaptarget aka lp, value: 0, data: customSwapCallData, tokens: [{ wethAddress, byteIndexInCustomData }] }, { target: przusdc, value: 0, data: customDepositCallData, tokens: [{ usdcAddress, byteIndexInCustomData }] }]

  // customSwapCallData is calldata for swap but without input amount (uint256 -> 32 bytes, 2ch per byte so usually 64ch, set to 00000000000000...)
  // customDepositCallData is calldata for deposit (no minamount) but without input amount (000000000...)
  // byteIndexInCustomData is start (check) index of where token amount is inside calldata
  // ^ if we are using an aggregator with a swap router that always has the same sig this is much easier

  // TODO: get swap route from inputToken to vaultToken from some external api
  // TODO: should include a slippage or minAmountOut indicator
  const swapMinAmountOut = parseUnits('1', 18)
  const zapMinAmountOut = swapMinAmountOut // TODO: should consider the vault's exchange rate just in case

  // TODO: include swap route
  const zapArgs = useMemo(():
    | ContractFunctionArgs<typeof zapRouterABI, 'payable', 'executeOrder'>
    | undefined => {
    if (enabled) {
      return [
        {
          inputs: [{ token: inputTokenAddress, amount }],
          outputs: [{ token: vault.address, minOutputAmount: zapMinAmountOut }],
          relay: { target: zeroAddress, value: 0n, data: '0x0' },
          user: userAddress,
          recipient: userAddress
        },
        [
          {
            target: vault.address,
            value: 0n,
            data: encodeFunctionData({
              abi: vaultABI,
              functionName: 'deposit',
              args: [swapMinAmountOut, zapRouterAddress]
            }),
            tokens: [{ token: vaultTokenAddress, index: -1 }]
          }
        ]
      ]
    }
  }, [enabled, inputTokenAddress, amount, vault, swapMinAmountOut, zapMinAmountOut])
  console.log('🍪 ~ zapArgs:', zapArgs)

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

  const { data, failureReason } = useSimulateContract({
    chainId: vault?.chainId,
    address: zapRouterAddress,
    abi: zapRouterABI,
    functionName: 'executeOrder',
    args: zapArgs,
    gas: !!gasEstimate ? calculatePercentageOfBigInt(gasEstimate, 1.2) : undefined,
    query: { enabled }
  })
  console.log('🍪 ~ simulation:', data, failureReason)

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
