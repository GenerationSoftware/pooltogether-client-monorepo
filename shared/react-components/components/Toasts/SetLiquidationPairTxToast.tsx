import { XMarkIcon } from '@heroicons/react/24/outline'
import {
  getBlockExplorerName,
  getBlockExplorerUrl,
  getNiceNetworkNameByChainId,
  NETWORK
} from '@pooltogether/hyperstructure-client-js'
import { Spinner, toast } from '@shared/ui'
import { ReactNode, useEffect } from 'react'
import { useWaitForTransaction } from 'wagmi'

export interface SetLiquidationPairTxToastProps {
  chainId: NETWORK
  txHash: `0x${string}`
  addRecentTransaction?: (tx: { hash: string; description: string; confirmations?: number }) => void
}

/**
 * Function to create original liquidation pair setting TX toast while confirming transaction
 *
 * This toast will then update itself on TX success or fail
 */
export const createSetLiquidationPairTxToast = (data: SetLiquidationPairTxToastProps) => {
  toast(<SetLiquidationPairTxToast {...data} />, { id: data.txHash })
}

export const SetLiquidationPairTxToast = (props: SetLiquidationPairTxToastProps) => {
  const { chainId, txHash, addRecentTransaction } = props

  const { isLoading, isSuccess, isError } = useWaitForTransaction({
    chainId,
    hash: txHash
  })

  useEffect(() => {
    if (isSuccess && !!txHash) {
      if (!!addRecentTransaction) {
        const networkName = getNiceNetworkNameByChainId(chainId)
        const txDescription = 'Set Liquidation Pair'

        addRecentTransaction({
          hash: txHash,
          description: `${networkName}: ${txDescription}`
        })
      }
    }
  }, [isSuccess, txHash])

  if (!isLoading && isSuccess) {
    toast(
      <ToastLayout id={txHash}>
        <SuccessView chainId={chainId} txHash={txHash} />
      </ToastLayout>,
      { id: txHash }
    )
  }

  if (!isLoading && !isSuccess && isError) {
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
        <Spinner className='after:border-y-pt-teal' /> Setting liquidation pair...
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
        <span className='text-pt-purple-50'>
          You set a liquidation pair to a prize vault on {network}
        </span>
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
