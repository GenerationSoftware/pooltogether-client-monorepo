import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useSelectedVault,
  useTokenBalance,
  useUserVaultShareBalance,
  useUserVaultTokenBalance,
  useVaultBalance,
  useVaultShareData,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { MODAL_KEYS, useIsModalOpen } from '@shared/generic-react-hooks'
import { Intl } from '@shared/types'
import { Spinner, toast } from '@shared/ui'
import {
  getBlockExplorerName,
  getBlockExplorerUrl,
  getNiceNetworkNameByChainId
} from '@shared/utilities'
import { ReactNode, useEffect } from 'react'
import { Address } from 'viem'
import { useAccount, useWaitForTransactionReceipt } from 'wagmi'
import { ErrorPooly } from '../Graphics/ErrorPooly'
import { SuccessPooly } from '../Graphics/SuccessPooly'

export interface DepositTxToastProps {
  vault: Vault
  txHash: string
  addRecentTransaction?: (tx: { hash: string; description: string; confirmations?: number }) => void
  refetchUserBalances?: () => void
  intl?: Intl<
    | 'deposit'
    | 'depositingInto'
    | 'viewOn'
    | 'success'
    | 'depositedInto'
    | 'uhOh'
    | 'failedTx'
    | 'tryAgain'
  >
}

/**
 * Function to create original deposit TX toast while confirming transaction
 *
 * This toast will then update itself on TX success or fail
 */
export const createDepositTxToast = (data: DepositTxToastProps) => {
  toast(<DepositTxToast {...data} />, { id: data.txHash })
}

export const DepositTxToast = (props: DepositTxToastProps) => {
  const { vault, txHash, addRecentTransaction, refetchUserBalances, intl } = props

  const { data: tokenData } = useVaultTokenData(vault)

  const { isFetching, isSuccess, isError } = useWaitForTransactionReceipt({
    chainId: vault.chainId,
    hash: txHash as Address
  })

  const { address: userAddress } = useAccount()

  const { refetch: refetchTokenBalance } = useTokenBalance(
    vault.chainId,
    userAddress!,
    tokenData?.address!
  )

  const { refetch: refetchVaultBalance } = useVaultBalance(vault)

  const { refetch: refetchUserVaultShareBalance } = useUserVaultShareBalance(vault, userAddress!)

  const { refetch: refetchUserVaultTokenBalance } = useUserVaultTokenBalance(vault, userAddress!)

  useEffect(() => {
    if (isSuccess && !!txHash) {
      if (!!addRecentTransaction) {
        const networkName = getNiceNetworkNameByChainId(vault.chainId)
        const txDescription = `${tokenData?.symbol} ${intl?.('deposit') ?? 'Deposit'}`

        addRecentTransaction({
          hash: txHash,
          description: `${networkName}: ${txDescription}`
        })
      }

      refetchTokenBalance()
      refetchVaultBalance()
      refetchUserVaultShareBalance()
      refetchUserVaultTokenBalance()
      refetchUserBalances?.()
    }
  }, [isSuccess, txHash])

  if (!isFetching && isSuccess) {
    toast(
      <ToastLayout id={txHash}>
        <SuccessView vault={vault} txHash={txHash} intl={intl} />
      </ToastLayout>,
      { id: txHash }
    )
  }

  if (!isFetching && !isSuccess && isError) {
    toast(
      <ToastLayout id={txHash}>
        <ErrorView vault={vault} txHash={txHash} intl={intl} />
      </ToastLayout>,
      { id: txHash }
    )
  }

  return (
    <ToastLayout id={txHash}>
      <ConfirmingView vault={vault} txHash={txHash} intl={intl} />
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
  vault: Vault
  txHash: string
  intl?: Intl<'depositingInto' | 'viewOn'>
}

const ConfirmingView = (props: ConfirmingViewProps) => {
  const { vault, txHash, intl } = props

  const { data: share } = useVaultShareData(vault)

  const vaultSymbol = `${share?.symbol ?? '?'}`
  const name = getBlockExplorerName(vault.chainId)

  return (
    <>
      <span className='flex items-center gap-2 text-pt-purple-50'>
        <Spinner className='after:border-y-pt-teal' />{' '}
        {intl?.('depositingInto', { vault: vaultSymbol }) ?? `Depositing into ${vaultSymbol}...`}
      </span>
      <a
        href={getBlockExplorerUrl(vault.chainId, txHash, 'tx')}
        target='_blank'
        className='text-xs text-pt-teal'
      >
        {intl?.('viewOn', { name }) ?? `View on ${name}`}
      </a>
    </>
  )
}

interface SuccessViewProps {
  vault: Vault
  txHash: string
  intl?: Intl<'success' | 'depositedInto' | 'viewOn'>
}

const SuccessView = (props: SuccessViewProps) => {
  const { vault, txHash, intl } = props

  const { data: share } = useVaultShareData(vault)

  const vaultSymbol = `${share?.symbol ?? '?'}`
  const network = getNiceNetworkNameByChainId(vault.chainId)
  const name = getBlockExplorerName(vault.chainId)

  return (
    <>
      <SuccessPooly className='w-16 h-auto' />
      <div className='flex flex-col items-center text-center'>
        <span className='text-xl font-semibold text-pt-teal'>
          {intl?.('success') ?? 'Success!'}
        </span>
        <span className='text-pt-purple-50'>
          {intl?.('depositedInto', { vault: vaultSymbol, network }) ??
            `You deposited into ${vaultSymbol} on ${network}`}
        </span>
      </div>
      <a
        href={getBlockExplorerUrl(vault.chainId, txHash, 'tx')}
        target='_blank'
        className='text-xs text-pt-teal'
      >
        {intl?.('viewOn', { name }) ?? `View on ${name}`}
      </a>
    </>
  )
}

interface ErrorViewProps {
  vault: Vault
  txHash: string
  intl?: Intl<'uhOh' | 'failedTx' | 'tryAgain' | 'viewOn'>
}

const ErrorView = (props: ErrorViewProps) => {
  const { vault, txHash, intl } = props

  const { setSelectedVaultById } = useSelectedVault()

  const { setIsModalOpen } = useIsModalOpen(MODAL_KEYS.deposit)

  const handleRetry = () => {
    setSelectedVaultById(vault.id)
    setIsModalOpen(true)
  }

  const name = getBlockExplorerName(vault.chainId)

  return (
    <>
      <ErrorPooly className='w-16 h-auto' />
      <div className='flex flex-col items-center text-center'>
        <span className='text-xl font-semibold text-[#EA8686]'>{intl?.('uhOh') ?? 'Uh oh!'}</span>
        <span className='text-pt-purple-50'>{intl?.('failedTx') ?? 'Something went wrong...'}</span>
      </div>
      <span className='text-xs text-pt-purple-100'>
        <span onClick={handleRetry} className='text-pt-teal cursor-pointer'>
          {intl?.('tryAgain') ?? 'Try Again'}
        </span>{' '}
        |{' '}
        <a
          href={getBlockExplorerUrl(vault.chainId, txHash, 'tx')}
          target='_blank'
          className='text-pt-teal'
        >
          {intl?.('viewOn', { name }) ?? `View on ${name}`}
        </a>
      </span>
    </>
  )
}
