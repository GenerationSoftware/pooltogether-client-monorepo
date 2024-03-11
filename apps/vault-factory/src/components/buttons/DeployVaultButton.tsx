import {
  useSendDeployVaultTransaction,
  useToken
} from '@generationsoftware/hyperstructure-react-hooks'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { useAddRecentTransaction, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { createDeployVaultTxToast, TransactionButton } from '@shared/react-components'
import { VaultDeployInfo } from '@shared/types'
import classNames from 'classnames'
import { useSetAtom } from 'jotai'
import { vaultAddressAtom } from 'src/atoms'
import { SupportedNetwork } from 'src/types'
import { Address } from 'viem'
import { useDeployedVaults } from '@hooks/useDeployedVaults'
import { useVaultInfo } from '@hooks/useVaultInfo'

interface DeployVaultButtonProps {
  onSuccess?: () => void
  className?: string
  innerClassName?: string
}

export const DeployVaultButton = (props: DeployVaultButtonProps) => {
  const { onSuccess, className, innerClassName } = props

  const vault = useVaultInfo()

  const { data: tokenData } = useToken(
    vault.chainId as SupportedNetwork,
    vault.tokenAddress as Address
  )

  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()
  const addRecentTransaction = useAddRecentTransaction()

  const setVaultAddress = useSetAtom(vaultAddressAtom)

  const { addVault } = useDeployedVaults()

  const {
    isWaiting: isWaitingDeploy,
    isConfirming: isConfirmingDeploy,
    isSuccess: isSuccessfulDeploy,
    txHash: deployTxHash,
    sendDeployVaultTransaction
  } = useSendDeployVaultTransaction(vault as VaultDeployInfo, {
    onSend: (txHash) => {
      if (!!vault.chainId) {
        createDeployVaultTxToast({ chainId: vault.chainId, txHash, addRecentTransaction })
      }
    },
    onSuccess: (txReceipt) => {
      if (!!vault.chainId) {
        const vaultAddress = txReceipt.logs[0].address
        setVaultAddress(vaultAddress)
        addVault({ chainId: vault.chainId, address: vaultAddress })
      }
      onSuccess?.()
    }
  })

  const deployVaultEnabled = !!vault.chainId && !!tokenData && !!sendDeployVaultTransaction

  if (!vault.chainId) {
    return <></>
  }

  return (
    <TransactionButton
      chainId={vault.chainId}
      isTxLoading={isWaitingDeploy || isConfirmingDeploy}
      isTxSuccess={isSuccessfulDeploy}
      write={sendDeployVaultTransaction}
      txHash={deployTxHash}
      txDescription={`Deploy ${tokenData?.symbol} Vault`}
      disabled={!deployVaultEnabled}
      openConnectModal={openConnectModal}
      openChainModal={openChainModal}
      addRecentTransaction={addRecentTransaction}
      color='purple'
      className={classNames(
        'min-w-[9rem] !bg-pt-purple-600 !border-pt-purple-600 hover:!bg-pt-purple-700 focus:outline-transparent',
        className
      )}
      innerClassName={classNames('flex gap-2 items-center text-pt-purple-50', innerClassName)}
    >
      Deploy Vault <ArrowRightIcon className='w-4 h-4' />
    </TransactionButton>
  )
}
