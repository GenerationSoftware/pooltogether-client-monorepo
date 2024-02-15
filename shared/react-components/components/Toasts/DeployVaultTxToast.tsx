import { XMarkIcon } from '@heroicons/react/24/outline'
import { Spinner, toast } from '@shared/ui'
import {
  getBlockExplorerName,
  getBlockExplorerUrl,
  getNiceNetworkNameByChainId,
  NETWORK
} from '@shared/utilities'
import { ReactNode, useEffect } from 'react'
import { useWaitForTransactionReceipt } from 'wagmi'

export interface DeployVaultTxToastProps {
  chainId: NETWORK
  txHash: `0x${string}`
  addRecentTransaction?: (tx: { hash: string; description: string; confirmations?: number }) => void
}

/**
 * Function to create original vault deployment TX toast while confirming transaction
 *
 * This toast will then update itself on TX success or fail
 */
export const createDeployVaultTxToast = (data: DeployVaultTxToastProps) => {
  toast(<DeployVaultTxToast {...data} />, { id: data.txHash })
}

export const DeployVaultTxToast = (props: DeployVaultTxToastProps) => {
  const { chainId, txHash, addRecentTransaction } = props

  const { isFetching, isSuccess, isError } = useWaitForTransactionReceipt({
    chainId,
    hash: txHash
  })

  useEffect(() => {
    if (isSuccess && !!txHash) {
      if (!!addRecentTransaction) {
        const networkName = getNiceNetworkNameByChainId(chainId)
        const txDescription = 'Prize Vault Deployment'

        addRecentTransaction({
          hash: txHash,
          description: `${networkName}: ${txDescription}`
        })
      }
    }
  }, [isSuccess, txHash])

  if (!isFetching && isSuccess) {
    toast(
      <ToastLayout id={txHash}>
        <SuccessView chainId={chainId} txHash={txHash} />
      </ToastLayout>,
      { id: txHash }
    )
  }

  if (!isFetching && !isSuccess && isError) {
    toast(
      <ToastLayout id={txHash}>
        <ErrorView chainId={chainId} txHash={txHash} />
      </ToastLayout>,
      { id: txHash }
    )
  }

  return (
    <ToastLayout id={txHash}>
      <ConfirmingView chainId={chainId} txHash={txHash} />
    </ToastLayout>
  )
}

interface ToastLayoutProps {
  id: string | number
  children: ReactNode
}

const ToastLayout = (props: ToastLayoutProps) => {
  const { id, children } = props

  return (
    <div className='relative w-full flex flex-col gap-2 items-center text-center smSonner:w-80'>
      {children}
      <XMarkIcon
        className='absolute top-0 right-0 h-3 w-3 text-pt-purple-100 cursor-pointer'
        onClick={() => toast.dismiss(id)}
      />
    </div>
  )
}

interface ConfirmingViewProps {
  chainId: NETWORK
  txHash: string
}

const ConfirmingView = (props: ConfirmingViewProps) => {
  const { chainId, txHash } = props

  const name = getBlockExplorerName(chainId)

  return (
    <>
      <span className='flex items-center gap-2 text-pt-purple-50'>
        <Spinner className='after:border-y-pt-teal' /> Deploying prize vault...
      </span>
      <a
        href={getBlockExplorerUrl(chainId, txHash, 'tx')}
        target='_blank'
        className='text-xs text-pt-teal'
      >
        View on {name}
      </a>
    </>
  )
}

interface SuccessViewProps {
  chainId: NETWORK
  txHash: string
}

const SuccessView = (props: SuccessViewProps) => {
  const { chainId, txHash } = props

  const network = getNiceNetworkNameByChainId(chainId)
  const name = getBlockExplorerName(chainId)

  return (
    <>
      <div className='flex flex-col items-center text-center'>
        <span className='text-xl font-semibold text-pt-teal'>Success!</span>
        <span className='text-pt-purple-50'>You deployed a prize vault on {network}</span>
      </div>
      <a
        href={getBlockExplorerUrl(chainId, txHash, 'tx')}
        target='_blank'
        className='text-xs text-pt-teal'
      >
        View on {name}
      </a>
    </>
  )
}

interface ErrorViewProps {
  chainId: NETWORK
  txHash: string
}

const ErrorView = (props: ErrorViewProps) => {
  const { chainId, txHash } = props

  const name = getBlockExplorerName(chainId)

  return (
    <>
      <div className='flex flex-col items-center text-center'>
        <span className='text-xl font-semibold text-[#EA8686]'>Uh oh!</span>
        <span className='text-pt-purple-50'>Something went wrong...</span>
      </div>
      <a
        href={getBlockExplorerUrl(chainId, txHash, 'tx')}
        target='_blank'
        className='text-xs text-pt-teal'
      >
        View on {name}
      </a>
    </>
  )
}
