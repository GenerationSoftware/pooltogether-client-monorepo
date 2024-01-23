import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useVaultTokenData } from '@generationsoftware/hyperstructure-react-hooks'
import { Intl } from '@shared/types'
import { Button, ExternalLink, Spinner } from '@shared/ui'
import {
  formatNumberForDisplay,
  getBlockExplorerName,
  getBlockExplorerUrl
} from '@shared/utilities'
import { useAtomValue } from 'jotai'
import { PrizePoolBadge } from '../../../Badges/PrizePoolBadge'
import { delegateFormTokenAmountAtom } from '../../../Form/DelegateForm'

interface ConfirmingViewProps {
  vault: Vault
  closeModal: () => void
  txHash?: string
  intl?: { base?: Intl<'submissionNotice' | 'delegating'>; common?: Intl<'close' | 'viewOn'> }
}

export const ConfirmingView = (props: ConfirmingViewProps) => {
  const { vault, txHash, closeModal, intl } = props

  const formTokenAmount = useAtomValue(delegateFormTokenAmountAtom)

  const { data: tokenData } = useVaultTokenData(vault)

  const tokens = `${formatNumberForDisplay(formTokenAmount)} ${tokenData?.symbol}`
  const name = getBlockExplorerName(vault.chainId)

  return (
    <div className='flex flex-col gap-6'>
      <span className='text-lg font-semibold text-center'>
        {intl?.base?.('submissionNotice') ?? 'Transaction Submitted'}
      </span>
      <PrizePoolBadge chainId={vault.chainId} hideBorder={true} className='!py-1 mx-auto' />
      <span className='text-sm text-center md:text-base'>
        {intl?.base?.('delegating', { tokens }) ?? `Delegating ${tokens}...`}
      </span>
      <Spinner size='lg' className='mx-auto after:border-y-pt-teal' />
      <div className='flex flex-col w-full justify-end h-24 gap-4 md:h-36 md:gap-6'>
        {!!txHash && (
          <ExternalLink
            href={getBlockExplorerUrl(vault.chainId, txHash, 'tx')}
            size='sm'
            className='mx-auto text-pt-purple-100'
          >
            {intl?.common?.('viewOn', { name }) ?? `View on ${name}`}
          </ExternalLink>
        )}
        <Button fullSized={true} color='transparent' onClick={closeModal}>
          {intl?.common?.('close') ?? 'Close'}
        </Button>
      </div>
    </div>
  )
}
