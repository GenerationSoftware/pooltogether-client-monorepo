import { formatNumberForDisplay, Vault } from '@pooltogether/hyperstructure-client-js'
import { useVaultTokenData } from '@pooltogether/hyperstructure-react-hooks'
import { Button, Spinner } from '@shared/ui'
import { useAtomValue } from 'jotai'
import { PrizePoolBadge } from '../../../Badges/PrizePoolBadge'
import { withdrawFormTokenAmountAtom } from '../../../Form/WithdrawForm'

interface WaitingViewProps {
  vault: Vault
  closeModal: () => void
}

export const WaitingView = (props: WaitingViewProps) => {
  const { vault, closeModal } = props

  const formTokenAmount = useAtomValue(withdrawFormTokenAmountAtom)

  const { data: tokenData } = useVaultTokenData(vault)

  return (
    <div className='flex flex-col gap-4 md:gap-6'>
      <span className='text-lg font-semibold text-center'>Confirm Transaction in Wallet</span>
      <PrizePoolBadge chainId={vault.chainId} hideBorder={true} className='!py-1 mx-auto' />
      <span className='text-sm text-center md:text-base'>
        Withdrawing {formatNumberForDisplay(formTokenAmount)} {tokenData?.symbol}...
      </span>
      <Spinner size='lg' className='mx-auto after:border-y-pt-teal' />
      <div className='flex items-end h-24 md:h-36'>
        <Button fullSized={true} color='transparent' onClick={closeModal}>
          Close
        </Button>
      </div>
    </div>
  )
}
