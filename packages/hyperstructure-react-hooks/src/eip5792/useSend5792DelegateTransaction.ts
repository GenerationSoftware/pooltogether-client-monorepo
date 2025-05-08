import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { twabControllerABI } from '@shared/utilities'
import { Address, encodeFunctionData, Hash, isAddress, WalletCallReceipt } from 'viem'
import { useAccount } from 'wagmi'
import { useSend5792Calls } from './useSend5792Calls'

/**
 * Prepares and submits [EIP-5792](https://eips.ethereum.org/EIPS/eip-5792) calls to delegate a vault deposit
 * @dev should check if wallet supports this standard before calling this (`useCapabilities` wagmi hook)
 * @param twabController the relvant twab controller to update delegation in
 * @param address the new address to delegate to
 * @param vault the vault to update delegation for
 * @param options optional settings and callbacks
 * @returns
 */
export const useSend5792DelegateTransaction = (
  twabController: Address,
  address: Address | undefined,
  vault: Vault,
  options?: Parameters<typeof useSend5792Calls>['2']
) => {
  const { address: userAddress, chain } = useAccount()

  const enabled =
    !!twabController &&
    !!address &&
    isAddress(address) &&
    !!vault &&
    !!userAddress &&
    isAddress(userAddress) &&
    chain?.id === vault.chainId &&
    options?.enabled !== false

  const { sendCalls: send5792DelegateTransaction, ...rest } = useSend5792Calls(
    chain?.id!,
    enabled
      ? [
          {
            to: twabController,
            data: encodeFunctionData({
              abi: twabControllerABI,
              functionName: 'delegate',
              args: [vault.address, address]
            })
          }
        ]
      : [],
    { ...options, enabled }
  )

  return { ...rest, send5792DelegateTransaction }
}
