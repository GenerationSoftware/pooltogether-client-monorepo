import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { vaultABI } from '@shared/utilities'
import { encodeFunctionData, Hash, isAddress, WalletCallReceipt } from 'viem'
import { useAccount } from 'wagmi'
import { useUserVaultShareBalance } from '..'
import { useSend5792Calls } from './useSend5792Calls'

/**
 * Prepares and submits [EIP-5792](https://eips.ethereum.org/EIPS/eip-5792) calls to redeem shares from a vault
 * @dev should check if wallet supports this standard before calling this (`useCapabilities` wagmi hook)
 * @param amount the amount of shares to redeem
 * @param vault the vault to redeem from
 * @param options optional settings and callbacks
 * @returns
 */
export const useSend5792RedeemTransaction = (
  amount: bigint,
  vault: Vault,
  options?: {
    minAssets?: bigint
  } & Parameters<typeof useSend5792Calls>['2']
) => {
  const { address: userAddress, chain } = useAccount()

  const { data: vaultShareBalance, isFetched: isFetchedVaultShareBalance } =
    useUserVaultShareBalance(vault, userAddress!)

  const enabled =
    !!amount &&
    !!vault &&
    !!userAddress &&
    isAddress(userAddress) &&
    chain?.id === vault.chainId &&
    isFetchedVaultShareBalance &&
    !!vaultShareBalance &&
    amount <= vaultShareBalance.amount &&
    options?.enabled !== false

  const { sendCalls: send5792RedeemTransaction, ...rest } = useSend5792Calls(
    chain?.id!,
    enabled
      ? [
          {
            to: vault?.address,
            data: encodeFunctionData({
              abi: vaultABI,
              functionName: 'redeem',
              args: !!options?.minAssets
                ? [amount, userAddress, userAddress, options.minAssets]
                : [amount, userAddress, userAddress]
            })
          }
        ]
      : [],
    { ...options, enabled }
  )

  return { ...rest, send5792RedeemTransaction }
}
