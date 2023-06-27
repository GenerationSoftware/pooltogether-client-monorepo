import {
  formatNumberForDisplay,
  getBlockExplorerName,
  getBlockExplorerUrl,
  Vault
} from '@pooltogether/hyperstructure-client-js'
import { Button, ExternalLink } from '@shared/ui'
import { useAtomValue } from 'jotai'
import { NetworkBadge } from '../../../Badges/NetworkBadge'
import { depositFormTokenAmountAtom } from '../../../Form/DepositForm'
import { SuccessPooly } from '../../../Graphics/SuccessPooly'

interface SuccessViewProps {
  vault: Vault
  closeModal: () => void
  txHash?: string
  goToAccount?: () => void
}

export const SuccessView = (props: SuccessViewProps) => {
  const { vault, txHash, closeModal, goToAccount } = props

  const formTokenAmount = useAtomValue(depositFormTokenAmountAtom)

  return (
    <div className='flex flex-col gap-6 items-center'>
      <div className='flex flex-col gap-3 items-center'>
        <div className='flex flex-col items-center text-lg font-medium text-center'>
          <span className='text-pt-teal'>Success!</span>
          <span>
            You deposited {formatNumberForDisplay(formTokenAmount)} {vault.tokenData?.symbol}
          </span>
        </div>
        <NetworkBadge
          chainId={vault.chainId}
          appendText='Prize Pool'
          hideBorder={true}
          className='!py-1'
        />
        <SuccessPooly className='w-40 h-auto mt-3' />
      </div>
      <span className='text-sm text-center md:text-base'>
        You are now eligible for all future draws in this pool.
      </span>
      {!!txHash && (
        <ExternalLink
          href={getBlockExplorerUrl(vault.chainId, txHash, 'tx')}
          text={`View on ${getBlockExplorerName(vault.chainId)}`}
          size='sm'
          className='text-pt-teal'
        />
      )}
      {/* TODO: implement twitter sharing and enable button */}
      <Button fullSized={true} disabled>
        Share Tweet
      </Button>
      {/* TODO: implement lenster sharing and enable button */}
      <Button fullSized={true} disabled>
        Share on Lenster
      </Button>
      {!!goToAccount && (
        <Button
          fullSized={true}
          color='transparent'
          onClick={() => {
            goToAccount()
            closeModal()
          }}
        >
          View Account
        </Button>
      )}
    </div>
  )
}
