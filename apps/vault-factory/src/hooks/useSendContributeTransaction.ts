import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useGasAmountEstimate,
  usePrizePool,
  usePrizeTokenData,
  useTokenAllowance
} from '@generationsoftware/hyperstructure-react-hooks'
import { calculatePercentageOfBigInt } from '@shared/utilities'
import { useEffect } from 'react'
import { SupportedNetwork } from 'src/types'
import { Address, isAddress, TransactionReceipt } from 'viem'
import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'
import { contributorABI, NETWORK_CONFIG } from '@constants/config'

/**
 * Prepares and submits a `contribute` transaction for a specific vault
 * @param amount the amount to contribute
 * @param vault the vault to contribute to
 * @param options optional callbacks
 * @returns
 */
export const useSendContributeTransaction = (
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
  sendContributeTransaction?: () => void
} => {
  const { address: userAddress, chain } = useAccount()

  const chainId = vault?.chainId as SupportedNetwork
  const contributorContractAddress = NETWORK_CONFIG[chainId]?.contributor

  const prizePoolAddress = NETWORK_CONFIG[chainId]?.prizePool
  const prizePool = usePrizePool(chainId, prizePoolAddress)

  const { data: prizeToken, isFetched: isFetchedPrizeToken } = usePrizeTokenData(prizePool)

  const { data: allowance, isFetched: isFetchedAllowance } = useTokenAllowance(
    chainId,
    userAddress!,
    contributorContractAddress!,
    prizeToken?.address!
  )

  const enabled =
    !!amount &&
    !!vault &&
    !!contributorContractAddress &&
    !!prizePoolAddress &&
    isFetchedPrizeToken &&
    !!prizeToken &&
    !!userAddress &&
    isAddress(userAddress) &&
    chain?.id === vault.chainId &&
    isFetchedAllowance &&
    !!allowance &&
    allowance >= amount

  const { data: gasEstimate } = useGasAmountEstimate(
    chainId,
    {
      address: contributorContractAddress!,
      abi: contributorABI,
      functionName: 'contribute',
      args: [prizePoolAddress, vault?.address, amount],
      account: userAddress!
    },
    { enabled }
  )

  const { data } = useSimulateContract({
    chainId,
    address: contributorContractAddress,
    abi: contributorABI,
    functionName: 'contribute',
    args: [prizePoolAddress, vault?.address, amount],
    gas: !!gasEstimate ? calculatePercentageOfBigInt(gasEstimate, 1.2) : undefined,
    query: { enabled }
  })

  const {
    data: txHash,
    isPending: isWaiting,
    isError: isSendingError,
    isSuccess: isSendingSuccess,
    writeContract: _sendContributeTransaction
  } = useWriteContract()

  const sendContributeTransaction =
    !!data && !!_sendContributeTransaction
      ? () => _sendContributeTransaction(data.request)
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
  } = useWaitForTransactionReceipt({ chainId, hash: txHash })

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
    sendContributeTransaction
  }
}
