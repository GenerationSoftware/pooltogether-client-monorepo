import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { erc20ABI, vaultABI } from '@shared/utilities'
import { useMemo } from 'react'
import { Address, encodeFunctionData, Hash, isAddress, WalletCallReceipt } from 'viem'
import { useAccount } from 'wagmi'
import { useTokenAllowance, useVaultTokenAddress } from '..'
import { useSend5792Calls } from './useSend5792Calls'

/**
 * Prepares and submits [EIP-5792](https://eips.ethereum.org/EIPS/eip-5792) calls to deposit into a vault
 * @dev should check if wallet supports this standard before calling this (`useCapabilities` wagmi hook)
 * @param amount the amount to deposit
 * @param vault the vault to deposit into
 * @param options optional settings and callbacks
 * @returns
 */
export const useSend5792DepositTransaction = (
  amount: bigint,
  vault: Vault,
  options?: Parameters<typeof useSend5792Calls>['2']
) => {
  const { address: userAddress, chain } = useAccount()

  const { data: tokenAddress, isFetched: isFetchedTokenAddress } = useVaultTokenAddress(vault)

  const { data: allowance, isFetched: isFetchedAllowance } = useTokenAllowance(
    vault?.chainId,
    userAddress!,
    vault?.address,
    tokenAddress!
  )

  const enabled =
    !!amount &&
    !!vault &&
    isFetchedTokenAddress &&
    !!tokenAddress &&
    !!userAddress &&
    isAddress(userAddress) &&
    chain?.id === vault.chainId &&
    isFetchedAllowance &&
    allowance !== undefined &&
    options?.enabled !== false

  const calls = useMemo(() => {
    const txs: { to: Address; data: Hash }[] = []

    if (enabled) {
      if (allowance < amount) {
        txs.push({
          to: tokenAddress,
          data: encodeFunctionData({
            abi: erc20ABI,
            functionName: 'approve',
            args: [vault.address, amount]
          })
        })
      }

      txs.push({
        to: vault.address,
        data: encodeFunctionData({
          abi: vaultABI,
          functionName: 'deposit',
          args: [amount, userAddress]
        })
      })
    }

    return txs
  }, [amount, vault, allowance, enabled])

  const { sendCalls: send5792DepositTransaction, ...rest } = useSend5792Calls(chain?.id!, calls, {
    ...options,
    enabled
  })

  return { ...rest, send5792DepositTransaction }
}
