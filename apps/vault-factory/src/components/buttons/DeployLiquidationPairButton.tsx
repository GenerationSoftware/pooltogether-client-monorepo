import { useSendDeployLiquidationPairTransaction } from '@generationsoftware/hyperstructure-react-hooks'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { useAddRecentTransaction, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { createDeployLiquidationPairTxToast, TransactionButton } from '@shared/react-components'
import { PairCreateInfo } from '@shared/types'
import classNames from 'classnames'
import { useSetAtom } from 'jotai'
import { liquidationPairAddressAtom } from 'src/atoms'
import { SupportedNetwork } from 'src/types'
import { Address, isAddress } from 'viem'
import { useLiquidationPairInfo } from '@hooks/useLiquidationPairInfo'

interface DeployLiquidationPairButtonProps {
  chainId: SupportedNetwork
  vaultAddress: Address
  onSuccess?: () => void
  className?: string
  innerClassName?: string
}

export const DeployLiquidationPairButton = (props: DeployLiquidationPairButtonProps) => {
  const { chainId, vaultAddress, onSuccess, className, innerClassName } = props

  const liquidationPairInfo = useLiquidationPairInfo(chainId, vaultAddress)

  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()
  const addRecentTransaction = useAddRecentTransaction()

  const setLiquidationPairAddress = useSetAtom(liquidationPairAddressAtom)

  const {
    isWaiting: isWaitingDeploy,
    isConfirming: isConfirmingDeploy,
    isSuccess: isSuccessfulDeploy,
    txHash: deployTxHash,
    sendDeployLiquidationPairTransaction
  } = useSendDeployLiquidationPairTransaction(liquidationPairInfo as PairCreateInfo, {
    onSend: (txHash) => {
      createDeployLiquidationPairTxToast({ chainId, txHash, addRecentTransaction })
    },
    onSuccess: (txReceipt) => {
      const liquidationPairAddress = txReceipt.logs[0].address
      if (isAddress(liquidationPairAddress)) {
        setLiquidationPairAddress(liquidationPairAddress)
      }
      onSuccess?.()
    }
  })

  const deployLiquidationPairEnabled = !!sendDeployLiquidationPairTransaction

  return (
    <TransactionButton
      chainId={chainId}
      isTxLoading={isWaitingDeploy || isConfirmingDeploy}
      isTxSuccess={isSuccessfulDeploy}
      write={sendDeployLiquidationPairTransaction}
      txHash={deployTxHash}
      txDescription={`Deploy Liquidation Pair`}
      disabled={!deployLiquidationPairEnabled}
      openConnectModal={openConnectModal}
      openChainModal={openChainModal}
      addRecentTransaction={addRecentTransaction}
      color='purple'
      className={classNames(
        'w-56 !bg-pt-purple-600 !border-pt-purple-600 hover:!bg-pt-purple-700 focus:outline-transparent',
        className
      )}
      innerClassName={classNames('flex gap-2 items-center text-pt-purple-50', innerClassName)}
    >
      Deploy Liquidation Pair <ArrowRightIcon className='w-4 h-4' />
    </TransactionButton>
  )
}
