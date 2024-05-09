import {
  ActionType,
  bigintDeserializer,
  bigintSerializer,
  BoxActionRequest,
  BoxActionResponse,
  EvmTransaction
} from '@decent.xyz/box-common'
import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useVaultTokenAddress } from '@generationsoftware/hyperstructure-react-hooks'
import { sToMs } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { Address, TransactionReceipt } from 'viem'
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'

// TODO: detect permit support and use depositWithPermit if appropriate
// TODO: allow for multichain routes

/**
 * Prepares and submits deposit transactions with Decent.xyz's API
 * @param amount the amount to deposit
 * @param vault the vault to deposit into
 * @param options optional settings and/or callbacks
 * @returns
 */
export const useSendDecentTransaction = (
  amount: bigint,
  vault: Vault,
  options?: {
    fromTokenAddress?: Address
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
  // sendApproveTransaction?: () => void // TODO: check if decent api actually returns approval tx or if we should check first and approve ourselves
  sendDepositTransaction?: () => void
} => {
  const { address: userAddress, chain } = useAccount()

  const { data: tokenAddress, isFetched: isFetchedTokenAddress } = useVaultTokenAddress(vault)

  const enabled =
    !!amount &&
    !!vault &&
    !!userAddress &&
    chain?.id === vault.chainId &&
    isFetchedTokenAddress &&
    !!tokenAddress &&
    !!process.env.NEXT_PUBLIC_DECENT_API_KEY

  const txConfig = useMemo((): BoxActionRequest | undefined => {
    if (enabled) {
      return {
        actionType: ActionType.EvmFunction,
        sender: userAddress,
        srcToken: options?.fromTokenAddress ?? tokenAddress,
        dstToken: tokenAddress,
        slippage: 1,
        srcChainId: vault.chainId,
        dstChainId: vault.chainId,
        actionConfig: {
          chainId: vault.chainId,
          contractAddress: vault.address,
          cost: { amount, isNative: false, tokenAddress: tokenAddress },
          signature: 'function deposit(uint256 _assets, address _receiver)',
          args: [amount, userAddress],
          allowBridging: false
        }
      }
    }
  }, [enabled, userAddress, tokenAddress, vault, options])

  const { data: decentTxData, isFetched: isFetchedDecentTxData } = useQuery({
    queryKey: [
      'decentTx',
      txConfig?.srcChainId,
      txConfig?.srcToken,
      txConfig?.dstChainId,
      txConfig?.dstToken,
      txConfig?.sender,
      txConfig?.actionConfig.cost?.amount
    ],
    queryFn: async () => {
      const apiUrl = new URL('https://box-v2.api.decent.xyz/api/getBoxAction')
      apiUrl.searchParams.set('arguments', JSON.stringify(txConfig, bigintSerializer))

      const rawApiResponse = await fetch(apiUrl.toString(), {
        method: 'get',
        headers: { 'x-api-key': process.env.NEXT_PUBLIC_DECENT_API_KEY as string }
      }).then((r) => r.text())
      const { tx }: BoxActionResponse = JSON.parse(rawApiResponse, bigintDeserializer)

      return tx as EvmTransaction
    },
    enabled: !!txConfig,
    staleTime: sToMs(60)
  })
  console.log('🍪 ~ decentTxData:', isFetchedDecentTxData, decentTxData) // TODO: remove

  const {
    data: txHash,
    isPending: isWaiting,
    isError: isSendingError,
    isSuccess: isSendingSuccess,
    sendTransaction: _sendDepositTransaction
  } = useSendTransaction()

  const sendDepositTransaction = !!decentTxData
    ? () => _sendDepositTransaction(decentTxData)
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

  return { isWaiting, isConfirming, isSuccess, isError, txHash, txReceipt, sendDepositTransaction }
}
