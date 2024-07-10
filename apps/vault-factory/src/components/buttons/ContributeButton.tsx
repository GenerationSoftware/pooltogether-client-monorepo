import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useSendGenericApproveTransaction,
  useTokenAllowance,
  useTokenBalance
} from '@generationsoftware/hyperstructure-react-hooks'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { useAddRecentTransaction, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { TransactionButton } from '@shared/react-components'
import { Token } from '@shared/types'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { contributionAmountAtom } from 'src/atoms'
import { SupportedNetwork } from 'src/types'
import { useAccount } from 'wagmi'
import { NETWORK_CONFIG } from '@constants/config'
import { useSendContributeTransaction } from '@hooks/useSendContributeTransaction'

interface ContributeButtonProps {
  vault: Vault
  prizeToken: Token
  onSuccess?: () => void
  className?: string
  innerClassName?: string
}

export const ContributeButton = (props: ContributeButtonProps) => {
  const { vault, prizeToken, onSuccess, className, innerClassName } = props

  const { address: userAddress } = useAccount()

  const chainId = vault?.chainId as SupportedNetwork
  const contributorContractAddress = NETWORK_CONFIG[chainId]?.contributor

  const {
    data: token,
    isFetched: isFetchedToken,
    refetch: refetchUserTokenBalance
  } = useTokenBalance(chainId, userAddress!, prizeToken?.address!, { refetchOnWindowFocus: true })

  const {
    data: allowance,
    isFetched: isFetchedAllowance,
    refetch: refetchAllowance
  } = useTokenAllowance(chainId, userAddress!, contributorContractAddress!, prizeToken?.address!)

  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()
  const addRecentTransaction = useAddRecentTransaction()

  const contributionAmount = useAtomValue(contributionAmountAtom)

  const {
    isWaiting: isWaitingApproval,
    isConfirming: isConfirmingApproval,
    isSuccess: isSuccessfulApproval,
    txHash: approvalTxHash,
    sendApproveTransaction
  } = useSendGenericApproveTransaction(
    chainId,
    prizeToken?.address!,
    contributorContractAddress!,
    contributionAmount!,
    {
      onSuccess: () => {
        refetchAllowance()
      }
    }
  )

  const {
    isWaiting: isWaitingContribution,
    isConfirming: isConfirmingContribution,
    isSuccess: isSuccessfulContribution,
    txHash: contributionTxHash,
    sendContributeTransaction
  } = useSendContributeTransaction(contributionAmount!, vault, {
    onSuccess: () => {
      refetchUserTokenBalance()
      refetchAllowance()
      onSuccess?.()
    }
  })

  const isDataFetched =
    !!vault &&
    !!prizeToken &&
    !!userAddress &&
    !!contributorContractAddress &&
    !!token &&
    isFetchedToken &&
    allowance !== undefined &&
    isFetchedAllowance &&
    contributionAmount !== undefined

  const buttonClassName = classNames(
    'min-w-[9rem] !bg-pt-purple-600 !border-pt-purple-600 hover:!bg-pt-purple-700 focus:outline-transparent',
    className
  )
  const buttonInnerClassName = classNames(
    'flex gap-2 items-center text-pt-purple-50',
    innerClassName
  )

  if (isDataFetched && allowance < contributionAmount && token.amount >= contributionAmount) {
    return (
      <TransactionButton
        chainId={chainId}
        isTxLoading={isWaitingApproval || isConfirmingApproval}
        isTxSuccess={isSuccessfulApproval}
        write={sendApproveTransaction}
        txHash={approvalTxHash}
        txDescription={`Approve ${prizeToken?.symbol} Contribution`}
        disabled={!isDataFetched}
        openConnectModal={openConnectModal}
        openChainModal={openChainModal}
        addRecentTransaction={addRecentTransaction}
        color='purple'
        className={buttonClassName}
        innerClassName={buttonInnerClassName}
      >
        Approve {prizeToken?.symbol} Contribution
      </TransactionButton>
    )
  }

  return (
    <TransactionButton
      chainId={chainId}
      isTxLoading={isWaitingContribution || isConfirmingContribution}
      isTxSuccess={isSuccessfulContribution}
      write={sendContributeTransaction}
      txHash={contributionTxHash}
      txDescription={`Contribute ${prizeToken?.symbol}`}
      disabled={!isDataFetched || token.amount < contributionAmount}
      openConnectModal={openConnectModal}
      openChainModal={openChainModal}
      addRecentTransaction={addRecentTransaction}
      color='purple'
      className={buttonClassName}
      innerClassName={buttonInnerClassName}
    >
      Contribute {prizeToken?.symbol} <ArrowRightIcon className='w-4 h-4' />
    </TransactionButton>
  )
}
