import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useSendGenericApproveTransaction,
  useTokenAllowance,
  useVaultTokenAddress
} from '@generationsoftware/hyperstructure-react-hooks'
import { sToMs } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { Address, TransactionReceipt } from 'viem'
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'

interface DecentRequest {
  sender: Address
  srcChainId: number
  srcToken?: Address
  dstChainId: number
  dstToken?: Address
  slippage: number
  actionType: 'evm-function'
  actionConfig: {
    chainId: number
    contractAddress: Address
    cost: DecentToken
    signature: string
    args: any[]
    allowSwapping?: boolean
    allowBridging?: boolean
  }
}

interface DecentResponse {
  tx: {
    to: Address
    data?: `0x${string}`
    value?: bigint
    gasPrice?: bigint
    gasLimit?: bigint
    maxFeePerGas?: bigint
    maxPriorityFeePerGas?: bigint
    chainId?: number
  }
  tokenPayment?: DecentToken
  applicationFee?: DecentToken
  bridgeFee?: DecentToken
  bridgeId?: string
  relayInfo?: {
    actions: {
      address: Address
      signatures: string[]
      args: any[]
      functionName: string
      value?: bigint
    }[]
  }
  amountOut?: DecentToken
  arbitraryData?: any
}

type DecentToken =
  | { amount: bigint; isNative?: false; tokenAddress: Address }
  | { amount: bigint; isNative: true; tokenAddress?: Address }

// TODO: allow `fromTokenAddress` of native asset (isNative: true)
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
  sendApproveTransaction?: () => void
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

  const txConfig = useMemo((): DecentRequest | undefined => {
    if (enabled) {
      return {
        actionType: 'evm-function',
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
      const apiResponse: DecentResponse = JSON.parse(rawApiResponse, bigintDeserializer)

      return apiResponse
    },
    enabled: !!txConfig,
    staleTime: sToMs(60)
  })
  console.log('🍪 ~ decentTxData:', isFetchedDecentTxData, decentTxData) // TODO: remove

  const approvalToken = useMemo(() => {
    if (
      !!decentTxData &&
      !!decentTxData.tx.chainId &&
      !!decentTxData.tokenPayment &&
      !decentTxData.tokenPayment.isNative
    ) {
      return {
        chainId: decentTxData.tx.chainId,
        address: decentTxData.tokenPayment.tokenAddress,
        amount: decentTxData.tokenPayment.amount
      }
    }
  }, [decentTxData])
  console.log('🍪 ~ approvalToken:', approvalToken) // TODO: remove

  const {
    data: allowance,
    isFetched: isFetchedAllowance,
    refetch: refetchAllowance
  } = useTokenAllowance(
    approvalToken?.chainId as number,
    userAddress as Address,
    decentTxData?.tx.to as Address,
    approvalToken?.address as Address
  )
  console.log('🍪 ~ allowance:', isFetchedAllowance, allowance) // TODO: remove

  const {
    isWaiting: isWaitingApproval,
    isConfirming: isConfirmingApproval,
    sendApproveTransaction
  } = useSendGenericApproveTransaction(
    approvalToken?.chainId as number,
    approvalToken?.address as Address,
    decentTxData?.tx.to as Address,
    approvalToken?.amount as bigint,
    { onSuccess: () => refetchAllowance() }
  )

  const {
    data: txHash,
    isPending: isWaitingDeposit,
    isError: isSendingError,
    sendTransaction: _sendDepositTransaction
  } = useSendTransaction()

  const sendDepositTransaction =
    !!txConfig && !!decentTxData && isFetchedAllowance && !!allowance && allowance >= 0n
      ? () =>
          _sendDepositTransaction(decentTxData.tx, {
            onSuccess: (txHash) => options?.onSend?.(txHash)
          })
      : undefined

  const {
    data: txReceipt,
    isFetching: isConfirmingDeposit,
    isSuccess,
    isError: isConfirmingError
  } = useWaitForTransactionReceipt({ chainId: vault?.chainId, hash: txHash })

  useEffect(() => {
    if (!!txReceipt && isSuccess) {
      refetchAllowance()
      options?.onSuccess?.(txReceipt)
    }
  }, [isSuccess])

  const isError = isSendingError || isConfirmingError

  useEffect(() => {
    if (isError) {
      options?.onError?.()
    }
  }, [isError])

  const isWaiting = isWaitingApproval || isWaitingDeposit
  const isConfirming = isConfirmingApproval || isConfirmingDeposit

  return {
    isWaiting,
    isConfirming,
    isSuccess,
    isError,
    txHash,
    txReceipt,
    sendApproveTransaction,
    sendDepositTransaction
  }
}

const bigintSerializer = (_key: string, value: unknown): unknown => {
  if (typeof value === 'bigint') return value.toString() + 'n'
  return value
}

const bigintDeserializer = (_key: string, value: unknown): unknown => {
  if (typeof value === 'string' && /^-?\d+n$/.test(value)) return BigInt(value.slice(0, -1))
  return value
}
