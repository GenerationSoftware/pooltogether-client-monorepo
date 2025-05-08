import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { DOLPHIN_ADDRESS, erc20ABI, lower, ZAP_SETTINGS, zapRouterABI } from '@shared/utilities'
import { useMemo } from 'react'
import { Address, encodeFunctionData, Hash, isAddress, WalletCallReceipt } from 'viem'
import { useAccount } from 'wagmi'
import { useTokenAllowance, useZapArgs } from '..'
import { useSend5792Calls } from './useSend5792Calls'

/**
 * Prepares and submits [EIP-5792](https://eips.ethereum.org/EIPS/eip-5792) calls to swap and deposit into a vault
 * @dev should check if wallet supports this standard before calling this (`useCapabilities` wagmi hook)
 * @param inputToken the token the user is providing
 * @param vault the vault to deposit into
 * @param options optional callbacks
 * @returns
 */
export const useSend5792DepositZapTransaction = (
  inputToken: { address: Address; decimals: number; amount: bigint },
  vault: Vault,
  options?: Parameters<typeof useSend5792Calls>['2']
) => {
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
    !!zapArgs &&
    options?.enabled !== false

  const calls = useMemo(() => {
    const txs: { to: Address; data: Hash; value?: bigint }[] = []

    if (enabled) {
      if (lower(inputToken.address) !== DOLPHIN_ADDRESS && allowance < inputToken.amount) {
        txs.push({
          to: inputToken.address,
          data: encodeFunctionData({
            abi: erc20ABI,
            functionName: 'approve',
            args: [zapTokenManager, inputToken.amount]
          })
        })
      }

      txs.push({
        to: zapRouter,
        data: encodeFunctionData({
          abi: [zapRouterABI['15']],
          functionName: 'executeOrder',
          args: zapArgs
        }),
        value: lower(inputToken.address) === DOLPHIN_ADDRESS ? inputToken.amount : 0n
      })
    }

    return txs
  }, [inputToken, vault, allowance, enabled])

  const { sendCalls: send5792DepositZapTransaction, ...rest } = useSend5792Calls(
    chain?.id!,
    calls,
    { ...options, enabled }
  )

  return { ...rest, send5792DepositZapTransaction, amountOut, isFetchedZapArgs, isFetchingZapArgs }
}
