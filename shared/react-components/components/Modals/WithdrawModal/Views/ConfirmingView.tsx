import {
  formatNumberForDisplay,
  getBlockExplorerName,
  getBlockExplorerUrl,
  Vault
} from '@pooltogether/hyperstructure-client-js'
import { Button, ExternalLink, Spinner } from '@shared/ui'
import { useAtomValue } from 'jotai'
import { NetworkBadge } from '../../../Badges/NetworkBadge'
import { withdrawFormTokenAmountAtom } from '../../../Form/WithdrawForm'

interface ConfirmingViewProps {
  vault: Vault
  closeModal: () => void
  txHash?: string
}

export const ConfirmingView = (props: ConfirmingViewProps) => {
  const { vault, txHash, closeModal } = props

  const formTokenAmount = useAtomValue(withdrawFormTokenAmountAtom)

  return (
    <div className='flex flex-col gap-6'>
      <span className='text-lg font-semibold text-center'>Transaction Submitted</span>
      <NetworkBadge
        chainId={vault.chainId}
        appendText='Prize Pool'
        hideBorder={true}
        className='!py-1 mx-auto'
      />
      <span className='text-sm text-center md:text-base'>
        Withdrawing {formatNumberForDisplay(formTokenAmount)} {vault.tokenData?.symbol}...
      </span>
      <Spinner size='lg' className='mx-auto after:border-y-pt-teal' />
      <div className='flex flex-col w-full justify-end h-24 gap-4 md:h-36 md:gap-6'>
        {!!txHash && (
          <ExternalLink
            href={getBlockExplorerUrl(vault.chainId, txHash, 'tx')}
            text={`View on ${getBlockExplorerName(vault.chainId)}`}
            size='sm'
            className='mx-auto text-pt-purple-100'
          />
        )}
        <Button fullSized={true} color='transparent' onClick={closeModal}>
          Close
        </Button>
      </div>
    </div>
  )
}
