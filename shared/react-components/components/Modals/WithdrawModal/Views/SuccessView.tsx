import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useVaultTokenData } from '@generationsoftware/hyperstructure-react-hooks'
import { Intl } from '@shared/types'
import { Button, ExternalLink } from '@shared/ui'
import {
  formatNumberForDisplay,
  getBlockExplorerName,
  getBlockExplorerUrl
} from '@shared/utilities'
import { useAtomValue } from 'jotai'
import { PrizePoolBadge } from '../../../Badges/PrizePoolBadge'
import { withdrawFormTokenAmountAtom } from '../../../Form/WithdrawForm'
import { SuccessPooly } from '../../../Graphics/SuccessPooly'

interface SuccessViewProps {
  vault: Vault
  closeModal: () => void
  txHash?: string
  goToAccount?: () => void
  intl?: {
    base?: Intl<'success' | 'withdrew' | 'viewAccount'>
    common?: Intl<'prizePool' | 'viewOn'>
  }
}

export const SuccessView = (props: SuccessViewProps) => {
  const { vault, txHash, closeModal, goToAccount, intl } = props

  const formTokenAmount = useAtomValue(withdrawFormTokenAmountAtom)

  const { data: tokenData } = useVaultTokenData(vault)

  const tokens = `${formatNumberForDisplay(formTokenAmount)} ${tokenData?.symbol}`
  const name = getBlockExplorerName(vault.chainId)

  return (
    <div className='flex flex-col gap-6 items-center'>
      <div className='flex flex-col gap-3 items-center'>
        <div className='flex flex-col items-center text-lg font-medium text-center'>
          <span className='text-pt-teal'>{intl?.base?.('success') ?? 'Success!'}</span>
          <span>{intl?.base?.('withdrew', { tokens }) ?? `You withdrew ${tokens}`}</span>
        </div>
        <PrizePoolBadge
          chainId={vault.chainId}
          hideBorder={true}
          intl={intl?.common}
          className='!py-1'
        />
        <SuccessPooly className='w-40 h-auto mt-3' />
      </div>
      {!!txHash && (
        <ExternalLink
          href={getBlockExplorerUrl(vault.chainId, txHash, 'tx')}
          size='sm'
          className='text-pt-teal'
        >
          {intl?.common?.('viewOn', { name }) ?? `View on ${name}`}
        </ExternalLink>
      )}
      {!!goToAccount && (
        <Button
          fullSized={true}
          color='transparent'
          onClick={() => {
            goToAccount()
            closeModal()
          }}
        >
          {intl?.base?.('viewAccount') ?? 'View Account'}
        </Button>
      )}
    </div>
  )
}
