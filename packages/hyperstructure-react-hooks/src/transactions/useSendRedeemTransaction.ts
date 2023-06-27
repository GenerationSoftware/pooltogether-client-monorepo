import { erc4626 as erc4626Abi, Vault } from '@pooltogether/hyperstructure-client-js'
import { useEffect } from 'react'
import { isAddress, TransactionReceipt } from 'viem'
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction
} from 'wagmi'
import { useUserVaultShareBalance } from '..'

/**
 * Prepares and submits a `redeem` transaction to a vault
 * @param amount the amount of shares to redeem
 * @param vault the vault to redeem from
 * @param options optional callbacks
 * @returns
 */
export const useSendRedeemTransaction = (
  amount: bigint,
  vault: Vault,
  options?: { onSend?: () => void; onSuccess?: () => void; onError?: () => void }
): {
  isWaiting: boolean
  isConfirming: boolean
  isSuccess: boolean
  isError: boolean
  txHash?: `0x${string}`
  txReceipt?: TransactionReceipt
  sendRedeemTransaction?: () => void
} => {
  const { address: userAddress } = useAccount()
  const { chain } = useNetwork()

  const { data: vaultShareBalance, isFetched: isFetchedVaultShareBalance } =
    useUserVaultShareBalance(vault, userAddress as `0x${string}`)

  const enabled =
    !!vault &&
    !!userAddress &&
    isAddress(userAddress) &&
    chain?.id === vault.chainId &&
    isFetchedVaultShareBalance &&
    !!vaultShareBalance &&
    amount <= vaultShareBalance.amount

  const { config } = usePrepareContractWrite({
    chainId: vault?.chainId,
    address: vault?.address,
    abi: erc4626Abi,
    functionName: 'redeem',
    args: [amount, userAddress, userAddress],
    enabled
  })

  const {
    data: txSendData,
    isLoading: isWaiting,
    isError: isSendingError,
    write
  } = useContractWrite(config)

  const sendRedeemTransaction = !!write
    ? () => {
        write()
        options?.onSend?.()
      }
    : undefined

  const txHash = txSendData?.hash

  const {
    data: txReceipt,
    isLoading: isConfirming,
    isSuccess,
    isError: isConfirmingError
  } = useWaitForTransaction({ chainId: vault?.chainId, hash: txHash })

  const isError = isSendingError || isConfirmingError

  useEffect(() => {
    if (!!txReceipt && isSuccess) {
      options?.onSuccess?.()
    }
  }, [isSuccess])

  useEffect(() => {
    if (isError) {
      options?.onError?.()
    }
  }, [isError])

  return { isWaiting, isConfirming, isSuccess, isError, txHash, txReceipt, sendRedeemTransaction }
}
