import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  getSecondsSinceEpoch,
  SECONDS_PER_DAY,
  TWAB_REWARDS_ADDRESSES,
  twabControllerABI,
  twabRewardsABI
} from '@shared/utilities'
import { useEffect, useMemo } from 'react'
import { Address, isAddress, TransactionReceipt } from 'viem'
import {
  useAccount,
  useReadContract,
  useReadContracts,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'
import { useTokenAllowance } from '..'

/**
 * Prepares and submits a `createPromotion` transaction to a TWAB rewards contract
 *
 * Default settings:
 * - Promotion starts as soon as possible.
 * - Epochs last 1 day.
 * @param vault the vault the promotion should be created for
 * @param tokenAddress the address of the token to reward users with
 * @param numberOfEpochs the number of epochs the promotion should last for (1 to 255)
 * @param tokensPerEpoch the number of tokens to distribute per epoch
 * @param options optional settings or callbacks
 * @returns
 */
export const useSendCreatePromotionTransaction = (
  vault: Vault,
  tokenAddress: Address,
  numberOfEpochs: number,
  tokensPerEpoch: bigint,
  options?: {
    startTimestamp?: bigint
    epochDuration?: number
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
  sendCreatePromotionTransaction?: () => void
} => {
  const { address: userAddress, chain } = useAccount()

  const twabRewardsAddress = !!vault ? TWAB_REWARDS_ADDRESSES[vault.chainId] : undefined
  const totalTokens =
    !!tokensPerEpoch && !!numberOfEpochs ? tokensPerEpoch * BigInt(numberOfEpochs) : 0n

  const { data: allowance, isFetched: isFetchedAllowance } = useTokenAllowance(
    vault?.chainId,
    userAddress as Address,
    twabRewardsAddress as Address,
    tokenAddress
  )

  const { data: twabControllerAddress } = useReadContract({
    chainId: vault?.chainId,
    address: twabRewardsAddress,
    abi: twabRewardsABI,
    functionName: 'twabController',
    query: { enabled: !!vault && !!twabRewardsAddress }
  })

  const { data: twabControllerInfo } = useReadContracts({
    contracts: [
      {
        chainId: vault?.chainId,
        address: twabControllerAddress,
        abi: twabControllerABI,
        functionName: 'PERIOD_OFFSET'
      },
      {
        chainId: vault?.chainId,
        address: twabControllerAddress,
        abi: twabControllerABI,
        functionName: 'PERIOD_LENGTH'
      }
    ]
  })

  const defaultStartTimestamp = useMemo(() => {
    const periodOffset = twabControllerInfo?.[0]?.result as number | undefined
    const periodLength = twabControllerInfo?.[1]?.result as number | undefined

    if (
      !!periodOffset &&
      typeof periodOffset === 'number' &&
      !!periodLength &&
      typeof periodLength === 'number'
    ) {
      const currentTimestamp = getSecondsSinceEpoch()

      let defaultStartTimestamp = periodOffset
      while (defaultStartTimestamp <= currentTimestamp) {
        defaultStartTimestamp += periodLength
      }

      return BigInt(defaultStartTimestamp)
    }
  }, [twabControllerInfo])

  const startTimestamp = options?.startTimestamp ?? defaultStartTimestamp
  const epochDuration = options?.epochDuration ?? SECONDS_PER_DAY

  const enabled =
    !!vault &&
    chain?.id === vault.chainId &&
    !!tokenAddress &&
    isAddress(tokenAddress) &&
    !!numberOfEpochs &&
    !!tokensPerEpoch &&
    !!twabRewardsAddress &&
    !!totalTokens &&
    !!startTimestamp &&
    !!epochDuration &&
    isFetchedAllowance &&
    !!allowance &&
    allowance >= totalTokens

  const { data } = useSimulateContract({
    chainId: vault?.chainId,
    address: twabRewardsAddress,
    abi: twabRewardsABI,
    functionName: 'createPromotion',
    args: [
      vault?.address,
      tokenAddress,
      startTimestamp as bigint,
      tokensPerEpoch,
      epochDuration,
      numberOfEpochs
    ],
    query: { enabled }
  })

  const {
    data: txHash,
    isPending: isWaiting,
    isError: isSendingError,
    isSuccess: isSendingSuccess,
    writeContract: _sendCreatePromotionTransaction
  } = useWriteContract()

  const sendCreatePromotionTransaction =
    !!data && !!_sendCreatePromotionTransaction
      ? () => _sendCreatePromotionTransaction(data.request)
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
    sendCreatePromotionTransaction
  }
}
