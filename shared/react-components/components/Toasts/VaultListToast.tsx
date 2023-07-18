import { XMarkIcon } from '@heroicons/react/24/outline'
import { useCachedVaultLists } from '@pooltogether/hyperstructure-react-hooks'
import { Intl } from '@shared/types'
import { Spinner, toast } from '@shared/ui'
import { ReactNode } from 'react'

export interface VaultListToastProps {
  vaultListSrc: string
  state: 'importing' | 'success' | 'error'
  intl?: Intl<'importingFrom' | 'successfulImport' | 'selectedVaultList' | 'failedImport'>
}

/**
 * Function to create vault list toast while importing it
 */
export const createVaultListToast = (data: VaultListToastProps) => {
  toast(<VaultListToast {...data} />, { id: data.vaultListSrc })
}

export const VaultListToast = (props: VaultListToastProps) => {
  const { vaultListSrc, state, intl } = props

  if (state === 'success') {
    toast(
      <ToastLayout id={vaultListSrc}>
        <SuccessView src={vaultListSrc} intl={intl} />
      </ToastLayout>,
      { id: vaultListSrc }
    )
  }

  if (state === 'error') {
    toast(
      <ToastLayout id={vaultListSrc}>
        <ErrorView src={vaultListSrc} intl={intl} />
      </ToastLayout>,
      { id: vaultListSrc }
    )
  }

  return (
    <ToastLayout id={vaultListSrc}>
      <ImportingView src={vaultListSrc} intl={intl} />
    </ToastLayout>
  )
}

interface ToastLayoutProps {
  id: string
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

interface ImportingViewProps {
  src: string
  intl?: Intl<'importingFrom'>
}

const ImportingView = (props: ImportingViewProps) => {
  const { src, intl } = props

  const cleanSrc = getCleanVaultListSrc(src)

  return (
    <span className='flex items-center gap-2 text-pt-purple-50'>
      <Spinner className='after:border-y-pt-teal' />{' '}
      {intl?.('importingFrom', { src: cleanSrc }) ?? `Importing Vault List from ${cleanSrc}...`}
    </span>
  )
}

interface SuccessViewProps {
  src: string
  intl?: Intl<'successfulImport' | 'selectedVaultList'>
}

const SuccessView = (props: SuccessViewProps) => {
  const { src, intl } = props

  const { cachedVaultLists } = useCachedVaultLists()

  const name = cachedVaultLists[src]?.name

  return (
    <div className='flex flex-col gap-2 text-pt-purple-50'>
      <span>{intl?.('successfulImport') ?? 'Successfully imported a vault list.'}</span>
      {!!name && (
        <span>
          {intl?.('selectedVaultList', { name }) ??
            `"${name}" has been added to your currently selected vault lists.`}
        </span>
      )}
    </div>
  )
}

interface ErrorViewProps {
  src: string
  intl?: Intl<'failedImport'>
}

const ErrorView = (props: ErrorViewProps) => {
  const { src, intl } = props

  const cleanSrc = getCleanVaultListSrc(src)

  return (
    <span className='flex items-center gap-2 text-pt-purple-50'>
      {intl?.('failedImport', { src: cleanSrc }) ??
        `Something went wrong while importing a vault list from ${cleanSrc}.`}
    </span>
  )
}

const getCleanVaultListSrc = (src: string) => {
  if (src.startsWith('http')) {
    return /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/i.exec(src)?.[1] ?? ''
  } else if (src.startsWith('ipfs')) {
    return 'IPFS'
  } else if (src.endsWith('.eth')) {
    return 'ENS'
  } else {
    return '?'
  }
}
