import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { erc20ABI, ZAP_SETTINGS, zapRouterABI } from '@shared/utilities'
import { useMemo } from 'react'
import { Address, encodeFunctionData, Hash, isAddress, WalletCallReceipt } from 'viem'
import { useAccount } from 'wagmi'
import { useTokenAllowance, useZapArgs } from '..'
import { useSend5792Calls } from './useSend5792Calls'

/**
 * Prepares and submits [EIP-5792](https://eips.ethereum.org/EIPS/eip-5792) calls to withdraw from a vault and swap
 * @dev should check if wallet supports this standard before calling this (`useCapabilities` wagmi hook)
 * @param outputToken the token the user expects to receive
 * @param vault the vault to withdraw from
 * @param amount the amount of shares the user wants to withdraw
 * @param options optional callbacks
 * @returns
 */
export const useSend5792WithdrawZapTransaction = (
  outputToken: { address: Address; decimals: number },
  vault: Vault,
  amount: bigint,
  options?: Parameters<typeof useSend5792Calls>['2']
) => {
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
    !!zapArgs &&
    options?.enabled !== false

  const calls = useMemo(() => {
    const txs: { to: Address; data: Hash }[] = []

    if (enabled) {
      if (allowance < amount) {
        txs.push({
          to: vault.address,
          data: encodeFunctionData({
            abi: erc20ABI,
            functionName: 'approve',
            args: [zapTokenManager, amount]
          })
        })
      }

      txs.push({
        to: zapRouter,
        data: encodeFunctionData({
          abi: [zapRouterABI['15']],
          functionName: 'executeOrder',
          args: zapArgs
        })
      })
    }

    return txs
  }, [vault, amount, allowance, enabled])

  const { sendCalls: send5792WithdrawZapTransaction, ...rest } = useSend5792Calls(
    chain?.id!,
    calls,
    { ...options, enabled }
  )

  return { ...rest, send5792WithdrawZapTransaction, amountOut, isFetchedZapArgs, isFetchingZapArgs }
}
