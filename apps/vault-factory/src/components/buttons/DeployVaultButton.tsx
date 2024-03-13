import {
  useSendDeployVaultTransaction,
  useTokenAllowance,
  useTokenBalance
} from '@generationsoftware/hyperstructure-react-hooks'
import { ArrowRightIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import { useAddRecentTransaction, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { createDeployVaultTxToast, TransactionButton } from '@shared/react-components'
import { VaultDeployInfo } from '@shared/types'
import { Tooltip } from '@shared/ui'
import { VAULT_FACTORY_ADDRESSES } from '@shared/utilities'
import classNames from 'classnames'
import { useSetAtom } from 'jotai'
import { vaultAddressAtom } from 'src/atoms'
import { SupportedNetwork } from 'src/types'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { useSendApproveYieldBufferTransaction } from '@hooks/useSendApproveYieldBufferTransaction'
import { useUserDeployedVaults } from '@hooks/useUserDeployedVaults'
import { useVaultInfo } from '@hooks/useVaultInfo'

interface DeployVaultButtonProps {
  onSuccess?: () => void
  className?: string
  innerClassName?: string
}

export const DeployVaultButton = (props: DeployVaultButtonProps) => {
  const { onSuccess, className, innerClassName } = props

  const { address: userAddress } = useAccount()

  const vaultInfo = useVaultInfo()
  const { chainId, tokenAddress, yieldBuffer } = vaultInfo

  const {
    data: token,
    isFetched: isFetchedToken,
    refetch: refetchUserTokenBalance
  } = useTokenBalance(
    chainId as SupportedNetwork,
    userAddress as Address,
    tokenAddress as Address,
    { refetchOnWindowFocus: true }
  )

  const vaultFactoryAddress = !!chainId ? VAULT_FACTORY_ADDRESSES[chainId] : undefined

  const {
    data: allowance,
    isFetched: isFetchedAllowance,
    refetch: refetchAllowance
  } = useTokenAllowance(
    chainId as SupportedNetwork,
    userAddress as Address,
    vaultFactoryAddress as Address,
    token?.address as Address
  )

  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()
  const addRecentTransaction = useAddRecentTransaction()

  const setVaultAddress = useSetAtom(vaultAddressAtom)

  const { addVault } = useUserDeployedVaults()

  const {
    isWaiting: isWaitingApproval,
    isConfirming: isConfirmingApproval,
    isSuccess: isSuccessfulApproval,
    txHash: approvalTxHash,
    sendApproveYieldBufferTransaction: sendApproveYieldBufferTransaction
  } = useSendApproveYieldBufferTransaction({
    onSuccess: () => {
      refetchAllowance()
    }
  })

  const {
    isWaiting: isWaitingDeploy,
    isConfirming: isConfirmingDeploy,
    isSuccess: isSuccessfulDeploy,
    txHash: deployTxHash,
    sendDeployVaultTransaction
  } = useSendDeployVaultTransaction(vaultInfo as VaultDeployInfo, {
    onSend: (txHash) => {
      if (!!chainId) {
        createDeployVaultTxToast({ chainId: chainId, txHash, addRecentTransaction })
      }
    },
    onSuccess: (txReceipt) => {
      if (!!chainId) {
        const vaultAddress = txReceipt.logs[0].address
        setVaultAddress(vaultAddress)
        addVault({ chainId: chainId, address: vaultAddress })
        refetchUserTokenBalance()
      }
      onSuccess?.()
    }
  })

  const isDataFetched =
    !!userAddress &&
    !!chainId &&
    !!token &&
    isFetchedToken &&
    allowance !== undefined &&
    isFetchedAllowance &&
    !!yieldBuffer

  const buttonClassName = classNames(
    'min-w-[9rem] !bg-pt-purple-600 !border-pt-purple-600 hover:!bg-pt-purple-700 focus:outline-transparent',
    className
  )
  const buttonInnerClassName = classNames(
    'flex gap-2 items-center text-pt-purple-50',
    innerClassName
  )

  if (!chainId) {
    return <></>
  }

  if (isDataFetched && allowance < yieldBuffer) {
    return (
      <TransactionButton
        chainId={chainId}
        isTxLoading={isWaitingApproval || isConfirmingApproval}
        isTxSuccess={isSuccessfulApproval}
        write={sendApproveYieldBufferTransaction}
        txHash={approvalTxHash}
        txDescription={`Approve ${token?.symbol} Buffer`}
        disabled={!isDataFetched}
        openConnectModal={openConnectModal}
        openChainModal={openChainModal}
        addRecentTransaction={addRecentTransaction}
        color='purple'
        className={buttonClassName}
        innerClassName={buttonInnerClassName}
      >
        <span>Approve Yield Buffer</span>
        <Tooltip
          content={`This is a small amount of ${token?.symbol} that will be deposited initially to prevent rounding errors on your new prize vault.`}
          className='max-w-xs whitespace-normal'
        >
          <InformationCircleIcon className='h-5 w-5' />
        </Tooltip>
      </TransactionButton>
    )
  }

  return (
    <TransactionButton
      chainId={chainId}
      isTxLoading={isWaitingDeploy || isConfirmingDeploy}
      isTxSuccess={isSuccessfulDeploy}
      write={sendDeployVaultTransaction}
      txHash={deployTxHash}
      txDescription={`Deploy ${token?.symbol} Vault`}
      disabled={!isDataFetched}
      openConnectModal={openConnectModal}
      openChainModal={openChainModal}
      addRecentTransaction={addRecentTransaction}
      color='purple'
      className={buttonClassName}
      innerClassName={buttonInnerClassName}
    >
      Deploy Vault <ArrowRightIcon className='w-4 h-4' />
    </TransactionButton>
  )
}
